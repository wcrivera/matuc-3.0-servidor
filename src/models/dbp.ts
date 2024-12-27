import { Schema, Types, model } from 'mongoose';

interface DBP {
    id: Types.ObjectId;
    cid: Schema.Types.ObjectId
    mid: Schema.Types.ObjectId
    pid: Schema.Types.ObjectId
    uid: Schema.Types.ObjectId
    fecha: Date
    respuesta: string
    estado: boolean
}

const DBPSchema = new Schema<DBP>({
    cid: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        required: true
    },
    mid: {
        type: Schema.Types.ObjectId,
        ref: 'Modulo',
        required: true
    },
    pid: {
        type: Schema.Types.ObjectId,
        ref: 'Pregunta',
        required: true
    },
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha: {
        type: Date,
        default: new Date()
    },
    respuesta: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: Boolean,
        required: true,
        trim: true
    }
});

DBPSchema.method('toJSON', function () {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

export default model("DBP", DBPSchema)

