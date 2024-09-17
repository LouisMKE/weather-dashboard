import { Router } from 'express';
import apiRoutes from './api/index.js'; // Adjust imports to include '.js'
import htmlRoutes from './htmlRoutes.js';

const router = Router();

// API routes for weather and city history
router.use('/api', apiRoutes);

// HTML routes to serve your frontend
router.use('/', htmlRoutes);

export default router;
