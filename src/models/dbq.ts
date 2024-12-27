import { Schema, Types, model } from "mongoose";

interface DBQ {
  id: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  bid: Schema.Types.ObjectId;
  sid: Schema.Types.ObjectId;
  qid: Schema.Types.ObjectId;
  uid: Schema.Types.ObjectId;
  fecha: Date;
  respuesta: string;
  estado: boolean;
}

const DBQSchema = new Schema<DBQ>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
    required: true,
  },
  mid: {
    type: Schema.Types.ObjectId,
    ref: "Modulo",
    required: true,
  },
  bid: {
    type: Schema.Types.ObjectId,
    ref: "Bloque",
    required: true,
  },
  sid: {
    type: Schema.Types.ObjectId,
    ref: "Seccion",
    required: true,
  },
  qid: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  uid: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  fecha: {
    type: Date,
    default: new Date(),
  },
  respuesta: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: Boolean,
    required: true,
    trim: true,
  },
});

DBQSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default model("DBQ", DBQSchema);
