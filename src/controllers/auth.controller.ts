import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user.models';
import { successResponse, errorResponse} from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            errorResponse(res, null, 'Pengguna sudah terdaftar', 409, 'USER_EXISTS');
            return
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        successResponse(res, user, 'Registrasi berhasil', 201);
    } catch (error) {
        errorResponse(res, error, 'Terjadi kesalahan registrasi', 500, 'REGISTRATION_ERROR');
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
           errorResponse(res, null, 'Pengguna tidak ditemukan', 404, 'USER_NOT_FOUND');
           return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            errorResponse(res, null, 'Password salah', 401, 'INVALID_PASSWORD');
            return;
        }
        const token = jwt.sign({ id: user.id }, process.env.AUTH_SECRET!, { expiresIn: '1h' });
        successResponse(res, { token, user }, 'Login berhasil', 200);
    } catch (error) {
        errorResponse(res, error, 'Terjadi kesalahan login', 500, 'LOGIN_ERROR');
    }
};