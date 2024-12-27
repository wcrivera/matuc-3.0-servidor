import { RequestHandler } from "express";
import Noticia from "../models/noticia";
import Usuario from "../models/usuario";
import Matricula from "../models/matricula";

export const obtenerNoticiasCurso: RequestHandler = async (req, res) => {
  const { uid, cid } = req.params;

  try {
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const matricula = await Matricula.findOne({ uid: uid, cid: cid });

    if (usuario.admin || matricula?.rol === "Administrador") {
      const noticias = await Noticia.find({ cid: cid }).sort({ fecha: -1 });

      return res.json({
        ok: true,
        msg: "Noticias obtenidos",
        noticias,
      });
    }

    const noticias = await Noticia.find({ cid: cid, activo: true }).sort({
      fecha: -1,
    });

    return res.json({
      ok: true,
      msg: "Noticias obtenidos",
      noticias,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

// ADMINISTRADOR
export const crearNoticia: RequestHandler = async (req, res) => {
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

    const nuevaNoticia = new Noticia(req.body);
    const noticiaCreada = await nuevaNoticia.save();

    return res.json({
      ok: true,
      msg: "Noticia creada",
      noticiaCreada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarNoticia: RequestHandler = async (req, res) => {
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
    const noticia = await Noticia.findById(id);
    const matricula = await Matricula.findOne({ uid: uid, cid: noticia?.cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    

    const noticiaEliminada = await Noticia.findByIdAndDelete(id);
    return res.json({
      ok: true,
      msg: "Noticia eliminada",
      noticiaEliminada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const editarNoticia: RequestHandler = async (req, res) => {
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

    const { id } = req.body;

    const noticiaEditada = await Noticia.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json({
      ok: true,
      msg: "Noticia editada",
      noticiaEditada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};
