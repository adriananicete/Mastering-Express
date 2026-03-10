export const verifyCookie = (req, res, next) => {
    console.log(req.signedCookies);
    console.log(req.signedCookies.hello);

    if(req.session && req.session.visited) {
        return next();
    }

    return res.status(401).json({msg: 'Unauthorized!'});
}