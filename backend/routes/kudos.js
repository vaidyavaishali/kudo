import express from 'express';
import {
  sendKudo,
  getAllKudos,
  likeKudo,
  getAnalytics,
} from '../controllers/kudosController.js';

const kudorouter = express.Router();

// Send a kudo
kudorouter.post('/send', sendKudo);
kudorouter.get('/get', getAllKudos);
kudorouter.put('/:kudoId/like', likeKudo);
kudorouter.get('/analytics', getAnalytics);

export default kudorouter;
