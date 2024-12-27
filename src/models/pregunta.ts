import { Schema, Types, model } from "mongoose";

interface Pregunta {
  pid: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  eid: Schema.Types.ObjectId;
  numero: number;
  tipo: string;
  enunciado: string;
  respuesta?: string;
  inline?: boolean;
  width?: number;
  alternativas?: Array<Alternativa>;
}

interface Alternativa {
  alternativa: string;
  letra: string;
  estado: boolean;
}

const PreguntaSchema = new Schema<Pregunta>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
  },
  mid: {
    type: Schema.Types.ObjectId,
    ref: "Modulo",
  },
  eid: {
    type: Schema.Types.ObjectId,
    ref: "Ejercicio",
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
  inline: {
    type: Boolean,
    default: false,
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

PreguntaSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.pid = _id;
  return object;
});

export default model("Pregunta", PreguntaSchema);
