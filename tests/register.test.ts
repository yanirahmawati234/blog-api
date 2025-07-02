import { register } from '../src/controllers/auth.controller';
import { User } from '../src/models/user.models';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../src/utils/response';

jest.mock('../src/models/user.models');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../src/utils/response');

const createMockRequest = (body: any): Partial<Request> => ({ body });
const createMockResponse = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe('register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return 409 if user already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });

    const req = createMockRequest({
      name: 'Yani',
      email: 'yani@mail.com',
      password: 'pass123',
    });
    const res = createMockResponse();

    await register(req as Request, res as Response);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'yani@mail.com' } });
    expect(errorResponse).toHaveBeenCalledWith(
      res,
      null,
      'Pengguna sudah terdaftar',
      409,
      'USER_EXISTS'
    );
  });

  it('should create user and return 201', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpass123');
    (User.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Yani',
      email: 'yani@mail.com',
    });

    const req = createMockRequest({
      name: 'Yani',
      email: 'yani@mail.com',
      password: 'pass123',
    });
    const res = createMockResponse();

    await register(req as Request, res as Response);

    expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);
    expect(User.create).toHaveBeenCalledWith({
      name: 'Yani',
      email: 'yani@mail.com',
      password: 'hashedpass123',
    });

    expect(successResponse).toHaveBeenCalledWith(
      res,
      { id: 1, name: 'Yani', email: 'yani@mail.com' },
      'Registrasi berhasil',
      201
    );
  });

  it('should handle errors and return 500', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

    const req = createMockRequest({
      name: 'Yani',
      email: 'yani@mail.com',
      password: 'pass123',
    });
    const res = createMockResponse();

    await register(req as Request, res as Response);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      expect.any(Error),
      'Terjadi kesalahan registrasi',
      500,
      'REGISTRATION_ERROR'
    );
  });
});
