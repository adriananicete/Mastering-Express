import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.js";

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await DiscordUser.findById(id);
    return findUser ? done(null, findUser) : done(null, null);
    } catch (error) {
        done(error, null);
    }
});

export default passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URL,
    scope: ['identify']
}, async (accessToken, refreshToken, profile, done) => {
    console.log("Strategy triggered!"); // Check if callback fires
    console.log("Profile:", profile);   // Check if may profile
    
    let findUser;

    try {
        findUser = await DiscordUser.findOne({discordId: profile.id});
        console.log("findUser:", findUser); // Check if may existing user
    } catch (error) {
        console.log("FindOne error:", error);
        return done(error,null);
    }

    try {
        if(!findUser) {
            const newUser = new DiscordUser({
                username: profile.username,
                discordId: profile.id,
            });
            console.log("Saving new user..."); // Check if pumupunta dito
            const newUserSaved = await newUser.save();
            console.log("Saved!", newUserSaved); // Check if nasave
            return done(null, newUserSaved);
        }
        return done(null, findUser);

    } catch (error) {
        console.log("Save error:", error); // Check if may save error
        return done(error, null);
    }
}))