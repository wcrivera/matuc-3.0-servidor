import { RequestHandler } from "express";

import Usuario from "../models/usuario";
import Seccion from "../models/seccion";
import Matricula from "../models/matricula";

export const obtenerSeccionesModulo: RequestHandler = async (req, res) => {
  const { mid, uid } = req.params;

  try {
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const secciones = await Seccion.find({ mid: mid }).sort({ seccion: 1 });

    return res.json({
      ok: true,
      secciones: secciones,
    });
  } catch (error) {
    console.log(error);
  }
};

export const obtenerSeccionesBloquePublico: RequestHandler = async (req, res) => {
  const { bid } = req.params;

  try {

    const secciones = await Seccion.find({ bid: bid }).sort({ seccion: 1 });

    return res.json({
      ok: true,
      secciones: secciones,
    });
  } catch (error) {
    console.log(error);
  }
};

export const obtenerSeccionesCursoPublico: RequestHandler = async (req, res) => {
  const { cid } = req.params;

  try {

    const secciones = await Seccion.find({ cid: cid }).sort({ seccion: 1 });

    return res.json({
      ok: true,
      secciones: secciones,
    });
  } catch (error) {
    console.log(error);
  }
};



// ADMINISTRADOR
export const crearSeccion: RequestHandler = async (req, res) => {
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

    const { mid, bid, seccion, nombre } = req.body;

    const nuevaSeccion = new Seccion({ cid, mid, bid, seccion, nombre });
    const seccionCreada = await nuevaSeccion.save();

    return res.json({
      ok: true,
      msg: "Sección creada",
      seccionCreada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarSeccion: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { sid } = req.params;
    const seccion = await Seccion.findById(sid);

    const matricula = await Matricula.findOne({ uid: uid, cid: seccion?.cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const seccionEliminada = await Seccion.findByIdAndDelete(sid);

    if (seccionEliminada) {
      await Seccion.updateMany(
        {
          cid: seccionEliminada.cid,
          mid: seccionEliminada.mid,
          bid: seccionEliminada.bid,
          seccion: { $gt: seccionEliminada.seccion },
        },
        { $inc: { seccion: -1 } }
      );

      const seccionesActualizada = await Seccion.find({
        mid: seccionEliminada.mid,
      }).sort({ seccion: 1 });

      return res.json({
        ok: true,
        msg: "Sección eliminada",
        seccionesActualizada,
      });
    } else {
      return res.json({
        ok: false,
        msg: "Sección no existe",
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

export const editarSeccion: RequestHandler = async (req, res) => {
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

    const { sid, mid, bid, seccion } = req.body;

    const mismaSeccionEncontrado = await Seccion.findOne({ _id: sid });

    if (!mismaSeccionEncontrado) {
      return res.json({
        ok: false,
        msg: "Sección no existe",
      });
    }

    if (mismaSeccionEncontrado.seccion === seccion) {
      console.log("misma sección");
      await Seccion.findByIdAndUpdate(sid, req.body, { new: true });
      const seccionesEditada = await Seccion.find({ mid: mid }).sort({
        seccion: 1,
      });
      return res.json({
        ok: true,
        msg: "Sección editada",
        seccionesEditada,
      });
    }

    const diferenteSeccionEncontrada = await Seccion.findOne({
      cid,
      mid,
      bid,
      seccion,
    });

    if (!diferenteSeccionEncontrada) {
      await Seccion.findByIdAndUpdate(sid, req.body, { new: true });
      const seccionesEditada = await Seccion.find({ mid: mid }).sort({
        seccion: 1,
      });
      return res.json({
        ok: true,
        msg: "Sección editada",
        seccionesEditada,
      });
    } else {
      await Seccion.findByIdAndUpdate(sid, req.body, { new: true });
      await Seccion.findByIdAndUpdate(
        diferenteSeccionEncontrada._id,
        { seccion: mismaSeccionEncontrado.seccion },
        { new: true }
      );
      const seccionesEditada = await Seccion.find({ mid: mid }).sort({
        seccion: 1,
      });
      return res.json({
        ok: true,
        msg: "Sección editada",
        seccionesEditada,
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
