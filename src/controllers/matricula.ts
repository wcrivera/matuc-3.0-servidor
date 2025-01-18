import { RequestHandler } from "express";

import Matricula from "../models/matricula";
import Grupo from "../models/grupo";
import Usuario from "../models/usuario";

export const obtenerMatriculas: RequestHandler = async (req, res) => {
  const { uid } = req.params;

  try {
    const matriculas = await Matricula.find({ uid: uid });

    if (!matriculas) {
      return res.json({
        ok: false,
        msg: "Estudiante no matriculado",
      });
    }

    return res.json({
      ok: true,
      msg: "Estudiante matriculado",
      matriculas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const obtenerMatricula: RequestHandler = async (req, res) => {
  const { uid, gid } = req.params;

  try {
    const matricula = await Matricula.findOne({ uid: uid, gid: gid });

    if (!matricula) {
      return res.json({
        ok: false,
        msg: "Estudiante no matriculado",
      });
    }

    return res.json({
      ok: true,
      msg: "Estudiante matriculado",
      matricula,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const crearMatriculaCurso: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const { cid, gid } = req.body;

    const matricula = await Matricula.findOne({ gid: gid, uid: uid });

    if (matricula) {
      return res.json({
        ok: true,
        msg: "Estudiante matriculado",
        matricula,
      });
    }

    const nuevaMatricula = new Matricula({
      cid: cid,
      gid: gid,
      uid: uid,
      rol: "Estudiante",
      online: false,
    });
    const matriculaCreada = await nuevaMatricula.save();

    return res.json({
      ok: true,
      msg: "Matricula creada",
      matricula: matriculaCreada,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
  // try {
  //   const { uid } = req.params;
  //   const { cid } = req.body;

  //   const matricula = await Matricula.findOne({ cid: cid, uid: uid });

  //   if (matricula) {
  //     return res.json({
  //       ok: true,
  //       msg: "Estudiante matriculado",
  //       matricula,
  //     });
  //   }

  //   const grupo = await Grupo.findOne({ cid: cid });

  //   if (grupo) {
  //     const nuevaMatricula = new Matricula({
  //       cid,
  //       gid: grupo._id,
  //       uid: uid,
  //       rol: "Estudiante",
  //       online: false,
  //     });
  //     const matriculaCreada = await nuevaMatricula.save();

  //     return res.json({
  //       ok: true,
  //       msg: "Matricula creada",
  //       matricula: matriculaCreada,
  //     });
  //   } else {
  //     const nuevoGrupo = new Grupo({ cid: cid, grupo: 100 });
  //     const grupoCreado = await nuevoGrupo.save();

  //     const nuevaMatricula = new Matricula({
  //       cid,
  //       gid: grupoCreado._id,
  //       uid,
  //       rol: "Estudiante",
  //       online: false,
  //     });
  //     const matriculaCreada = await nuevaMatricula.save();

  //     return res.json({
  //       ok: true,
  //       msg: "Matricula creada",
  //       matricula: matriculaCreada,
  //     });
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({
  //     ok: false,
  //     msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
  //   });
  // }
};

// ADMINISTRADOR
export const obtenerMatriculasCurso: RequestHandler = async (req, res) => {
  try {
    const { uid, cid } = req.params;
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

    const matriculas = await Matricula.find({ cid: cid });

    if (!matriculas) {
      return res.json({
        ok: false,
        msg: "Estudiante no matriculado",
      });
    }

    return res.json({
      ok: true,
      msg: "Estudiante matriculado",
      matriculas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const crearMatricula: RequestHandler = async (req, res) => {
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
    const { cid, uid: uidUsuario } = req.body;

    const matriculaEncontrada = await Matricula.findOne({
      cid: cid,
      uid: uidUsuario,
    });

    if (matriculaEncontrada) {
      const matriculaEditada = await Matricula.findByIdAndUpdate(
        matriculaEncontrada._id,
        req.body,
        {
          new: true,
        }
      );

      return res.json({
        ok: true,
        msg: "Existe",
        matriculaCreada: matriculaEditada,
      });
    } else {
      const nuevaMatricula = new Matricula(req.body);
      const matriculaCreada = await nuevaMatricula.save();
      return res.json({
        ok: true,
        msg: "Creado",
        matriculaCreada: matriculaCreada,
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

export const editarMatricula: RequestHandler = async (req, res) => {
  try {
    const { uid, id } = req.params;
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

    const matriculaEditada = await Matricula.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json({
      ok: true,
      msg: "Matricula editada",
      matriculaEditada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};
