require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const { initializeDatabase, closeDatabase, addInstallation, getInstallation, addMessage } = require('./src/config/db');
const { logger } = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function verifySlackRequest(req, res, next) {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];

  if (!signature || !timestamp) {
    return res.status(401).json({ error: 'Missing signature or timestamp' });
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
    return res.status(401).json({ error: 'Request timestamp expired' });
  }

  const baseString = `v0:${timestamp}:${JSON.stringify(req.body)}`;
  const hmac = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET);
  const computedSignature = `v0=${hmac.update(baseString).digest('hex')}`;

  if (computedSignature !== signature) {
    logger.warn('Invalid Slack signature detected');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Anti Slack Webhook Server is running' });
});

app.get('/auth', (req, res) => {
  const code = req.query.code;
  const redirectUri = process.env.SLACK_REDIRECT_URI || `http://localhost:${PORT}/auth`;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  axios.post('https://slack.com/api/oauth.v2.access', new URLSearchParams({
    code,
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    redirect_uri: redirectUri
  }).toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .then(response => {
    if (response.data.ok) {
      addInstallation({
        team_id: response.data.team.id,
        team_name: response.data.team.name,
        bot_user_id: response.data.bot_user_id,
        bot_token: response.data.bot_token,
        bot_token_scopes: response.data.scope,
        access_token: response.data.access_token,
        enterprise_id: response.data.enterprise_id || null
      });
      logger.info(`Team ${response.data.team.id} installed successfully`);
      res.json({ ok: true, message: 'Installation successful' });
    } else {
      logger.error('OAuth failed:', response.data);
      res.status(400).json({ ok: false, error: response.data.error });
    }
  })
  .catch(err => {
    logger.error('OAuth error:', err);
    res.status(500).json({ error: 'OAuth failed' });
  });
});

app.post('/webhook', verifySlackRequest, async (req, res) => {
  const { type, challenge, event, payload } = req.body;

  if (type === 'url_verification') {
    return res.json({ challenge });
  }

  if (type === 'event_callback') {
    const teamId = req.body.team_id;

    if (event) {
      addMessage({
        channel_id: event.channel || null,
        team_id: teamId,
        user_id: event.user || null,
        message_ts: event.ts || null,
        event_type: event.type,
        payload: JSON.stringify(event)
      });
    }

    if (payload) {
      const interactivePayload = JSON.parse(payload);
      const action = interactivePayload.actions?.[0];
      
      if (action) {
        logger.info(`Interactive component action: ${action.action_id}`, {
          team_id: teamId,
          user_id: interactivePayload.user?.id,
          channel_id: interactivePayload.channel?.id
        });

        const responseUrl = interactivePayload.response_url;
        if (responseUrl) {
          await axios.post(responseUrl, {
            replace_original: true,
            text: `Action "${action.action_id}" processed successfully!`
          });
        }
      }
    }

    handleEvent(event, teamId).catch(err => {
      logger.error('Event handling error:', err);
    });

    return res.json({ ok: true });
  }

  if (type === 'interactive') {
    const interactivePayload = req.body.payload;
    const parsed = JSON.parse(interactivePayload);
    
    logger.info('Interactive component received:', {
      type: parsed.type,
      team_id: parsed.team?.id,
      user_id: parsed.user?.id
    });

    return res.json({ ok: true });
  }

  res.json({ ok: true });
});

async function handleEvent(event, teamId) {
  if (!event || !event.type) return;

  const install = getInstallation(teamId);
  const botToken = install?.bot_token || process.env.SLACK_BOT_TOKEN;

  switch (event.type) {
    case 'app_mention':
      logger.info(`App mentioned in channel ${event.channel} by user ${event.user}`);
      await axios.post('https://slack.com/api/chat.postMessage', {
        channel: event.channel,
        text: `Hello! I'm here to help. Received your mention at ${event.ts}`,
        thread_ts: event.ts
      }, { headers: { Authorization: `Bearer ${botToken}` } });
      break;

    case 'message':
      if (!event.subtype || event.subtype === 'message') {
        logger.info(`Message received in channel ${event.channel} from user ${event.user}`);
      }
      break;

    case 'member_joined_channel':
      logger.info(`User ${event.user} joined channel ${event.channel}`);
      await axios.post('https://slack.com/api/chat.postMessage', {
        channel: event.channel,
        text: `Welcome! Happy to have you here.`
      }, { headers: { Authorization: `Bearer ${botToken}` } });
      break;

    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }
}

app.use((err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

initializeDatabase();

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
});

module.exports = app;