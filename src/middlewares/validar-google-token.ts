// import * as express from 'express';
// const {OAuth2Client} = require('google-auth-library');

// export const validarGoogleToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

//     const { token } = req.body;

//     try {
//         const client = new OAuth2Client(process.env.CLIENT_ID);
//         const ticket = await client.verifyIdToken({ 
//             idToken: token,
//             audience: process.env.CLIENT_ID
//         });

//         const payload = ticket.getPayload();

//         const { email, given_name, family_name } = payload;
//         req.body.email = email;
//         req.body.nombre = given_name;
//         req.body.apellido = family_name;

//         next();
//     } catch (error) {
//         return res.status(401).json({
//             ok: false,
//             msg: 'Token no es válido'
//         });
//     }
// }