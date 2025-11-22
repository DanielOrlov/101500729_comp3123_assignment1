const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employees');
const { connectDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connect error:', err.message));

app.get('/health', (_req, res) => res.json({ ok: true }));

// ✅ Mount routers at their final prefixes
app.use('/v1/users', userRoutes);
app.use('/v1/employees', employeeRoutes);

// (optional) 404 + error handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
