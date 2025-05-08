import { Router } from "express";
import { getCurrentUser, logoutUser, signInUser, signUpUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { githubCallback } from "../controllers/githubAuth.controller.js";
import passport from "passport";

const router = Router();

router.route("/sign_up").post(signUpUser);
router.route("/sign_in").post(signInUser);

// GitHub OAuth routes
router.route("/auth/github").get(passport.authenticate('github', { scope: ['user:email'] }));
router.route("/auth/github/callback").get(
    passport.authenticate('github', { failureRedirect: '/login', session: false }),
    githubCallback
);

// secured route 
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/getme").get(verifyJWT,getCurrentUser)

export default router;  