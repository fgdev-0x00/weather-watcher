import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
    const token = jwt.sign(
        { userId },
        JWT_SECRET || 'dev_secret',
        { expiresIn: '1h' }
    );
    return token;
};

export { generateToken };
