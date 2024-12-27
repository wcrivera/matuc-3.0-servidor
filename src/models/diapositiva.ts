import { Schema, Types, model } from "mongoose";

interface Diapositivas {
  did: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  bid: Schema.Types.ObjectId;
  sid: Schema.Types.ObjectId;
  autor: string;
  diapositivas: Array<Diapositiva>;
  publico: Boolean;
}

interface Diapositiva {
  pagina: number;
  contenido: string;
}

const Diapositiva = new Schema<Diapositiva>({
  pagina: {
    type: Number,
    required: false,
    trim: true,
  },
  contenido: {
    type: String,
    required: false,
    trim: true,
  },
});

const DiapositivaSchema = new Schema<Diapositivas>({
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
    unique: true,
  },
  autor: {
    type: String,
    required: true,
    trim: true,
  },
  diapositivas: {
    type: Array<Diapositiva>(),
    default: [{ pagina: 1, contenido: "" }],
    trim: true,
  },
  publico: {
    type: Boolean,
    default: true
  }
});

DiapositivaSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.did = _id;
  return object;
});

export default model("Diapositiva", DiapositivaSchema);
