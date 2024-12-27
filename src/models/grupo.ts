import { Schema, Types, model } from "mongoose";

interface Grupo {
  gid: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  grupo: number;
}

const GrupoSchema = new Schema<Grupo>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
    required: true,
  },
  grupo: {
    type: Number,
    required: true,
    trim: true,
  },
});

GrupoSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.gid = _id;
  return object;
});

export default model("Grupo", GrupoSchema);
