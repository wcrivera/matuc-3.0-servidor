import { Schema, Types, model } from "mongoose";

interface Modulo {
  mid: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  modulo: number;
  nombre: string;
  activo: Boolean;
}

const ModuloSchema = new Schema<Modulo>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Modulo",
  },
  modulo: {
    type: Number,
    required: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  activo: {
    type: Boolean,
    default: true,
  },
});

ModuloSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.mid = _id;
  return object;
});

export default model("Modulo", ModuloSchema);
