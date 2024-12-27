import { RequestHandler } from "express";

import DBQ from "../models/dbq";
import mongoose from "mongoose";

export const obtenerDBQSModulo: RequestHandler = async (req, res) => {
  const { uid, mid } = req.params;

  try {
    // const dbqs = await DBQ.find({ mid: mid, uid: uid }).sort({ 'fecha': -1 });
    const ObjectId = mongoose.Types.ObjectId;

    const dbqs = await DBQ.aggregate([
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
          _id: "$qid",
          id: { $first: "$_id" },
          fecha: { $first: "$fecha" },
          cid: { $first: "$cid" },
          mid: { $first: "$mid" },
          bid: { $first: "$bid" },
          sid: { $first: "$sid" },
          qid: { $first: "$qid" },
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
      msg: "dbqs estudiante",
      dbqs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const obtenerDBQQuestion: RequestHandler = async (req, res) => {
  const { uid, qid } = req.params;

  try {
    const dbq = await DBQ.findOne({ uid: uid, qid: qid }).sort({ fecha: -1 });

    return res.json({
      ok: true,
      msg: "dbq estudiante",
      dbq,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const crearDBQ: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const { cid, mid, bid, sid, qid, respuesta, estado } = req.body;

    const nuevoDBQ = new DBQ({
      cid: cid,
      mid: mid,
      bid: bid,
      sid: sid,
      qid: qid,
      uid: uid,
      fecha: new Date(),
      respuesta: respuesta,
      estado: estado,
    });
    const dbqCreado = await nuevoDBQ.save();

    return res.json({
      ok: true,
      msg: "DBQ creado",
      dbqCreado,
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
