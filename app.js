const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employees');
const { connectDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// kick off the connection without top-level await
connectDB()
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connect error:', err.message));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/v1', userRoutes);
app.use('/api/v1', employeeRoutes);

module.exports = app;
