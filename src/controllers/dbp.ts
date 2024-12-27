import { RequestHandler } from "express";
import DBP from "../models/dbp";
import mongoose from "mongoose";

export const obtenerDBPSModulo: RequestHandler = async (req, res) => {
  const { uid, mid } = req.params;

  try {
    const ObjectId = mongoose.Types.ObjectId;

    const dbps = await DBP.aggregate([
      {
        $match: {
          mid: new ObjectId(mid),
          uid: new ObjectId(uid),
        },
      },
      {
        $sort: {
          fecha: -1,
        },
      },
      {
        $group: {
          _id: "$pid",
          id: { $first: "$_id" },
          fecha: { $first: "$fecha" },
          cid: { $first: "$cid" },
          mid: { $first: "$mid" },
          pid: { $first: "$pid" },
          respuesta: { $first: "$respuesta" },
          estado: { $first: "$estado" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    return res.json({
      ok: true,
      msg: "dbps estudiante",
      dbps,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const crearDBP: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const { cid, mid, pid, respuesta, estado } = req.body;

    const nuevoDBP = new DBP({
      cid: cid,
      mid: mid,
      pid: pid,
      uid: uid,
      fecha: new Date(),
      respuesta: respuesta,
      estado: estado,
    });
    const dbpCreado = await nuevoDBP.save();

    return res.json({
      ok: true,
      msg: "DBP creado",
      dbpCreado,
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
