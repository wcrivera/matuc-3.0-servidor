import { Schema, Types, model } from "mongoose";

interface Bloque {
  bid: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  bloque: number;
  nombre: string;
}

const BloqueSchema = new Schema<Bloque>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
  },
  mid: {
    type: Schema.Types.ObjectId,
    ref: "Modulo",
  },
  bloque: {
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

BloqueSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.bid = _id;
  return object;
});

export default model("Bloque", BloqueSchema);
