import { RequestHandler } from "express";
import { generarJWT, generarJWTAdmin, generarPJWT } from '../helpers/jwt';

import Usuario from "../models/usuario";
import Matricula from "../models/matricula";
import Grupo from "../models/grupo";

import config from "../config";

// CLIENTE

export const loginGoogle: RequestHandler = async (req, res) => {
  const { email, name, lastname } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log("No hay usuario");
      return res.json({
        ok: false,
        msg: "El usuario no está registrado",
      });
    }

    const token = await generarJWT(usuario.id);

    return res.json({
      ok: true,
      usuario: usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const loginPIMU: RequestHandler = async (req, res) => {
  // const generarPJWT = (uid : string) =>  {

  //     return new Promise(( resolve, reject ) => {

  //         const payload = { nombre: 'Claudio', apellido: 'Rivera', email: 'wcrivera@uc.cl', curso: 'MAT000A', grupo: 1 };

  //         // const payload = {"nombre":"Usuario 7","apellido":"Apellido 7","email":"usuario7@uc.cl","curso":"MAT000C","grupo":3}

  //         jwt.sign(payload, config.SECRET_JWT_SEED_PIMU, {
  //             expiresIn: '60d'
  //         }, ( err, token) => {
  //             if (err) {
  //                 console.log(err);
  //                 reject('No se pudo generar el JWT')
  //             } else {
  //                 resolve(token);
  //             }
  //         });

  //     });
  // }

  

  // console.log(newtoken)

  const { nombre, apellido, email, curso, grupo } = req.params;

  // const newtoken = await generarPJWT( nombre, apellido, email, curso, grupo );

  // console.log(newtoken)

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Crear usuario
      const nuevoUsuario = new Usuario({
        nombre: nombre,
        apellido: apellido,
        email: email,
      });
      const nuevoUsuarioCreado = await nuevoUsuario.save();
      const token = await generarJWT(nuevoUsuarioCreado.id);

      // crear matricula
      const { ObjectId } = require("mongodb");

      let cid = "";

      // PIMU PC: MAT000A
      if (curso === "MAT001A") {
        console.log("PIMU PC");
        cid = ObjectId("6362d502e2cc0289406e780b");
      }

      // PIMU IM 2: MAT000B
      if (curso === "MAT000B") {
        console.log("PIMU IM 2");
        cid = ObjectId("6363b97de2cc0289406e7826");
      }

      // PIMU IM 1: MAT000C
      if (curso === "MAT000C") {
        console.log("PIMU IM 1");
        cid = ObjectId("63628a8de2cc0289406e77f2");
      }

      // PIMU RC: MAT000D
      if (curso === "MAT000D") {
        console.log("PIMU RC");
        cid = ObjectId("639537c20b0e19067321271a");
      }

      // PIMU MC: MAT000D
      if (curso === "MAT004A") {
        console.log("PIMU CM");
        cid = ObjectId("6786a538e55fa851d85729cb");
      }

      // TALLER VERANO PIMU PC: TVER000A
      if (curso === "MAT002A") {
        console.log("Taller PC");
        cid = ObjectId("63aee57bde82d8dbdcc77ff5");
      }

      // TALLER VERANO PIMU IM: TVER000B
      if (curso === "MAT003A") {
        console.log("Taller IM");
        cid = ObjectId("63aee50ede82d8dbdcc77ff4");
      }

      if (cid === "") {
        return res.json({
          ok: false,
          msg: "No se pudo matricular al estudiante",
        });
      }

      const grupoEncontrado = await Grupo.findOne({
        cid: cid,
        grupo: grupo,
      });

      if (!grupoEncontrado) {
        const nuevoGrupo = new Grupo({
          cid: cid,
          grupo: grupo,
        });
        const grupoCreado = await nuevoGrupo.save();

        const nuevaMatricula = new Matricula({
          cid: cid,
          gid: grupoCreado._id,
          uid: nuevoUsuarioCreado._id,
          rol: "Estudiante",
          online: false,
        });
        await nuevaMatricula.save();
        return res.json({
          ok: true,
          usuario: nuevoUsuarioCreado,
          token,
        });
      }

      const nuevaMatricula = new Matricula({
        cid: cid,
        gid: grupoEncontrado._id,
        uid: nuevoUsuarioCreado._id,
        rol: "Estudiante",
        online: false,
      });
      await nuevaMatricula.save();
      return res.json({
        ok: true,
        usuario: nuevoUsuarioCreado,
        token,
      });
    } else {
      const token = await generarJWT(usuario.id);

      return res.json({
        ok: true,
        usuario: usuario,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    // const date = new Date();
    // crearLog("", "LoginPIMU", JSON.stringify(date), JSON.stringify(error));
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  // const generator = require("generate-password");
  // const nodemailer = require("nodemailer");
  const bcrypt = require("bcryptjs");

  const { user, nombre, apellido, password } = req.body;

  // if (!user.endsWith("@uc.cl") && !user.endsWith("@estudiante.uc.cl")) {
  //   return res.status(400).json({
  //     ok: false,
  //     msg: `${user} no es mail UC`,
  //   });
  // }

  // try {
  //   const email = user;
  //   const usuarioEncontrado = await Usuario.findOne({ email });

  //   console.log(usuarioEncontrado)

  //   if (!usuarioEncontrado) {

  //     const contrasena = generator.generate({
  //       length: 10,
  //       numbers: true
  //     });

  //     const transporter = nodemailer.createTransport({
  //       host: "mail.manthano.cl",
  //       port: 587,
  //       secure: false, // Use `true` for port 465, `false` for all other ports
  //       auth: {
  //         user: config.SECRET_JWT_SEED_USER_MAIL,
  //         pass: config.SECRET_JWT_SEED_PASS_MAIL,
  //       },
  //     });

  //     await transporter.sendMail({
  //       from: '"Manthano" <noreply@manthano.cl>', // sender address
  //       to: email, // list of receivers
  //       subject: "Crear usuario", // Subject line
  //       text: `Ingresa con tu mail UC y la contraseña ${contrasena}`, // plain text body
  //       html: `<p>Ingresa con tu mail UC y la contraseña</p> <p>${contrasena}</p> <p>Luego completa el formulario con tu nombre y apellido</p>`, // html body
  //     });

  //     const nuevoUsuario = new Usuario({
  //       nombre: "Nombre",
  //       apellido: "Apellido",
  //       email: email,
  //       activo: false,
  //       password: contrasena
  //     });

  //     await nuevoUsuario.save();

  //     return res.status(400).json({
  //       ok: false,
  //       usuario: { uid: nuevoUsuario._id, activo: false, email: email },
  //       msg: `Te hemos enviado una contraseña provisoria ha tu mail: ${email} `,
  //     });
  //   }

  //   if (password === usuarioEncontrado.password || usuarioEncontrado.password === undefined) {
  //     console.log('password repetido o indefinido', usuarioEncontrado)
  //     return res.json({
  //       ok: true,
  //       usuario: { uid: usuarioEncontrado._id, activo: false, email: usuarioEncontrado.email },
  //       msg: 'update',
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
  //       activo: usuarioEncontrado.activo
  //     },
  //     token,
  //   });

  // } catch (error) {

  // }

  try {
    const email = user;
    const usuarioEncontrado = await Usuario.findOne({ email });

    console.log("usuario encontrado", usuarioEncontrado);

    if (!usuarioEncontrado) {
      const usuario = new Usuario({
        nombre: nombre,
        apellido: apellido,
        email: email,
      });
      const salt = bcrypt.genSaltSync();
      usuario.password = bcrypt.hashSync(password, salt);
      const nuevoUsuario = await usuario.save();

      const token = await generarJWT(nuevoUsuario.id);

      return res.json({
        ok: true,
        usuario: {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          admin: false,
        },
        token,
      });

      // return res.status(400).json({
      //   ok: false,
      //   msg: "Usuario no encontrado",
      // });
    }

    const validPassword = bcrypt.compareSync(
      password,
      usuarioEncontrado.password
    );

    console.log(validPassword);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }

    const token = await generarJWT(usuarioEncontrado.id);

    return res.json({
      ok: true,
      usuario: {
        nombre: usuarioEncontrado.nombre,
        apellido: usuarioEncontrado.apellido,
        email: usuarioEncontrado.email,
        admin: usuarioEncontrado.admin,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const renewToken: RequestHandler = async (req, res) => {
  const { uid } = req.params;
  try {
    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const token = await generarJWT(usuario.id);

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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const loginOutlook: RequestHandler = async (req, res) => {
  const { email, nombre, apellido } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      const nuevoUsuario = new Usuario({
        nombre: nombre,
        apellido: apellido,
        email: email,
      });

      const nuevoUsuarioCreado = await nuevoUsuario.save();

      const token = await generarJWT(nuevoUsuarioCreado.id);

      return res.json({
        ok: true,
        usuario: nuevoUsuarioCreado,
        token,
      });
    }

    const token = await generarJWT(usuario.id);

    return res.json({
      ok: true,
      usuario: usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

// ADMINISTRADOR
export const loginOutlookAdmin: RequestHandler = async (req, res) => {
  const { email, nombre, apellido } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario || usuario.admin === false) {
      return res.status(403).json({
        ok: false,
        msg: "Acceso restringido",
      });
    }

    const token = await generarJWTAdmin(usuario.id);

    return res.json({
      ok: true,
      usuario: usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const obtenerUsuariosCurso: RequestHandler = async (req, res) => {
  const { cid, uid } = req.params;

  try {
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const matriculas = await Matricula.find({ cid: cid });

    const ids = matriculas.map((item) => item.uid);

    const usuarios = await Usuario.find({ _id: { $in: ids } }).sort({
      apellido: 1,
      nombre: 1,
    });

    const grupos = await Grupo.find({ _id: { $in: ids } });

    return res.json({
      ok: true,
      usuarios: usuarios,
      matriculas: matriculas,
      grupos,
    });
  } catch (error) {
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
};

export const crearUsuarioPassword: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuarioEncontrado = await Usuario.findById(uid);

    if (!usuarioEncontrado) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { nombre, apellido, email, password, cid } = req.body;

    const usuarioExiste = await Usuario.findOne({
      email: email,
    });

    if (usuarioExiste) {
      return res.status(404).json({
        ok: false,
        msg: "Existe el usuario",
      });
    }

    var bcrypt = require("bcryptjs");
    const nuevoUsuario = new Usuario({
      nombre: nombre,
      apellido: apellido,
      email: email,
    });
    const salt = bcrypt.genSaltSync();
    nuevoUsuario.password = bcrypt.hashSync(password, salt);
    const usuarioCreado = await nuevoUsuario.save();

    const grupo = await Grupo.findOne({ cid: cid, grupo: 100 });

    if (grupo) {
      const nuevaMatricula = new Matricula({
        cid: cid,
        gid: grupo._id,
        uid: nuevoUsuario._id,
        rol: "Estudiante",
        online: false,
      });
      await nuevaMatricula.save();

      return res.json({
        ok: true,
        msg: "Usuario creado",
        grupo,
        usuarioCreado,
      });
    } else {
      const nuevoGrupo = new Grupo({ cid: cid, grupo: 100 });
      const grupoCreado = await nuevoGrupo.save();

      const nuevaMatricula = new Matricula({
        cid: cid,
        gid: grupoCreado._id,
        uid: nuevoUsuario._id,
        rol: "Estudiante",
        online: false,
      });
      await nuevaMatricula.save();

      return res.json({
        ok: true,
        msg: "Usuario creado",
        usuarioCreado,
        grupo: grupoCreado,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const crearUsuario: RequestHandler = async (req, res) => {
  const { uid } = req.params;

  try {
    const usuario = await Usuario.findById(uid);

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

    const usuarioEncontrado = await Usuario.findOne({ email: email });

    if (usuarioEncontrado) {
      return res.json({
        ok: true,
        msg: "Existe",
        usuarioCreado: usuarioEncontrado,
      });
    } else {
      const nuevoUsuario = new Usuario(req.body);
      const usuarioCreado = await nuevoUsuario.save();
      return res.json({
        ok: true,
        msg: "Creado",
        usuarioCreado: usuarioCreado,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const editarUsuario: RequestHandler = async (req, res) => {
  try {
    const { uid, nombre, apellido, email, password } = req.body;

    const usuarioEncontrado = await Usuario.findById(uid);

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
      activo: true,
    };

    const bcrypt = require("bcryptjs");

    const salt = bcrypt.genSaltSync();
    usuarioUpdate.password = bcrypt.hashSync(password, salt);

    const usuarioEditado = await Usuario.findByIdAndUpdate(uid, usuarioUpdate, {
      new: true,
    });

    const token = await generarJWT(uid);
    return res.json({
      ok: true,
      msg: "Usuario editada",
      usuario: usuarioEditado,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarUsuario: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { id } = req.params;

    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    return res.json({
      ok: true,
      msg: "Usuario eliminado",
      usuarioEliminado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};
