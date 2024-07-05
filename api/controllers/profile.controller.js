import { prisma } from '../utils/db.js';
import bcryptjs from 'bcryptjs';


export const test = (req, res) => {
    res.json({
        success: true,
        message: 'Success! API route is working',
    });
};

export const getProfile = async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
    });
    const { password, ...rest } = user;
    res.status(200).json(rest);
};

export const updateProfile = async (req, res) => {
    if(req.user.userId !== req.params.id) {
        return res.status(403).json({ message: 'You can only update your own profile' });
    }
    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });
    } catch (error) {
        
    }
};

export const deleteProfile = async (req, res) => {
    if(req.user.UserId !== req.params.id) {
        return res.status(403).json({ message: 'You can only delete your own profile' });
    }
    try {
        await prisma.user.delete({
            where: { id: parseInt(req.params.id) },
        });
    } catch (error) {
        
    }
};
