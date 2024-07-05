import express from 'express';
import { 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    searchProducts, 
 } from '../controllers/products.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', searchProducts);
router.get('/:productId', getProductById);
router.post('/create', verifyToken, createProduct);
router.put('/update/:productId', verifyToken, updateProduct);
router.delete('/delete/:productId', verifyToken, deleteProduct);

export default router;
