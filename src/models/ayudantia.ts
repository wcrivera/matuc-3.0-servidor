import { Schema, Types, model } from "mongoose";

interface Ayudantia {
  id: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  numero: number;
  enunciado: string;
  solucion: string;
  video: string;
}

const AyudantiaSchema = new Schema<Ayudantia>({
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
  enunciado: {
    type: String,
    required: true,
    trim: true,
  },
  solucion: {
    type: String,
    required: false,
    trim: true,
  },
  video: {
    type: String,
    required: false,
    trim: true,
  },
});

AyudantiaSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default model("Ayudantia", AyudantiaSchema);
