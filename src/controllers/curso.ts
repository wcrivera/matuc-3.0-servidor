import { RequestHandler } from "express";

import Usuario from "../models/usuario";
import Curso from "../models/curso";
import Grupo from "../models/grupo";
import Matricula from "../models/matricula";
// import mongoose from "mongoose";

export const obtenerCursos: RequestHandler = async (req, res) => {
  const { uid } = req.params;

  try {
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    if (usuario.admin) {
      const cursos = await Curso.find().sort("sigla");

      return res.json({
        ok: true,
        msg: "Cursos obtenidos",
        cursos,
      });
    }

    // ALTERNATIVA 1: Solo los cursos en los que el usuario está matriculado

    // const cursosUsuario = (await Matricula.find({ uid: uid })).map((item) =>
    //   item.cid.toString()
    // );

    // const cursos = await Curso.find(
    //   { _id: { $in: cursosUsuario } }
    // ).sort("sigla");

    // return res.json({
    //   ok: true,
    //   msg: "Cursos obtenidos",
    //   cursos,
    // });

    // ALTERNATIVA 2: Todos los cursos que están activos y públicos

    const cursos = await Curso.find({ publico: true, activo: true }).sort(
      "sigla"
    );

    return res.json({
      ok: true,
      msg: "Cursos obtenidos",
      cursos,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const obtenerCurso: RequestHandler = async (req, res) => {
  const { cid } = req.params;

  try {
    const curso = await Curso.findById(cid);

    if (!curso) {
      return res.status(404).json({
        ok: false,
        msg: "Curso no encontrado",
      });
    }

    return res.json({
      ok: true,
      msg: "Curso obtenido",
      curso,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const obtenerCursosPublico: RequestHandler = async (req, res) => {
  try {
    const cursos = await Curso.find({ publico: true }).sort("sigla");

    return res.json({
      ok: true,
      msg: "Cursos obtenidos",
      cursos,
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
export const crearCurso: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { cid } = req.body;

    const matricula = await Matricula.findOne({ uid: uid, cid: cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const { sigla, nombre, descripcion } = req.body;

    const cursoEncontrado = await Curso.findOne({ sigla });
    if (cursoEncontrado) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un curso con esa sigla",
      });
    }

    const nuevoCurso = new Curso({ sigla, nombre, descripcion });
    const cursoCreado = await nuevoCurso.save();

    const nuevoGrupo = new Grupo({ cid: cursoCreado._id, grupo: 100 });
    await nuevoGrupo.save();

    return res.json({
      ok: true,
      msg: "Curso creado",
      cursoCreado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarCurso: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { cid } = req.body;

    const matricula = await Matricula.findOne({ uid: uid, cid: cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const cursoEliminado = await Curso.findByIdAndDelete(cid);

    return res.json({
      ok: true,
      msg: "Curso eliminado",
      cursoEliminado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const editarCurso: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { cid } = req.body;

    const matricula = await Matricula.findOne({ uid: uid, cid: cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const { sigla } = req.body;

    const cursosEncontrados = await Curso.find({ sigla });

    const cursoIgualSigla = cursosEncontrados.filter((item) => item.id !== cid);

    if (cursoIgualSigla.length > 0) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un curso con esa sigla",
      });
    }

    const cursoEditado = await Curso.findByIdAndUpdate(cid, req.body, {
      new: true,
    });

    return res.json({
      ok: true,
      msg: "Curso editado",
      cursoEditado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};
