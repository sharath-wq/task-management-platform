import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { authRoutes } from '../auth.route';
import * as authController from '../../controllers/auth.controller';
import authMiddleware from '../../middlewares/auth.middleware';

// Extend the Express Request interface to include the userId property
interface CustomRequest extends Request {
    userId?: string;
}

jest.mock('../../controllers/auth.controller');
jest.mock('../../middlewares/auth.middleware', () => jest.fn((req: CustomRequest, _res: Response, next: NextFunction) => {
    req.userId = 'mockUserId';
    next();
}));

const app = express();
app.use(express.json());
app.use('/auth', authRoutes());

describe('Auth Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/register', () => {
        it('should call authController.register', async () => {
            (authController.register as jest.Mock).mockImplementation((_req: Request, res: Response) => res.status(201).json({ message: 'User registered' }));

            const response = await request(app)
                .post('/auth/register')
                .send({ email: 'test@example.com', password: 'password123', name: 'Test User' });

            expect(response.status).toBe(201);
            expect(authController.register).toHaveBeenCalled();
        });
    });

    describe('POST /auth/login', () => {
        it('should call authController.login', async () => {
            (authController.login as jest.Mock).mockImplementation((_req: Request, res: Response) => res.status(200).json({ message: 'User logged in' }));

            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(response.status).toBe(200);
            expect(authController.login).toHaveBeenCalled();
        });
    });

    describe('GET /auth/me', () => {
        it('should call authController.getMe after running authMiddleware', async () => {
            (authController.getMe as jest.Mock).mockImplementation((req: CustomRequest, res: Response) => res.status(200).json({ user: { id: req.userId } }));

            const response = await request(app)
                .get('/auth/me');

            expect(response.status).toBe(200);
            expect(authMiddleware).toHaveBeenCalled();
            expect(authController.getMe).toHaveBeenCalled();
            expect(response.body.user.id).toBe('mockUserId');
        });
    });
});