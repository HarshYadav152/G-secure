import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/user.model.js';
import crypto from 'crypto';

const setupGitHubStrategy = () => {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/gs/api/v1/users/auth/github/callback`,
        scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await User.findOne({ email: profile.emails[0].value });
            
            if (!user) {
                // Generate a random, secure keyword for the user
                const randomKeyword = crypto.randomBytes(16).toString('hex');
                
                // Create a new user
                user = await User.create({
                    username: profile.username.toLowerCase(),
                    email: profile.emails[0].value,
                    // Generate a secure random password since user won't need it
                    password: crypto.randomBytes(24).toString('hex'),
                    keyword: randomKeyword,
                    githubId: profile.id,
                    // Add any other fields you want to store from GitHub profile
                });
            } else if (!user.githubId) {
                // If user exists but doesn't have githubId, link accounts
                user.githubId = profile.id;
                await user.save();
            }
            
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // if i say correct i dont know what it do as of now
    // Serialize and deserialize user for session management
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default setupGitHubStrategy;