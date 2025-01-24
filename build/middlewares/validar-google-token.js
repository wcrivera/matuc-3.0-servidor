"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
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
const validarGoogleToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const client = new google_auth_library_1.OAuth2Client();
        function verify() {
            return __awaiter(this, void 0, void 0, function* () {
                const ticket = yield client.verifyIdToken({
                    idToken: token,
                    audience: process.env.CLIENT_ID,
                });
                const payload = ticket.getPayload();
                if (!payload) {
                    req.body.email = "";
                    return next();
                }
                const { email } = payload;
                req.body.email = email;
                next();
            });
        }
        verify().catch(console.error);
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token no es válido",
        });
    }
});
exports.validarGoogleToken = validarGoogleToken;
