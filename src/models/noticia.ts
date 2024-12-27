import { Schema, Types, model } from "mongoose";

interface Noticia {
  id: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  fecha: Date;
  titulo: string;
  contenido: string;
  activo: boolean;
}

const NoticiaSchema = new Schema<Noticia>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
    trim: true,
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  contenido: {
    type: String,
    required: true,
    trim: true,
  },
  activo: {
    type: Boolean,
    required: true,
    default: false,
  },
});

NoticiaSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default model("Noticia", NoticiaSchema);
