import { RequestHandler } from "express";

import Bloque from "../models/bloque";
import Usuario from "../models/usuario";
import Matricula from "../models/matricula";

export const obtenerBloquesModulo: RequestHandler = async (req, res) => {
  const { uid, mid } = req.params;

  try {
    const bloques = await Bloque.find({ mid: mid }).sort({ bloque: 1 });

    return res.json({
      ok: true,
      bloques,
    });
  } catch (error) {
    console.log(error);
    const date = new Date();
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const obtenerBloquesCursoPublico: RequestHandler = async (req, res) => {

  const { cid } = req.params;

  try {
    const bloques = await Bloque.find({ cid: cid }).sort({bloque: 1});

    return res.json({
      ok: true,
      msg: "Bloques obtenidos",
      bloques,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
}

// ADMINISTRADOR
export const crearBloque: RequestHandler = async (req, res) => {
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

    const { mid, bloque, nombre } = req.body;

    const nuevoBloque = new Bloque({ cid, mid, bloque, nombre });
    const bloqueCreado = await nuevoBloque.save();

    return res.json({
      ok: true,
      msg: "Bloque creado",
      bloqueCreado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarBloque: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { bid } = req.params;
    const bloque = await Bloque.findById(bid);

    const matricula = await Matricula.findOne({ uid: uid, cid: bloque?.cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const bloqueEliminado = await Bloque.findByIdAndDelete(bid);

    if (bloqueEliminado) {
      await Bloque.updateMany(
        {
          cid: bloqueEliminado.cid,
          mid: bloqueEliminado.mid,
          bloque: { $gt: bloqueEliminado.bloque },
        },
        { $inc: { bloque: -1 } }
      );

      const bloquesActualizado = await Bloque.find({
        mid: bloqueEliminado.mid,
      }).sort({ bloque: 1 });

      return res.json({
        ok: true,
        msg: "Bloque eliminado",
        bloquesActualizado,
      });
    } else {
      return res.json({
        ok: false,
        msg: "Bloque no existe",
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

export const editarBloque: RequestHandler = async (req, res) => {
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

    const { bid, mid, bloque } = req.body;

    const mismoBloqueEncontrado = await Bloque.findOne({ _id: bid });

    if (!mismoBloqueEncontrado) {
      return res.json({
        ok: false,
        msg: "Bloque no existe",
      });
    }

    if (mismoBloqueEncontrado.bloque === bloque) {
      console.log("mismo bloque");
      await Bloque.findByIdAndUpdate(bid, req.body, { new: true });
      const bloquesEditado = await Bloque.find({ mid: mid }).sort({
        bloque: 1,
      });
      return res.json({
        ok: true,
        msg: "Bloque editado",
        bloquesEditado,
      });
    }

    const diferenteBloqueEncontrado = await Bloque.findOne({
      cid,
      mid,
      bloque,
    });

    if (!diferenteBloqueEncontrado) {
      await Bloque.findByIdAndUpdate(bid, req.body, { new: true });
      const bloquesEditado = await Bloque.find({ mid: mid }).sort({
        bloque: 1,
      });
      return res.json({
        ok: true,
        msg: "Bloque editado",
        bloquesEditado,
      });
    } else {
      await Bloque.findByIdAndUpdate(bid, req.body, { new: true });
      await Bloque.findByIdAndUpdate(
        diferenteBloqueEncontrado._id,
        { bloque: mismoBloqueEncontrado.bloque },
        { new: true }
      );
      const bloquesEditado = await Bloque.find({ mid: mid }).sort({
        bloque: 1,
      });
      return res.json({
        ok: true,
        msg: "Bloque editado",
        bloquesEditado,
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
