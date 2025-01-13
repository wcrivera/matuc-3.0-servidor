import { RequestHandler } from "express";
import Question from "../models/question";
import Usuario from "../models/usuario";
import Matricula from "../models/matricula";

export const obtenerQuestionsModulo: RequestHandler = async (req, res) => {
  const { mid } = req.params;

  try {
    // const { uid } = req.params;

    // const modulo = await Modulo.findOne({ _id: mid });

    // if (!modulo) {
    //   return res.status(404).json({
    //     ok: false,
    //     msg: "Modulo no encontrado",
    //   });
    // }

    // const matricula = await Matricula.findOne({ cid: modulo.cid, uid: uid });

    // if (!matricula) {
    //   return res.status(404).json({
    //     ok: false,
    //     msg: "Matrícula no existe",
    //   });
    // }

    // if (matricula.rol === "Profesor" || matricula.rol === "Ayudante") {
    //   const questions = await Question.find(
    //     { mid: mid },
    //     {
    //       cid: false,
    //       mid: false,
    //       tipo: false,
    //       enunciado: false,
    //       respuesta: false,
    //       width: false,
    //       alternativas: false,
    //     }
    //   );
    //   return res.json({
    //     ok: true,
    //     questions,
    //   });
    // }

    // const activos = (await Activo.find({ mid: mid }))
    //   .filter((item) => item.pregunta.activo)
    //   .map((item) => item.sid.toString());

    // const questions = await Question.find(
    //   { sid: { $in: activos } },
    //   {
    //     cid: false,
    //     mid: false,
    //     tipo: false,
    //     enunciado: false,
    //     respuesta: false,
    //     width: false,
    //     alternativas: false,
    //   }
    // );

    const questions = await Question.find(
      { mid: mid },
      {
        // cid: false,
        // mid: false,
        // tipo: false,
        // enunciado: false,
        // respuesta: false,
        // width: false,
        // alternativas: false,
      }
    ).sort({ numero: 1 });

    return res.json({
      ok: true,
      questions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const obtenerQuestionsSeccion: RequestHandler = async (req, res) => {
  const { sid } = req.params;

  try {
    const questions = await Question.find({ sid: sid }).sort({ numero: 1 });

    return res.json({
      ok: true,
      questions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const obtenerQuestionSeccion: RequestHandler = async (req, res) => {
  const { qid } = req.params;

  // console.log(qid);

  try {
    const question = await Question.findById(qid);

    // console.log(question);

    if (!question) {
      return res.status(404).json({
        ok: false,
        msg: "Pregunta no encontrada",
      });
    }

    return res.json({
      ok: true,
      question,
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
export const crearQuestion: RequestHandler = async (req, res) => {
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

    const nuevoQuestion = new Question(req.body);
    const questionCreada = await nuevoQuestion.save();

    return res.json({
      ok: true,
      msg: "Question creada",
      questionCreada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarQuestion: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { qid } = req.params;
    const question = await Question.findById(qid);
    const matricula = await Matricula.findOne({ uid: uid, cid: question?.cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const questionEliminada = await Question.findByIdAndDelete(qid);

    return res.json({
      ok: true,
      msg: "Pregunta eliminada",
      questionEliminada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const editarQuestion: RequestHandler = async (req, res) => {
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

    const { qid, mid, numero } = req.body;

    const mismaQuestionEncontrada = await Question.findOne({ _id: qid });

    if (!mismaQuestionEncontrada) {
      return res.json({
        ok: false,
        msg: "Question no existe",
      });
    }

    if (mismaQuestionEncontrada.numero === numero) {
      console.log("mismo question");
      await Question.findByIdAndUpdate(qid, req.body, { new: true });
      const questionsActualizada = await Question.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Question editado",
        questionsActualizada,
      });
    }

    const diferenteQuestionEncontrada = await Question.findOne({
      cid,
      mid,
      numero,
    });

    if (!diferenteQuestionEncontrada) {
      await Question.findByIdAndUpdate(qid, req.body, { new: true });
      const questionsActualizada = await Question.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Question editado",
        questionsActualizada,
      });
    } else {
      await Question.findByIdAndUpdate(qid, req.body, { new: true });
      await Question.findByIdAndUpdate(
        diferenteQuestionEncontrada._id,
        { numero: mismaQuestionEncontrada.numero },
        { new: true }
      );
      const questionsActualizada = await Question.find({
        cid: cid,
        mid: mid,
      }).sort({ numero: 1 });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        questionsActualizada,
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
