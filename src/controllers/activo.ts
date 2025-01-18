import { RequestHandler } from "express";

import Activo from "../models/activo";
// import Usuario from "../models/usuario";
import Matricula from "../models/matricula";
import Modulo from "../models/modulo";

export const obtenerActivosModulo: RequestHandler = async (req, res) => {
  const { uid, mid } = req.params;

  try {
    const modulo = await Modulo.findOne({ _id: mid });

    if (!modulo) {
      return res.status(404).json({
        ok: false,
        msg: "modulo no encontrado",
      });
    }

    const matricula = await Matricula.findOne({
      cid: modulo.cid,
      uid: uid,
      online: true,
    });

    if (!matricula) {
      return res.status(404).json({
        ok: false,
        msg: "matricula no encontrada",
      });
    }
    const activos = await Activo.find({ gid: matricula.gid });

    return res.json({
      ok: true,
      activos,
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

export const obtenerActivoSeccion: RequestHandler = async (req, res) => {
  const { sid } = req.params;

  try {
    const activo = await Activo.findOne({ sid: sid });

    // console.log(activo)

    if (!activo) {
      return res.status(404).json({
        ok: false,
        msg: "activo no encontrado",
      });
    }

    return res.json({
      ok: true,
      activo,
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

// PROFESOR
export const crearActivo: RequestHandler = async (req, res) => {
  try {
    const { gid, cid, mid, bid, sid } = req.body;

    const activoquestion = await Activo.findOne({
      cid: cid,
      gid: gid,
      mid: mid,
      bid: bid,
      sid: sid,
    });

    // console.log(activoquestion);

    if (activoquestion) {
      // return res.status(404).json({
      //   ok: false,
      //   msg: "Ya existe este dato",
      // });

      // console.log(activoquestion)

      return res.json({
        ok: false,
        msg: "Ya existe este dato",
        activoCreado: activoquestion,
      });
    }

    const { uid } = req.params;
    // const matricula = await Matricula.findOne({ cid: cid, gid: gid, uid: uid });
    const matricula = await Matricula.findOne({ cid: cid, gid: gid, uid: uid });

    if (!matricula) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no matriculado",
      });
    }

    if (matricula.rol !== "Profesor") {
      return res.status(404).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const nuevoActivo = new Activo(req.body);
    const activoCreado = await nuevoActivo.save();

    return res.json({
      ok: true,
      msg: "Activo creado",
      activoCreado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const editarActivo: RequestHandler = async (req, res) => {
  try {
    const { gid, cid, mid, bid, sid } = req.body;

    const { uid } = req.params;
    const matricula = await Matricula.findOne({ cid: cid, gid: gid, uid: uid });

    if (!matricula) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no matriculado",
      });
    }

    if (matricula.rol !== "Profesor") {
      return res.status(404).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const activo = await Activo.findOne({
      cid: cid,
      gid: gid,
      mid: mid,
      bid: bid,
      sid: sid,
    });

    if (!activo) {
      return res.json({
        ok: false,
        msg: "Activo no existe",
      });
    }

    const activoEditado = await Activo.findByIdAndUpdate(activo.id, req.body, {
      new: true,
    });

    return res.json({
      ok: true,
      msg: "Activo editado",
      activoEditado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};
