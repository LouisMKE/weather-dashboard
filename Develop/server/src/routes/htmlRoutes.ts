import { Router } from 'express';
import path from 'path';

const router = Router();

// Serve the index.html for the main route
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html')); // Adjust if necessary
});

export default router;
