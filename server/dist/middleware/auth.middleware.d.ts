import { Response, NextFunction } from 'express';
import { AuthRequest, TokenPayload, AuthTokens } from '../types';
export declare const generateAccessToken: (userId: string) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const generateTokens: (userId: string, deviceInfo?: {
    userAgent?: string;
    ip?: string;
}) => Promise<AuthTokens>;
export declare const verifyAccessToken: (token: string) => TokenPayload;
export declare const verifyRefreshToken: (token: string) => Promise<TokenPayload>;
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const generateToken: (id: string) => string;
//# sourceMappingURL=auth.middleware.d.ts.map