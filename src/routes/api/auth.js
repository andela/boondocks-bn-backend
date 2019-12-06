import express from 'express';
import AuthController from '../../controllers/auth.controller';
import passport from '../../config/passport';
import catchErrors from '../../utils/helper';

const authRouter = express.Router();

authRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), catchErrors(AuthController.facebookSignin));

authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/auth/google/callback', passport.authenticate('google', { session: false }), catchErrors(AuthController.googleSignIn));

export default authRouter;
