import { Schema, Types, model } from "mongoose";

interface ActivoQuestion {
  id: Types.ObjectId;
  gid: Schema.Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  bid: Schema.Types.ObjectId;
  sid: Schema.Types.ObjectId;
  activo: boolean;
  multiple: boolean;
}

const ActivoQuestionSchema = new Schema<ActivoQuestion>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
  },
  gid: {
    type: Schema.Types.ObjectId,
    ref: "Grupo",
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
  activo: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: true
  },
});

ActivoQuestionSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default model("ActivoQuestion", ActivoQuestionSchema);
