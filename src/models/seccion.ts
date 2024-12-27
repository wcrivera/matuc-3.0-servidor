import { Schema, Types, model } from "mongoose";

interface Seccion {
  sid: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  bid: Schema.Types.ObjectId;
  seccion: number;
  nombre: string;
}

const SeccionSchema = new Schema<Seccion>({
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
  seccion: {
    type: Number,
    required: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
});

SeccionSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.sid = _id;
  return object;
});

export default model("Seccion", SeccionSchema);
