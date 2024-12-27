import { RequestHandler } from "express";
import Ejercicio from "../models/ejercicio";
import Usuario from "../models/usuario";
import Matricula from "../models/matricula";

export const obtenerEjerciciosModulo: RequestHandler = async (req, res) => {

  const { uid, mid } = req.params;

  try {
    const ejercicios = await Ejercicio.find({ mid: mid }).sort({ numero: 1 });

    return res.json({
      ok: true,
      ejercicios: ejercicios,
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

    const { id } = req.params;
    const ejercicio = await Ejercicio.findById(id);

    const matricula = await Matricula.findOne({
      uid: uid,
      cid: ejercicio?.cid,
    });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const nuevoEjercicio = new Ejercicio(req.body);
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

    const { eid } = req.params;

    const ejercicio = await Ejercicio.findById(eid);
    const matricula = await Matricula.findOne({
      uid: uid,
      cid: ejercicio?.cid,
    });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const ejercicioEliminado = await Ejercicio.findByIdAndDelete(eid);

    if (ejercicioEliminado) {
      await Ejercicio.updateMany(
        {
          cid: ejercicioEliminado.cid,
          mid: ejercicioEliminado.mid,
          numero: { $gt: ejercicioEliminado.numero },
        },
        { $inc: { numero: -1 } }
      );

      const ejerciciosActualizado = await Ejercicio.find({
        cid: ejercicioEliminado.cid,
        mid: ejercicioEliminado.mid,
      }).sort({ numero: 1 });

      return res.json({
        ok: true,
        msg: "Ejercicio eliminado",
        ejerciciosActualizado,
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

    const { eid, mid, numero } = req.body;

    const mismaEjercicioEncontrada = await Ejercicio.findOne({ _id: eid });

    if (!mismaEjercicioEncontrada) {
      return res.json({
        ok: false,
        msg: "Ejercicio no existe",
      });
    }

    if (mismaEjercicioEncontrada.numero === numero) {
      console.log("mismo ejercicio");
      await Ejercicio.findByIdAndUpdate(eid, req.body, { new: true });
      const ejerciciosActualizado = await Ejercicio.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        ejerciciosActualizado,
      });
    }

    const diferenteEjercicioEncontrada = await Ejercicio.findOne({
      cid,
      mid,
      numero,
    });

    if (!diferenteEjercicioEncontrada) {
      await Ejercicio.findByIdAndUpdate(eid, req.body, { new: true });
      const ejerciciosActualizado = await Ejercicio.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        ejerciciosActualizado,
      });
    } else {
      await Ejercicio.findByIdAndUpdate(eid, req.body, { new: true });
      await Ejercicio.findByIdAndUpdate(
        diferenteEjercicioEncontrada._id,
        { numero: mismaEjercicioEncontrada.numero },
        { new: true }
      );
      const ejerciciosActualizado = await Ejercicio.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        ejerciciosActualizado,
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
