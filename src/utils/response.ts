import { Response } from 'express';

export const successResponse = (res: Response, data: any, message: string, statusCode: number) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        error: null
    });
};

export const errorResponse = (res: Response, error: any, message: string, statusCode: number, code: string) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
        error: {
            code,
            details: error instanceof Error ? error.message : error
        }
    });
};