import express from 'express';
import { deleteProfile,getProfile,test, updateProfile } from '../controllers/profile.controller.js';
import { verifiedUser } from '../utils/verifiedUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:id', verifiedUser,updateProfile);
router.delete('/delete/:id', verifiedUser, deleteProfile);
router.get('/:id', getProfile);


export default router;