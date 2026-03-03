import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, unknown>;
}

export const errorHandler = (
    err: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging (server-side only)
    console.error('Error:', err.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error.message = 'Resource not found';
        error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error.message = Object.values(err).map((val: unknown) => (val as Error).message).join(', ');
        error.statusCode = 400;
    }

    // In production, hide internal error details
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 && process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : error.message || 'Server Error';

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

export const notFound = (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(404).json({
        success: false,
        error: 'The requested resource was not found',
    });
};
