import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const generateAccessTokenFromGithub = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        return { accessToken };
    } catch (error) {
        throw new Error("Failed to generate access token");
    }
};

const githubCallback = asyncHandler(async (req, res) => {
    try {
        // req.user is populated by Passport.js
        const { _id } = req.user;
        
        const { accessToken } = await generateAccessTokenFromGithub(_id);
        
        const options = {
            httpOnly: true,
            secure: true
        };
        
        // Set cookie and redirect to frontend
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            // Redirect to your frontend app
            .redirect(`${process.env.FRONTEND_URL}/auth-success?token=${accessToken}`);
            
    } catch (error) {
        // Redirect to login page with error
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=github-auth-failed`);
    }
});

export {
    githubCallback
};