import { Schema, Types, model } from "mongoose";

interface Question {
  qid: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  bid: Schema.Types.ObjectId;
  sid: Schema.Types.ObjectId;
  numero: number;
  tipo: string;
  enunciado: string;
  respuesta?: string;
  width?: number;
  alternativas?: Array<Alternativa>;
}

interface Alternativa {
  alternativa: string;
  letra: string;
  estado: boolean;
}

const QuestionSchema = new Schema<Question>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
  },
  mid: {
    type: Schema.Types.ObjectId,
    ref: "Modulo",
  },
  bid: {
    type: Schema.Types.ObjectId,
    ref: "Bloque",
  },
  sid: {
    type: Schema.Types.ObjectId,
    ref: "Seccion",
  },
  tipo: {
    type: String,
    required: true,
    trim: true,
  },
  numero: {
    type: Number,
    required: true,
    trim: true,
  },
  enunciado: {
    type: String,
    required: true,
    trim: true,
  },
  respuesta: {
    type: String,
    default: "",
    trim: true,
  },
  width: {
    type: Number,
    default: 100,
    trim: true,
  },
  alternativas: {
    type: Array<Alternativa>(),
    default: [
      { alternativa: "", letra: "A", estado: false },
      { alternativa: "", letra: "B", estado: false },
      { alternativa: "", letra: "C", estado: false },
      { alternativa: "", letra: "D", estado: false },
    ],
    trim: true,
  },
});

QuestionSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.qid = _id;
  return object;
});

export default model("Question", QuestionSchema);
