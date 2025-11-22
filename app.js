import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import userRouter from './routes/users.js';
import employeeRouter from './routes/employees.js';

import { connectDB } from './db.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

await connectDB();

app.get('/health', (req, res) => res.json({ ok: true }));
app.use("/api/v1", userRouter)
app.use("/api/v1", employeeRouter)

export default app;
