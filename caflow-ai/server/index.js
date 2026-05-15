const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'caflow-ai-secret-key-2024';
const DATA_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Simple JSON file database
class SimpleDB {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      }
    } catch (e) {
      console.log('Creating new database...');
    }
    return this.getDefaultData();
  }

  save() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
  }

  getDefaultData() {
    return {
      users: [],
      clients: [],
      documents: [],
      filings: [],
      tasks: [],
      payments: [],
      reminders: [],
      activities: [],
      ai_suggestions: [],
      notifications: [],
      messages: []
    };
  }

  create(collection, item) {
    const id = uuidv4();
    item.id = id;
    item.created_at = new Date().toISOString();
    this.data[collection].push(item);
    this.save();
    return id;
  }

  findAll(collection) {
    return this.data[collection] || [];
  }

  findOne(collection, id) {
    return this.data[collection].find(item => item.id === id);
  }

  findBy(collection, filter) {
    return this.data[collection].filter(item => {
      return Object.entries(filter).every(([key, value]) => item[key] === value);
    });
  }

  update(collection, id, updates) {
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[collection][index] = { ...this.data[collection][index], ...updates };
      this.save();
      return true;
    }
    return false;
  }

  delete(collection, id) {
    this.data[collection] = this.data[collection].filter(item => item.id !== id);
    this.save();
  }
}

const db = new SimpleDB();

