import express from 'express';
// @ts-ignore
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

const FRONTEND_URL = (process.env.FRONTEND_URL || '').replace(/\/$/, '') || '*';

// Middleware
app.use(express.json());
// @ts-ignore
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
import petRouter from './routes/pet.js';
import myPetRouter from './routes/my-pet.js';
import categoryRouter from './routes/category.js';
import productRouter from './routes/product.js';
import serviceRouter from './routes/service.js';
import appointmentRouter from './routes/appointment.js';
import orderRouter from './routes/order.js';
import authRouter from './routes/auth.js';

app.use('/api/pets', petRouter);
app.use('/api/my-pets', myPetRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/services', serviceRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/orders', orderRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/', (_req: any, res: any) => {
  res.json({ status: 'ok', message: 'PetShop Backend está rodando 🐾' });
});

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  res.status(status).json({ error: message });
});

app.listen(PORT, () => console.log(`✅ Server rodando na porta ${PORT}`));
