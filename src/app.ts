import express from 'express';
import { sequelize } from './config/database';
import userRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

sequelize.sync();

export default app;