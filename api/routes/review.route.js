import express from 'express';
import { 
    getReview, 
    createReview, 
    updateReview, 
    deleteReview,
    getProductReviews,
 } from '../controllers/reviews.controller.js';

 import { verifyToken } from '../utils/verifyUser.js';

 const router = express.Router();

 router.get('/get', getProductReviews);
 router.get('/get/:id', getReview);
 router.post('/create', verifyToken, createReview); 
 router.put('/update/:id', verifyToken, updateReview);
 router.delete('/delete/:id', verifyToken, deleteReview);

export default router;
