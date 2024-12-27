import { RequestHandler } from "express";
import Pregunta from "../models/pregunta";
import Usuario from "../models/usuario";
import Matricula from "../models/matricula";

export const obtenerPreguntasModulo: RequestHandler = async (req, res) => {
  const { uid, mid } = req.params;

  try {
    const preguntas = await Pregunta.find({ mid: mid }).sort({ numero: 1 });

    return res.json({
      ok: true,
      preguntas: preguntas,
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
export const crearPregunta: RequestHandler = async (req, res) => {
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

    const nuevoPregunta = new Pregunta(req.body);
    const preguntaCreada = await nuevoPregunta.save();

    return res.json({
      ok: true,
      msg: "Pregunta creado",
      preguntaCreada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarPregunta: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { pid } = req.params;
    const pregunta = await Pregunta.findById(pid);
    const matricula = await Matricula.findOne({ uid: uid, cid: pregunta?.cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const preguntaEliminada = await Pregunta.findByIdAndDelete(pid);

    if (preguntaEliminada) {
      await Pregunta.updateMany(
        {
          cid: preguntaEliminada.cid,
          mid: preguntaEliminada.mid,
          eid: preguntaEliminada.eid,
          numero: { $gt: preguntaEliminada.numero },
        },
        { $inc: { numero: -1 } }
      );

      const preguntasActualizada = await Pregunta.find({
        cid: preguntaEliminada.cid,
        mid: preguntaEliminada.mid,
      }).sort({ numero: 1 });

      return res.json({
        ok: true,
        msg: "Pregunta eliminada",
        preguntasActualizada,
      });
    } else {
      return res.json({
        ok: false,
        msg: "Pregunta no existe",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
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

    const { pid, eid, mid, numero } = req.body;

    const mismaPreguntaEncontrada = await Pregunta.findOne({ _id: pid });

    if (!mismaPreguntaEncontrada) {
      return res.json({
        ok: false,
        msg: "Pregunta no existe",
      });
    }

    if (mismaPreguntaEncontrada.numero === numero) {
      console.log("mismo pregunta");
      await Pregunta.findByIdAndUpdate(pid, req.body, { new: true });
      const preguntasActualizada = await Pregunta.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        preguntasActualizada,
      });
    }

    const diferentePreguntaEncontrada = await Pregunta.findOne({
      cid,
      mid,
      eid, 
      numero,
    });

    if (!diferentePreguntaEncontrada) {
      await Pregunta.findByIdAndUpdate(pid, req.body, { new: true });
      const preguntasActualizada = await Pregunta.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        preguntasActualizada,
      });
    } else {
      await Pregunta.findByIdAndUpdate(pid, req.body, { new: true });
      await Pregunta.findByIdAndUpdate(
        diferentePreguntaEncontrada._id,
        { numero: mismaPreguntaEncontrada.numero },
        { new: true }
      );
      const preguntasActualizada = await Pregunta.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        preguntasActualizada,
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
