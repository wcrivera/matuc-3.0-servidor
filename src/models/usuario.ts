import { Schema, Types, model } from "mongoose";

interface Usuario {
  uid: Types.ObjectId;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  activo: boolean
  admin: boolean;
}

const UsuarioSchema = new Schema<Usuario>({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: false,
    trim: true,
  },
  activo: {
    type: Boolean,
    required: true,
    default: false,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

UsuarioSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

export default model("Usuario", UsuarioSchema);
