import { RequestHandler } from "express";

import Ayudantia from "../models/ayudantia";
import Usuario from "../models/usuario";
import Matricula from "../models/matricula";

export const obtenerAyudantiasCurso: RequestHandler = async (req, res) => {
  const { mid } = req.params;

  try {
    const ayudantias = await Ayudantia.find({ mid: mid }).sort({ numero: 1 });

    return res.json({
      ok: true,
      ayudantias,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// ADMINISTRADOR
export const crearEjercicio: RequestHandler = async (req, res) => {
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

    const nuevoEjercicio = new Ayudantia(req.body);
    const ejercicioCreado = await nuevoEjercicio.save();

    return res.json({
      ok: true,
      msg: "Ejercicio creado",
      ejercicioCreado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarEjercicio: RequestHandler = async (req, res) => {
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
    const ayudantia = await Ayudantia.findById(id);

    const matricula = await Matricula.findOne({
      uid: uid,
      cid: ayudantia?.cid,
    });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const ayudantiaEliminada = await Ayudantia.findByIdAndDelete(id);

    if (ayudantiaEliminada) {
      await Ayudantia.updateMany(
        {
          cid: ayudantiaEliminada.cid,
          mid: ayudantiaEliminada.mid,
          numero: { $gt: ayudantiaEliminada.numero },
        },
        { $inc: { numero: -1 } }
      );

      const ayudantiasActualizada = await Ayudantia.find({
        cid: ayudantiaEliminada.cid,
        mid: ayudantiaEliminada.mid,
      }).sort({ numero: 1 });

      return res.json({
        ok: true,
        msg: "Ejercicio eliminado",
        ayudantiasActualizada,
      });
    } else {
      return res.json({
        ok: false,
        msg: "Ejercicio no existe",
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

export const editarEjercicio: RequestHandler = async (req, res) => {
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

    const { id, mid, numero } = req.body;

    const mismaAyudantiaEncontrada = await Ayudantia.findOne({ _id: id });

    if (!mismaAyudantiaEncontrada) {
      return res.json({
        ok: false,
        msg: "Ejercicio no existe",
      });
    }

    if (mismaAyudantiaEncontrada.numero === numero) {
      console.log("mismo ejercicio");
      await Ayudantia.findByIdAndUpdate(id, req.body, { new: true });
      const ayudantiasActualizada = await Ayudantia.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        ayudantiasActualizada,
      });
    }

    const diferenteAyudantiaEncontrada = await Ayudantia.findOne({
      cid,
      mid,
      numero,
    });

    if (!diferenteAyudantiaEncontrada) {
      await Ayudantia.findByIdAndUpdate(id, req.body, { new: true });
      const ayudantiasActualizada = await Ayudantia.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        ayudantiasActualizada,
      });
    } else {
      await Ayudantia.findByIdAndUpdate(id, req.body, { new: true });
      await Ayudantia.findByIdAndUpdate(
        diferenteAyudantiaEncontrada._id,
        { numero: mismaAyudantiaEncontrada.numero },
        { new: true }
      );
      const ayudantiasActualizada = await Ayudantia.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        ayudantiasActualizada,
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
