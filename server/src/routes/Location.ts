// routes/location.ts
import express from 'express';
import { checkLocation } from '../controllers/LocationController';

const router = express.Router();

// Route to check location
router.post('/check-location', checkLocation);

export default router;
