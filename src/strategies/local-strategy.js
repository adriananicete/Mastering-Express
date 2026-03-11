import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../utils/data.js";

passport.serializeUser((user, done) => {
    console.log('Inside Serialize user',user);
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    console.log('Inside Deserializer');
    console.log(`Deserializing User ID: ${id}`);
    try {
        const findeUser = users.find(user => user.id === id);
        if (!findeUser) throw new Error('User not found!');
        done(null, findeUser);
    } catch (error) {
        done(error, null);
    }
})

export default passport.use(
    new Strategy({ usernameField: 'email' }, (email, password, done) => {
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        try {
            const findeUser = users.find(user => user.email === email);
            if(!findeUser) throw new Error('User not found');
            if(findeUser.password !== password) throw new Error('Invalid Credentials');

            done(null, findeUser);

        } catch (error) {
            done(error, null);
        }
    })
)