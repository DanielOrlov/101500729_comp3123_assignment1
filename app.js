require("dotenv").config();

const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors');


const userRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employees');
const { connectDB } = require('./db');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// const allowedOrigins = [
//   "https://101500729-comp3123-assignment2-reac.vercel.app",
//   "http://localhost:3000"
// ];

const allowedOrigins = "http://localhost:3000";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true); // origin allowed
      }

      return callback(new Error("CORS blocked: Not allowed by CORS"), false);
    },

    credentials: true,
  })
);

connectDB()
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connect error:', err.message));

app.get('/', (_req, res) => {
  res.send(`
    <html>
      <head>
        <title>Vercel Express API</title>
        <style>
          body {
            background-color: #0d1117;
            color: #c9d1d9;
            font-family: system-ui, sans-serif;
            text-align: center;
            padding: 4rem;
          }
          a {
            color: #58a6ff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>✅ Deployment Successful</h1>
        <p>Your Express API is running on Vercel.</p>
        <p>Try these endpoints:</p>
        <ul style="list-style:none;padding:0">
          <li><a href="/api/health">/api/health</a></li>
          <li><a href="/api/v1/users">/api/v1/users</a></li>
          <li><a href="/api/v1/employees">/api/v1/employees</a></li>
        </ul>
      </body>
    </html>
  `);
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ✅ Mount routers at their final prefixes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/employees', employeeRoutes);

// (optional) 404 + error handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
