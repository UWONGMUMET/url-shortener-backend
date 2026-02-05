import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

export const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
};