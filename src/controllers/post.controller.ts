import { Request, Response } from "express";
import { Post } from "../models/post.models";
import { successResponse, errorResponse } from "../utils/response";

export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']]
        });
        successResponse(res, posts, 'Postingan berhasil ditampilkan', 200);
    } catch (error) {
        errorResponse(res, error, 'Terjadi kesalahan menampilkan postingan', 500, 'POSTS_RETRIEVAL_ERROR');
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    const postId = parseInt(req.params.id, 10);
    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            errorResponse(res, null, 'Postingan tidak ditemukan', 404, 'POST_NOT_FOUND');
            return;
        }
        successResponse(res, post, 'Postingan berhasil ditampilkan', 200);
    } catch (error) {
        errorResponse(res, error, 'Terjadi kesalahan menampilkan postingan', 500, 'POST_RETRIEVAL_ERROR');
    }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
    const { content } = req.body;
    const authorId = req.user.id;

    if (!content) {
        errorResponse(res, null, 'Konten tidak boleh kosong', 400, 'CONTENT_REQUIRED');
        return; 
    }

    try {
        const post = await Post.create({ content, authorId });
        successResponse(res, post, 'Postingan berhasil dibuat', 201);
    } catch (error) {
        errorResponse(res, error, 'Terjadi kesalahan membuat postingan', 500, 'POST_CREATION_ERROR');
    }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    const postId = parseInt(req.params.id, 10);
    const { content } = req.body;
    const authorId = req.user.id;

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            errorResponse(res, null, 'Postingan tidak ditemukan', 404, 'POST_NOT_FOUND');
            return; 
        }
        if (post.authorId !== authorId) {
            errorResponse(res, null, 'Tidak memiliki akses untuk memperbarui postingan', 403, 'UNAUTHORIZED');
            return; 
        }
        post.content = content;
        await post.save();
        successResponse(res, post, 'Postingan berhasil diperbarui', 200);
    } catch (error) {
        errorResponse(res, error, 'Terjadi kesalahan memperbarui postingan', 500, 'POST_UPDATE_ERROR');
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    const postId = parseInt(req.params.id, 10);
    const authorId = req.user.id;

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            errorResponse(res, null, 'Postingan tidak ditemukan', 404, 'POST_NOT_FOUND');
            return; 
        }
        if (post.authorId !== authorId) {
            errorResponse(res, null, 'Tidak memiliki akses untuk menghapus postingan', 403, 'UNAUTHORIZED');
            return; 
        }
        await post.destroy();
        successResponse(res, null, 'Postingan berhasil dihapus', 200);
    } catch (error) {
        errorResponse(res, error, 'Terjadi kesalahan menghapus postingan', 500, 'POST_DELETION_ERROR');
    }
};