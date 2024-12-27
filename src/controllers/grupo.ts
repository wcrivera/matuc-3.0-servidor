import { RequestHandler } from "express";

import Grupo from "../models/grupo";
import Usuario from "../models/usuario";
import Curso from "../models/curso";

export const obtenerGrupos: RequestHandler = async (req, res) => {

  try {
    const grupos = await Grupo.find().sort({ grupo: 1 })

    if (!grupos) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario sin grupo",
      });
    }

    return res.json({
      ok: true,
      msg: "Grupos obtenidos",
      grupos,
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
export const obtenerGruposCurso: RequestHandler = async (req, res) => {

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

    const grupos = await Grupo.find({ cid: cid });

    if (!grupos) {
      return res.json({
        ok: false,
        msg: "Estudiante no matriculado",
      });
    }

    return res.json({
      ok: true,
      msg: "Estudiante matriculado",
      grupos
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const crearGrupo: RequestHandler = async (req, res) => {

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
    const { sigla, grupo } = req.body;

    const cursoEncontrado = await Curso.findOne({ sigla: sigla });
    
    if (!cursoEncontrado) {
      return res.status(404).json({
        ok: false,
        msg: "Curso no existe",
      });
    }

    const grupoEncontrado = await Grupo.findOne({ cid: cursoEncontrado._id, grupo: grupo });

    if (grupoEncontrado) {
      return res.json({
        ok: true,
        msg: "Existe",
        grupoCreado: grupoEncontrado
      });
    } else {
      const nuevoGrupo = new Grupo({ cid: cursoEncontrado._id, grupo: grupo });
      const grupoCreado = await nuevoGrupo.save();
      return res.json({
        ok: true,
        msg: "Creado",
        grupoCreado: grupoCreado
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