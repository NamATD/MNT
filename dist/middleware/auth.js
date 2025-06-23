"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided or invalid format' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'secret');
        if (!decoded || typeof decoded !== 'object' || !decoded._id || !decoded.username || !decoded.role || !['admin', 'leader', 'employee'].includes(decoded.role)) {
            res.status(401).json({ message: 'Invalid token structure' });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        const err = error;
        let message = 'Invalid or expired token';
        if (err.name === 'TokenExpiredError')
            message = 'Token has expired';
        else if (err.name === 'JsonWebTokenError')
            message = 'Invalid token signature';
        res.status(401).json({ message });
        return;
    }
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (roles) => (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    if (!req.user._id || !req.user.username || !req.user.role) {
        res.status(500).json({ message: 'Invalid user data' });
        return;
    }
    if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
    }
    next();
};
exports.roleMiddleware = roleMiddleware;
