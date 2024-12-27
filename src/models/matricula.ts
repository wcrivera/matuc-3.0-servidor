import { Schema, Types, model } from "mongoose";

interface Matricula {
  mid: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  gid: Schema.Types.ObjectId;
  uid: Schema.Types.ObjectId;
  rol: "Estudiante" | "Ayudante" | "Profesor" | "Administrador";
  online: boolean;
}

const MatriculaSchema = new Schema<Matricula>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
    required: true,
  },
  gid: {
    type: Schema.Types.ObjectId,
    ref: "Grupo",
    required: true,
  },
  uid: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  rol: {
    type: String,
    required: true,
    trim: true,
  },
  online: {
    type: Boolean,
    required: true,
    trim: true,
  },
});

MatriculaSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.mid = _id;
  return object;
});

export default model("Matricula", MatriculaSchema);
