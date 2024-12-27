import { Schema, Types, model } from "mongoose";

interface Diapositiva {
  activo: boolean;
}

const Diapositiva = new Schema<Diapositiva>({
  activo: {
    type: Boolean,
    default: false,
  },
});

interface Video {
  activo: boolean;
}

const Video = new Schema<Video>({
  activo: {
    type: Boolean,
    default: false,
  },
});

interface Pregunta {
  activo: boolean;
  multiple: boolean;
}

const Pregunta = new Schema<Pregunta>({
  activo: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

interface Activo {
  id: Types.ObjectId;
  gid: Schema.Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  bid: Schema.Types.ObjectId;
  sid: Schema.Types.ObjectId;
  diapositiva: Diapositiva;
  video: Video;
  pregunta: Pregunta 
}

const ActivoSchema = new Schema<Activo>({
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
  diapositiva: {
    type: Diapositiva,
    default: { activo: false },
  },
  video: {
    type: Video,
    default: { activo: false },
  },
  pregunta: {
    type: Pregunta,
    default: { activo: false, multiple: false },
  },
});

ActivoSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default model("Activo", ActivoSchema);
