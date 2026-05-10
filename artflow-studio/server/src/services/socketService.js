const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow no-origin requests (mobile, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow Vercel preview/production domains
        if (/\.vercel\.app$/.test(origin)) return callback(null, true);
        // Allow localhost
        if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
        // Allow explicit artflow-live domain
        if (origin === 'https://artflow-live.vercel.app') return callback(null, true);
        // Allow explicit CLIENT_URL
        if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return callback(null, true);
        // In development, allow everything
        if (process.env.NODE_ENV !== 'production') return callback(null, true);
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join-user', (userId) => socket.join(`user-${userId}`));
    socket.on('join-admin', () => socket.join('admin-room'));
  });

  return io;
};

const getIO = () => io;

module.exports = { initializeSocket, getIO };
