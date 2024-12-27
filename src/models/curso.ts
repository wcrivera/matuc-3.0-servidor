import { Schema, model, Types } from 'mongoose';

interface Curso {
    cid: Types.ObjectId;
    sigla: string,
    nombre: string,
    descripcion: string,
    activo: boolean,
    publico: boolean
}

const CursoSchema = new Schema<Curso> ({
    sigla: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    }, 
    descripcion: {
        type: String,
        required: true,
        trim: true
    }, 
    activo: {
        type: Boolean,
        default: false
    }, 
    publico: {
        type: Boolean,
        default: false
    }
});

CursoSchema.method('toJSON', function() {
    const { _id, ...object } = this.toObject();
    object.cid = _id;
    return object;
})

export default model("Curso", CursoSchema)

