import { Schema, Types, model } from "mongoose";

interface Ejercicio {
  eid: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  numero: number;
  multiple: { estado: boolean; columnas: number };
  enunciado?: string;
  titulo?: string;
  activo: boolean;
  evaluacion: boolean;
}

const EjercicioSchema = new Schema<Ejercicio>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
  },
  mid: {
    type: Schema.Types.ObjectId,
    ref: "Modulo",
  },
  numero: {
    type: Number,
    required: true,
    trim: true,
  },
  multiple: {
    estado: {
      type: Boolean,
      required: true,
      default: false,
    },
    columnas: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  enunciado: {
    type: String,
    trim: true,
  },
  titulo: {
    type: String,
    trim: true,
  },
  activo: {
    type: Boolean,
    required: true,
    default: false,
  },
  evaluacion: {
    type: Boolean,
    required: true,
    default: false,
  },
});

EjercicioSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.eid = _id;
  return object;
});

export default model("Ejercicio", EjercicioSchema);
