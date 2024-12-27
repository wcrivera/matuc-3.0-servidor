import { RequestHandler } from "express";

import ActivoQuestion from "../models/activoquestion";
// import Usuario from "../models/usuario";
import Matricula from "../models/matricula";

export const obtenerActivoQuestionsModulo: RequestHandler = async (req, res) => {

  console.log('Hola')
  // const { uid, mid } = req.params;

  // console.log(mid)

  // try {
  //   const activoquestions = await ActivoQuestion.find({ mid: mid }).sort({ activoquestion: 1 });

  //   return res.json({
  //     ok: true,
  //     activoquestions,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   const date = new Date();
  //   return res.status(500).json({
  //     ok: false,
  //     msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
  //   });
  // }
};

// export const crearActivoQuestion: RequestHandler = async (req, res) => {
//   try {

//     const { gid, cid, mid, bid, sid } = req.body;

//     const activoquestion = await ActivoQuestion.findOne({cid: cid, gid: gid, mid: mid, bid: bid, sid: sid});

//     if (activoquestion) {
//       return res.status(404).json({
//         ok: false,
//         msg: "Ya existe este dato",
//       });
//     }

//     const { uid } = req.params;
//     const matricula = await Matricula.findOne({cid: cid, gid: gid, uid: uid});

//     if (!matricula) {
//       return res.status(404).json({
//         ok: false,
//         msg: "Usuario no matriculado",
//       });
//     }

//     if (matricula.rol !== 'Profesor') {
//       return res.status(404).json({
//         ok: false,
//         msg: "Usuario sin permiso",
//       });
//     }

//     const nuevoActivoQuestion = new ActivoQuestion(req.body);
//     const activoquestionCreado = await nuevoActivoQuestion.save();

//     return res.json({
//       ok: true,
//       msg: "ActivoQuestion creado",
//       activoquestionCreado,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       ok: false,
//       msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
//     });
//   }
// };

// export const editarActivoQuestion: RequestHandler = async (req, res) => {
//   try {

//     const { gid, cid, mid, bid, sid } = req.body;

//     const { uid } = req.params;
//     const matricula = await Matricula.findOne({cid: cid, gid: gid, uid: uid});

//     if (!matricula) {
//       return res.status(404).json({
//         ok: false,
//         msg: "Usuario no matriculado",
//       });
//     }

//     if (matricula.rol !== 'Profesor') {
//       return res.status(404).json({
//         ok: false,
//         msg: "Usuario sin permiso",
//       });
//     }

//     const activoquestion = await ActivoQuestion.findOne({cid: cid, gid: gid, mid: mid, bid: bid, sid: sid});

//     if (!activoquestion) {
//       return res.json({
//         ok: false,
//         msg: "ActivoQuestion no existe",
//       });
//     }

//     const activoquestionEditado = await ActivoQuestion.findByIdAndUpdate(activoquestion.id, req.body, { new: true });

//     return res.json({
//       ok: true,
//       msg: "ActivoQuestion editado",
//       activoquestionEditado,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       ok: false,
//       msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
//     });
//   }
// };



// ADMINISTRADOR


// export const eliminarActivoQuestion: RequestHandler = async (req, res) => {
//   try {
//     const { uid } = req.params;
//     const usuario = await Usuario.findById(uid);

//     if (!usuario) {
//       return res.status(404).json({
//         ok: false,
//         msg: "Usuario no registrado",
//       });
//     }

//     const { bid } = req.params;
//     const activoquestion = await ActivoQuestion.findById(bid);

//     const matricula = await Matricula.findOne({ uid: uid, cid: activoquestion?.cid });

//     if (usuario.admin === false && matricula?.rol !== "Administrador") {
//       return res.status(403).json({
//         ok: false,
//         msg: "Usuario sin permiso",
//       });
//     }

//     const activoquestionEliminado = await ActivoQuestion.findByIdAndDelete(bid);

//     if (activoquestionEliminado) {
//       await ActivoQuestion.updateMany(
//         {
//           cid: activoquestionEliminado.cid,
//           mid: activoquestionEliminado.mid,
//           activoquestion: { $gt: activoquestionEliminado.activoquestion },
//         },
//         { $inc: { activoquestion: -1 } }
//       );

//       const activoquestionsActualizado = await ActivoQuestion.find({
//         mid: activoquestionEliminado.mid,
//       }).sort({ activoquestion: 1 });

//       return res.json({
//         ok: true,
//         msg: "ActivoQuestion eliminado",
//         activoquestionsActualizado,
//       });
//     } else {
//       return res.json({
//         ok: false,
//         msg: "ActivoQuestion no existe",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       ok: false,
//       msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
//     });
//   }
// };

// export const editarActivoQuestion: RequestHandler = async (req, res) => {
//   try {
//     const { uid } = req.params;
//     const usuario = await Usuario.findById(uid);

//     if (!usuario) {
//       return res.status(404).json({
//         ok: false,
//         msg: "Usuario no registrado",
//       });
//     }

//     const { cid } = req.body;

//     const matricula = await Matricula.findOne({ uid: uid, cid: cid });

//     if (usuario.admin === false && matricula?.rol !== "Administrador") {
//       return res.status(403).json({
//         ok: false,
//         msg: "Usuario sin permiso",
//       });
//     }

//     const { bid, mid, activoquestion } = req.body;

//     const mismoActivoQuestionEncontrado = await ActivoQuestion.findOne({ _id: bid });

//     if (!mismoActivoQuestionEncontrado) {
//       return res.json({
//         ok: false,
//         msg: "ActivoQuestion no existe",
//       });
//     }

//     if (mismoActivoQuestionEncontrado.activoquestion === activoquestion) {
//       console.log("mismo activoquestion");
//       await ActivoQuestion.findByIdAndUpdate(bid, req.body, { new: true });
//       const activoquestionsEditado = await ActivoQuestion.find({ mid: mid }).sort({
//         activoquestion: 1,
//       });
//       return res.json({
//         ok: true,
//         msg: "ActivoQuestion editado",
//         activoquestionsEditado,
//       });
//     }

//     const diferenteActivoQuestionEncontrado = await ActivoQuestion.findOne({
//       cid,
//       mid,
//       activoquestion,
//     });

//     if (!diferenteActivoQuestionEncontrado) {
//       await ActivoQuestion.findByIdAndUpdate(bid, req.body, { new: true });
//       const activoquestionsEditado = await ActivoQuestion.find({ mid: mid }).sort({
//         activoquestion: 1,
//       });
//       return res.json({
//         ok: true,
//         msg: "ActivoQuestion editado",
//         activoquestionsEditado,
//       });
//     } else {
//       await ActivoQuestion.findByIdAndUpdate(bid, req.body, { new: true });
//       await ActivoQuestion.findByIdAndUpdate(
//         diferenteActivoQuestionEncontrado._id,
//         { activoquestion: mismoActivoQuestionEncontrado.activoquestion },
//         { new: true }
//       );
//       const activoquestionsEditado = await ActivoQuestion.find({ mid: mid }).sort({
//         activoquestion: 1,
//       });
//       return res.json({
//         ok: true,
//         msg: "ActivoQuestion editado",
//         activoquestionsEditado,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       ok: false,
//       msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
//     });
//   }
// };
