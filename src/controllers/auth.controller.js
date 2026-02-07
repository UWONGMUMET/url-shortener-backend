import * as authService from '../services/auth.service.js';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.status = 400;
            throw error;
        }
        const user = await authService.registerUser(email, password);
        res.status(201).json({
            success: true,
            user: {
                id: user.id,
                email: user.email
            },
            message: 'User registered successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.status = 400;
            throw error;
        }

        const { token } = await authService.loginUser(email, password);
        res.status(200).json({
            success: true,
            token,
            message: 'Login successful'
        });
    }
    catch (error) {
        next(error);
    }
}