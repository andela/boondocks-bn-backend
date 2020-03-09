import express from 'express';
import AuthController from '../../controllers/auth.controller';
import passport from '../../config/passport';
import catchErrors from '../../utils/helper';

const authRouter = express.Router();

authRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_URL}/login` }), catchErrors(AuthController.facebookSignIn));

authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }), catchErrors(AuthController.googleSignIn));

export default authRouter;
