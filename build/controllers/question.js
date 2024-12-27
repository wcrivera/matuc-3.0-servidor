"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editarQuestion = exports.eliminarQuestion = exports.crearQuestion = exports.obtenerQuestionSeccion = exports.obtenerQuestionsModulo = void 0;
const question_1 = __importDefault(require("../models/question"));
const usuario_1 = __importDefault(require("../models/usuario"));
const matricula_1 = __importDefault(require("../models/matricula"));
const obtenerQuestionsModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const questions = yield question_1.default.find({ mid: mid }, {
            // cid: false,
            // mid: false,
            tipo: false,
            enunciado: false,
            respuesta: false,
            width: false,
            alternativas: false,
        });
        return res.json({
            ok: true,
            questions,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
});
exports.obtenerQuestionsModulo = obtenerQuestionsModulo;
const obtenerQuestionSeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { qid } = req.params;
    // console.log(qid);
    try {
        const question = yield question_1.default.findById(qid);
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
});
exports.obtenerQuestionSeccion = obtenerQuestionSeccion;
// ADMINISTRADOR
const crearQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { cid } = req.body;
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const nuevoQuestion = new question_1.default(req.body);
        const questionCreada = yield nuevoQuestion.save();
        return res.json({
            ok: true,
            msg: "Question creada",
            questionCreada,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.crearQuestion = crearQuestion;
const eliminarQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { qid } = req.params;
        const question = yield question_1.default.findById(qid);
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: question === null || question === void 0 ? void 0 : question.cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const questionEliminada = yield question_1.default.findByIdAndDelete(qid);
        return res.json({
            ok: true,
            msg: "Pregunta eliminada",
            questionEliminada,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.eliminarQuestion = eliminarQuestion;
const editarQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { cid } = req.body;
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const { qid, mid, numero } = req.body;
        const mismaQuestionEncontrada = yield question_1.default.findOne({ _id: qid });
        if (!mismaQuestionEncontrada) {
            return res.json({
                ok: false,
                msg: "Question no existe",
            });
        }
        if (mismaQuestionEncontrada.numero === numero) {
            console.log("mismo question");
            yield question_1.default.findByIdAndUpdate(qid, req.body, { new: true });
            const questionsActualizada = yield question_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Question editado",
                questionsActualizada,
            });
        }
        const diferenteQuestionEncontrada = yield question_1.default.findOne({
            cid,
            mid,
            numero,
        });
        if (!diferenteQuestionEncontrada) {
            yield question_1.default.findByIdAndUpdate(qid, req.body, { new: true });
            const questionsActualizada = yield question_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Question editado",
                questionsActualizada,
            });
        }
        else {
            yield question_1.default.findByIdAndUpdate(qid, req.body, { new: true });
            yield question_1.default.findByIdAndUpdate(diferenteQuestionEncontrada._id, { numero: mismaQuestionEncontrada.numero }, { new: true });
            const questionsActualizada = yield question_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                questionsActualizada,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.editarQuestion = editarQuestion;
