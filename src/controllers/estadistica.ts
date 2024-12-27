import { RequestHandler } from "express";

// import Usuario from "../models/usuario";
import Matricula from "../models/matricula";
import DBQ from "../models/dbq";
// import Grupo from "../models/grupo";

// import mongoose from "mongoose";

export const obtenerEstadistica: RequestHandler = async (req, res) => {
  const { uid, gid, sid } = req.params;

  try {

    const matriculas = await Matricula.find({ gid: gid });
    const uids = matriculas.map(item => item.uid)

    const dbqs = await DBQ.find({ sid: sid, uid: { $in: uids } })

    return res.json({
      ok: true,
      msg: "Estadística obtenida",
      dbqs: dbqs
    });

    

    // Buscar usuario del curso -> grupo -> seccion
    // Buscar dbq del curso -> seccion
    // Mirar el siguiente código para pedir solo el primero en fecha

    // const ObjectId = mongoose.Types.ObjectId;

    // const dbqs = await DBQ.aggregate([
    //   {
    //     $match: {
    //       sid: new ObjectId(sid),
    //       // uid: new ObjectId(uid),
    //     },
    //   },
    //   {
    //     $sort: {
    //       fecha: -1,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$qid",
    //       id: { $first: "$_id" },
    //       fecha: { $first: "$fecha" },
    //       cid: { $first: "$cid" },
    //       mid: { $first: "$mid" },
    //       bid: { $first: "$bid" },
    //       sid: { $first: "$sid" },
    //       qid: { $first: "$qid" },
    //       uid: { $first: "$uid" },
    //       respuesta: { $first: "$respuesta" },
    //       estado: { $first: "$estado" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //     },
    //   },
    // ]);

    console.log(dbqs)



    // const matricula = await Matricula.findOne({ uid: uid, cid: cid });

    // if (matricula === null || matricula.rol !== "Profesor") {
    //   return res.status(403).json({
    //     ok: false,
    //     msg: "Usuario sin permiso",
    //   });
    // }

    // const { ObjectId } = require('mongodb');

    // const dbqs = await DBQ.find({
    //   cid: ObjectId(`${cid}`),
    //   sid: ObjectId(`${sid}`)
    // });

    // const estadisticaSeccion = {
    //   sid: dbSeccion.sid,
    //   correctas: dbSeccionEncontrada.filter((dato: any) => dato?.estado === true).length,
    //   incorrectas: dbSeccionEncontrada.filter((dato: any) => dato?.estado === false).length
    // }


    // return res.json({
    //   ok: true,
    //   msg: "Estadística obtenida",
    //   // estadisticas,
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};
