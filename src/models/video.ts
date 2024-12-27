import { Schema, Types, model } from "mongoose";

interface Video {
  vid: Types.ObjectId;
  cid: Schema.Types.ObjectId;
  mid: Schema.Types.ObjectId;
  bid: Schema.Types.ObjectId;
  sid: Schema.Types.ObjectId;
  url: string;
}

const VideoSchema = new Schema<Video>({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
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
    unique: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
});

VideoSchema.method("toJSON", function () {
  const { _id, ...object } = this.toObject();
  object.vid = _id;
  return object;
});

export default model("Video", VideoSchema);
