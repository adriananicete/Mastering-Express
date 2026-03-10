export const verifyCookie = (req, res, next) => {
    console.log(req.signedCookies);
    console.log(req.signedCookies.hello);

    if(req.signedCookies.hello && req.signedCookies.hello === 'cookie') {
        return next();
    }

    return res.status(401).json({msg: 'Unauthorized!'});
}