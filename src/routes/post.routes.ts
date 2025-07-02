import express from 'express';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;