const seedData = () => {
  if (db.findAll('users').length > 0) return;

  const adminId = uuidv4();
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.create('users', {
    email: 'admin@caflow.ai',
    password: hashedPassword,
    name: 'CA Admin',
    role: 'admin'
  });

  const clients = [
    { name: 'Ramesh Industries Pvt Ltd', email: 'ramesh@industry.com', phone: '+91 98765 10001', gst_number: '27AAACH1234P1Z5', business_type: 'private_ltd', city: 'Mumbai', state: 'Maharashtra', health_score: 85 },
    { name: 'Sharma Trading Company', email: 'sharma.trading@email.com', phone: '+91 98765 10002', gst_number: '19AAACH5678Q2Z8', business_type: 'proprietorship', city: 'Kolkata', state: 'West Bengal', health_score: 45 },
    { name: 'Tech Solutions LLP', email: 'contact@techsol.in', phone: '+91 98765 10003', gst_number: '29AABCT1234R1Z9', business_type: 'llp', city: 'Bangalore', state: 'Karnataka', health_score: 92 },
  ];

  clients.forEach((client) => {
    const clientId = db.create('clients', {
      ...client,
      whatsapp: client.phone,
      pan_number: 'XXXXX1234X',
      risk_level: client.health_score >= 70 ? 'low' : 'high',
      status: 'active',
      last_activity: new Date().toISOString()
    });

    db.create('tasks', {
      title: `File GST for ${client.name}`,
      description: `Monthly filing for ${client.name}`,
      client_id: clientId,
      assigned_to: adminId,
      status: 'pending',
      priority: 'medium',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
  });

  console.log('Demo data seeded successfully');
};

seedData();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// ============ AUTH ROUTES ============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'client', phone } = req.body;
    
    if (db.findBy('users', { email }).length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = db.create('users', {
      email, password: hashedPassword, name, role, phone
    });

    const token = jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { id: userId, email, name, role } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = db.findBy('users', { email })[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.findOne('users', req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

// ============ CLIENTS ROUTES ============
app.get('/api/clients', authenticateToken, (req, res) => {
  res.json(db.findAll('clients'));
});

app.get('/api/clients/:id', authenticateToken, (req, res) => {
  const client = db.findOne('clients', req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const documents = db.findBy('documents', { client_id: req.params.id });
  const filings = db.findBy('filings', { client_id: req.params.id });
  const tasks = db.findBy('tasks', { client_id: req.params.id });
  const payments = db.findBy('payments', { client_id: req.params.id });
  
  res.json({ ...client, documents, filings, tasks, payments });
});

app.post('/api/clients', authenticateToken, (req, res) => {
  try {
    const clientId = db.create('clients', {
      ...req.body,
      risk_level: req.body.health_score >= 70 ? 'low' : 'high',
      status: 'active'
    });

    db.create('activities', {
      client_id: clientId,
      user_id: req.user.userId,
      type: 'client_added',
      title: 'New client added',
      description: `${req.body.name} added to system`
    });

    res.status(201).json({ id: clientId, message: 'Client created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client' });
  }
});

app.put('/api/clients/:id', authenticateToken, (req, res) => {
  try {
    db.update('clients', req.params.id, {
      ...req.body,
      last_activity: new Date().toISOString()
    });
    res.json({ message: 'Client updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client' });
  }
});

app.delete('/api/clients/:id', authenticateToken, (req, res) => {
  try {
    db.delete('clients', req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// ============ DOCUMENTS ROUTES ============
app.get('/api/documents', authenticateToken, (req, res) => {
  const documents = db.findAll('documents').map(doc => {
    const client = db.findOne('clients', doc.client_id);
    return { ...doc, client_name: client?.name || 'Unknown' };
  });
  res.json(documents);
});

app.post('/api/documents', authenticateToken, (req, res) => {
  try {
    const docId = db.create('documents', {
      ...req.body,
      status: 'received',
      uploaded_at: new Date().toISOString()
    });
    
    db.update('clients', req.body.client_id, { last_activity: new Date().toISOString() });
    
    res.status(201).json({ id: docId, message: 'Document uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

app.put('/api/documents/:id', authenticateToken, (req, res) => {
  const { status, notes } = req.body;
  const updates = {};
  
  if (status) {
    updates.status = status;
    if (status === 'verified') {
      updates.verified_at = new Date().toISOString();
    }
  }
  if (notes) updates.notes = notes;
  
  db.update('documents', req.params.id, updates);
  res.json({ message: 'Document updated successfully' });
});

// ============ TASKS ROUTES ============
app.get('/api/tasks', authenticateToken, (req, res) => {
  const tasks = db.findAll('tasks').map(task => {
    const client = db.findOne('clients', task.client_id);
    return { ...task, client_name: client?.name || 'Unknown' };
  });
  res.json(tasks);
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  try {
    const taskId = db.create('tasks', {
      ...req.body,
      assigned_by: req.user.userId,
      status: 'pending'
    });
    res.status(201).json({ id: taskId, message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  const updates = {};
  
  if (status) {
    updates.status = status;
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
  }
  
  if (req.body.title) updates.title = req.body.title;
  if (req.body.description) updates.description = req.body.description;
  if (req.body.priority) updates.priority = req.body.priority;
  if (req.body.assigned_to) updates.assigned_to = req.body.assigned_to;
  
  db.update('tasks', req.params.id, updates);
  res.json({ message: 'Task updated successfully' });
});

// ============ REMINDERS ROUTES ============
app.get('/api/reminders', authenticateToken, (req, res) => {
  const reminders = db.findAll('reminders').map(rem => {
    const client = db.findOne('clients', rem.client_id);
    return { ...rem, client_name: client?.name || 'Unknown', client_phone: client?.phone || '' };
  });
  res.json(reminders);
});

app.post('/api/reminders', authenticateToken, (req, res) => {
  try {
    const reminderId = db.create('reminders', {
      ...req.body,
      created_by: req.user.userId,
      status: 'scheduled'
    });
    res.status(201).json({ id: reminderId, message: 'Reminder scheduled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

// ============ FILINGS ROUTES ============
app.get('/api/filings', authenticateToken, (req, res) => {
  const filings = db.findAll('filings').map(f => {
    const client = db.findOne('clients', f.client_id);
    return { ...f, client_name: client?.name || 'Unknown' };
  });
  res.json(filings);
});

app.post('/api/filings', authenticateToken, (req, res) => {
  try {
    const filingId = db.create('filings', req.body);
    res.status(201).json({ id: filingId, message: 'Filing created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create filing' });
  }
});

app.put('/api/filings/:id', authenticateToken, (req, res) => {
  const { status, acknowledgment_number } = req.body;
  const updates = {};
  
  if (status) {
    updates.status = status;
    if (status === 'filed') {
      updates.filed_at = new Date().toISOString();
    }
  }
  if (acknowledgment_number) updates.acknowledgment_number = acknowledgment_number;
  
  db.update('filings', req.params.id, updates);
  res.json({ message: 'Filing updated successfully' });
});

// ============ PAYMENTS ROUTES ============
app.get('/api/payments', authenticateToken, (req, res) => {
  const payments = db.findAll('payments').map(p => {
    const client = db.findOne('clients', p.client_id);
    return { ...p, client_name: client?.name || 'Unknown' };
  });
  res.json(payments);
});

app.post('/api/payments', authenticateToken, (req, res) => {
  try {
    const paymentId = db.create('payments', req.body);
    res.status(201).json({ id: paymentId, message: 'Payment record created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

app.put('/api/payments/:id', authenticateToken, (req, res) => {
  const { status, transaction_id } = req.body;
  const updates = {};
  
  if (status) {
    updates.status = status;
    if (status === 'paid') {
      updates.paid_at = new Date().toISOString();
    }
  }
  if (transaction_id) updates.transaction_id = transaction_id;
  
  db.update('payments', req.params.id, updates);
  res.json({ message: 'Payment updated successfully' });
});

// ============ DASHBOARD STATS ============
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const clients = db.findAll('clients');
  const documents = db.findAll('documents');
  const filings = db.findAll('filings');
  const payments = db.findAll('payments');
  const tasks = db.findAll('tasks');

  res.json({
    totalClients: clients.length,
    pendingDocuments: documents.filter(d => d.status === 'pending').length,
    pendingFilings: filings.filter(f => f.status === 'pending' || f.status === 'in_progress').length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    activeTasks: tasks.filter(t => t.status !== 'completed').length,
    overdueTasks: tasks.filter(t => t.status === 'delayed').length
  });
});

// ============ AI SUGGESTIONS ============
app.get('/api/ai/suggestions', authenticateToken, (req, res) => {
  const suggestions = [];
  const clients = db.findAll('clients');
  const filings = db.findAll('filings');

  filings.filter(f => f.status === 'overdue' && new Date(f.due_date) < new Date()).forEach(filing => {
    const client = db.findOne('clients', filing.client_id);
    suggestions.push({
      id: uuidv4(),
      type: 'deadline_approaching',
      title: `Overdue: ${filing.type.toUpperCase()}`,
      description: `${client?.name} - ${filing.period}`,
      client_id: filing.client_id,
      priority: 'urgent',
      action_required: 'File immediately'
    });
  });

  clients.filter(c => {
    if (!c.last_activity) return true;
    const daysSince = (Date.now() - new Date(c.last_activity)) / (1000 * 60 * 60 * 24);
    return daysSince > 14;
  }).forEach(client => {
    suggestions.push({
      id: uuidv4(),
      type: 'client_inactive',
      title: `Inactive: ${client.name}`,
      description: 'No activity for over 14 days',
      client_id: client.id,
      priority: 'high',
      action_required: 'Send follow-up'
    });
  });

  res.json(suggestions);
});

// ============ MESSAGES ============
app.get('/api/messages/:chatId', authenticateToken, (req, res) => {
  const messages = db.findBy('messages', { chat_id: req.params.chatId });
  res.json(messages);
});

app.post('/api/messages', authenticateToken, (req, res) => {
  try {
    const messageId = db.create('messages', {
      ...req.body,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
    res.status(201).json({ id: messageId, message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ============ NOTIFICATIONS ============
app.get('/api/notifications', authenticateToken, (req, res) => {
  const notifications = db.findBy('notifications', { user_id: req.user.userId });
  res.json(notifications.slice(0, 50));
});

app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  db.update('notifications', req.params.id, { read: 1 });
  res.json({ message: 'Notification marked as read' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CAFlow AI API is running',
    timestamp: new Date(),
    database: db.findAll('clients').length + ' clients'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    name: 'CAFlow AI Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: '/api/*'
  });
});

app.listen(PORT, () => {
  console.log(`CAFlow AI Backend running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});