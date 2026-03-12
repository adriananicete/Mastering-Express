import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../utils/data.js";
import { User } from "../mongoose/schemas/users.js";
import { comparePassword } from "../utils/helpers.js";

passport.serializeUser((user, done) => {
    console.log('Inside Serialize user',user);
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    console.log('Inside Deserializer');
    console.log(`Deserializing User ID: ${id}`);
    try {
        const findeUser = await User.findById(id)
        if (!findeUser) throw new Error('User not found!');
        done(null, findeUser);
    } catch (error) {
        done(error, null);
    }
})

export default passport.use(
    new Strategy({ usernameField: 'email' }, async (email, password, done) => {
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        try {
            const findeUser = await User.findOne({email});
            if (!findeUser) throw new Error('User not Found');
            if (!await comparePassword(password, findeUser.password)) throw new Error('Wrong Password');
            done(null, findeUser)
        } catch (error) {
            done(error, null);
        }
    })
)