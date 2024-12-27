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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarUsuario = exports.editarUsuario = exports.crearUsuario = exports.crearUsuarioPassword = exports.obtenerUsuariosCurso = exports.loginOutlookAdmin = exports.loginOutlook = exports.renewToken = exports.login = void 0;
const jwt_1 = require("../helpers/jwt");
const usuario_1 = __importDefault(require("../models/usuario"));
const matricula_1 = __importDefault(require("../models/matricula"));
const grupo_1 = __importDefault(require("../models/grupo"));
const config_1 = __importDefault(require("../config"));
// CLIENTE
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const generator = require('generate-password');
    const nodemailer = require("nodemailer");
    const bcrypt = require("bcryptjs");
    const { user, password } = req.body;
    if (!user.endsWith("@uc.cl") && !user.endsWith("@estudiante.uc.cl")) {
        return res.status(400).json({
            ok: false,
            msg: `${user} no es mail UC`,
        });
    }
    try {
        const email = user;
        const usuarioEncontrado = yield usuario_1.default.findOne({ email });
        console.log(usuarioEncontrado);
        if (!usuarioEncontrado) {
            const contrasena = generator.generate({
                length: 10,
                numbers: true
            });
            const transporter = nodemailer.createTransport({
                host: "mail.manthano.cl",
                port: 587,
                secure: false,
                auth: {
                    user: config_1.default.SECRET_JWT_SEED_USER_MAIL,
                    pass: config_1.default.SECRET_JWT_SEED_PASS_MAIL,
                },
            });
            yield transporter.sendMail({
                from: '"Manthano" <noreply@manthano.cl>',
                to: email,
                subject: "Crear usuario",
                text: `Ingresa con tu mail UC y la contraseña ${contrasena}`,
                html: `<p>Ingresa con tu mail UC y la contraseña</p> <p>${contrasena}</p> <p>Luego completa el formulario con tu nombre y apellido</p>`, // html body
            });
            const nuevoUsuario = new usuario_1.default({
                nombre: "Nombre",
                apellido: "Apellido",
                email: email,
                activo: false,
                password: contrasena
            });
            yield nuevoUsuario.save();
            return res.status(400).json({
                ok: false,
                usuario: { uid: nuevoUsuario._id, activo: false, email: email },
                msg: `Te hemos enviado una contraseña provisoria ha tu mail: ${email} `,
            });
        }
        if (password === usuarioEncontrado.password || usuarioEncontrado.password === undefined) {
            console.log('password repetido o indefinido', usuarioEncontrado);
            return res.json({
                ok: true,
                usuario: { uid: usuarioEncontrado._id, activo: false, email: usuarioEncontrado.email },
                msg: 'update',
            });
        }
        const validPassword = bcrypt.compareSync(password, usuarioEncontrado.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Contraseña incorrecta",
            });
        }
        const token = yield (0, jwt_1.generarJWT)(usuarioEncontrado.id);
        return res.json({
            ok: true,
            usuario: {
                nombre: usuarioEncontrado.nombre,
                apellido: usuarioEncontrado.apellido,
                email: usuarioEncontrado.email,
                admin: usuarioEncontrado.admin,
                activo: usuarioEncontrado.activo
            },
            token,
        });
    }
    catch (error) {
    }
    // try {
    //   const email = user;
    //   const usuarioEncontrado = await Usuario.findOne({ email });
    //   console.log(usuarioEncontrado)
    //   if (!usuarioEncontrado) {
    //     // const usuario = new Usuario({
    //     //   nombre: user,
    //     //   apellido: user,
    //     //   email: email,
    //     // });
    //     // const salt = bcrypt.genSaltSync();
    //     // usuario.password = bcrypt.hashSync(password, salt);
    //     // await usuario.save();
    //     return res.status(400).json({
    //       ok: false,
    //       msg: "Usuario no encontrado",
    //     });
    //   }
    //   const validPassword = bcrypt.compareSync(
    //     password,
    //     usuarioEncontrado.password
    //   );
    //   if (!validPassword) {
    //     return res.status(400).json({
    //       ok: false,
    //       msg: "Contraseña incorrecta",
    //     });
    //   }
    //   const token = await generarJWT(usuarioEncontrado.id);
    //   return res.json({
    //     ok: true,
    //     usuario: {
    //       nombre: usuarioEncontrado.nombre,
    //       apellido: usuarioEncontrado.apellido,
    //       email: usuarioEncontrado.email,
    //       admin: usuarioEncontrado.admin,
    //     },
    //     token,
    //   });
    // } catch (error) {
    //   console.log(error);
    //   return res.status(500).json({
    //     ok: false,
    //     msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    //   });
    // }
});
exports.login = login;
const renewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    try {
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario no encontrado",
            });
        }
        const token = yield (0, jwt_1.generarJWT)(usuario.id);
        return res.json({
            ok: true,
            usuario: {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                admin: usuario.admin,
            },
            token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.renewToken = renewToken;
const loginOutlook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, nombre, apellido } = req.body;
    try {
        const usuario = yield usuario_1.default.findOne({ email });
        if (!usuario) {
            const nuevoUsuario = new usuario_1.default({
                nombre: nombre,
                apellido: apellido,
                email: email,
            });
            const nuevoUsuarioCreado = yield nuevoUsuario.save();
            const token = yield (0, jwt_1.generarJWT)(nuevoUsuarioCreado.id);
            return res.json({
                ok: true,
                usuario: nuevoUsuarioCreado,
                token,
            });
        }
        const token = yield (0, jwt_1.generarJWT)(usuario.id);
        return res.json({
            ok: true,
            usuario: usuario,
            token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.loginOutlook = loginOutlook;
// ADMINISTRADOR
const loginOutlookAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, nombre, apellido } = req.body;
    try {
        const usuario = yield usuario_1.default.findOne({ email });
        if (!usuario || usuario.admin === false) {
            return res.status(403).json({
                ok: false,
                msg: "Acceso restringido",
            });
        }
        const token = yield (0, jwt_1.generarJWTAdmin)(usuario.id);
        return res.json({
            ok: true,
            usuario: usuario,
            token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.loginOutlookAdmin = loginOutlookAdmin;
const obtenerUsuariosCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cid, uid } = req.params;
    try {
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado",
            });
        }
        const matriculas = yield matricula_1.default.find({ cid: cid });
        const ids = matriculas.map((item) => item.uid);
        const usuarios = yield usuario_1.default.find({ _id: { $in: ids } }).sort({
            apellido: 1,
            nombre: 1,
        });
        const grupos = yield grupo_1.default.find({ _id: { $in: ids } });
        return res.json({
            ok: true,
            usuarios: usuarios,
            matriculas: matriculas,
            grupos
        });
    }
    catch (error) {
        console.log(error);
    }
    // const { email, nombre, apellido } = req.body;
    // try {
    //   const usuario = await Usuario.findOne({ email });
    //   if (!usuario || usuario.admin === false) {
    //     return res.status(403).json({
    //       ok: false,
    //       msg: "Acceso restringido",
    //     });
    //   }
    //   const token = await generarJWTAdmin(usuario.id);
    //   return res.json({
    //     ok: true,
    //     usuario: usuario,
    //     token,
    //   });
    // } catch (error) {
    //   console.log(error);
    //   return res.status(500).json({
    //     ok: false,
    //     msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    //   });
    // }
});
exports.obtenerUsuariosCurso = obtenerUsuariosCurso;
const crearUsuarioPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuarioEncontrado = yield usuario_1.default.findById(uid);
        if (!usuarioEncontrado) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { nombre, apellido, email, password, cid } = req.body;
        const usuarioExiste = yield usuario_1.default.findOne({
            email: email,
        });
        if (usuarioExiste) {
            return res.status(404).json({
                ok: false,
                msg: "Existe el usuario",
            });
        }
        var bcrypt = require("bcryptjs");
        const nuevoUsuario = new usuario_1.default({
            nombre: nombre,
            apellido: apellido,
            email: email,
        });
        const salt = bcrypt.genSaltSync();
        nuevoUsuario.password = bcrypt.hashSync(password, salt);
        const usuarioCreado = yield nuevoUsuario.save();
        const grupo = yield grupo_1.default.findOne({ cid: cid, grupo: 100 });
        if (grupo) {
            const nuevaMatricula = new matricula_1.default({
                cid: cid,
                gid: grupo._id,
                uid: nuevoUsuario._id,
                rol: "Estudiante",
                online: false,
            });
            yield nuevaMatricula.save();
            return res.json({
                ok: true,
                msg: "Usuario creado",
                grupo,
                usuarioCreado,
            });
        }
        else {
            const nuevoGrupo = new grupo_1.default({ cid: cid, grupo: 100 });
            const grupoCreado = yield nuevoGrupo.save();
            const nuevaMatricula = new matricula_1.default({
                cid: cid,
                gid: grupoCreado._id,
                uid: nuevoUsuario._id,
                rol: "Estudiante",
                online: false,
            });
            yield nuevaMatricula.save();
            return res.json({
                ok: true,
                msg: "Usuario creado",
                usuarioCreado,
                grupo: grupoCreado
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.crearUsuarioPassword = crearUsuarioPassword;
const crearUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    try {
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        if (usuario.admin === false) {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const { email } = req.body;
        const usuarioEncontrado = yield usuario_1.default.findOne({ email: email });
        if (usuarioEncontrado) {
            return res.json({
                ok: true,
                msg: "Existe",
                usuarioCreado: usuarioEncontrado
            });
        }
        else {
            const nuevoUsuario = new usuario_1.default(req.body);
            const usuarioCreado = yield nuevoUsuario.save();
            return res.json({
                ok: true,
                msg: "Creado",
                usuarioCreado: usuarioCreado
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.crearUsuario = crearUsuario;
const editarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, nombre, apellido, email, password } = req.body;
        const usuarioEncontrado = yield usuario_1.default.findById(uid);
        if (!usuarioEncontrado) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const usuarioUpdate = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: password,
            activo: true
        };
        const bcrypt = require("bcryptjs");
        const salt = bcrypt.genSaltSync();
        usuarioUpdate.password = bcrypt.hashSync(password, salt);
        const usuarioEditado = yield usuario_1.default.findByIdAndUpdate(uid, usuarioUpdate, {
            new: true,
        });
        const token = yield (0, jwt_1.generarJWT)(uid);
        return res.json({
            ok: true,
            msg: "Usuario editada",
            usuario: usuarioEditado,
            token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.editarUsuario = editarUsuario;
const eliminarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { id } = req.params;
        const usuarioEliminado = yield usuario_1.default.findByIdAndDelete(id);
        return res.json({
            ok: true,
            msg: "Usuario eliminado",
            usuarioEliminado,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.eliminarUsuario = eliminarUsuario;
