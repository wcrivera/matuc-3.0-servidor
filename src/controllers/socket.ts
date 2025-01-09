import Matricula from "../models/matricula";
import Usuario from "../models/usuario";
import Activo from "../models/activo";
import DBQ from "../models/dbq";
import Ejercicio from "../models/ejercicio";

export const conectarUsuario = async (mid: string) => {
  try {
    const matriculaUpdate = await Matricula.findByIdAndUpdate(
      mid,
      { online: true },
      { new: true }
    );

    if (matriculaUpdate) {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
      };
    }
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
};

export const desconectarUsuario = async (mid: string) => {
  try {
    await Matricula.findByIdAndUpdate(mid, { online: false }, { new: true });
  } catch (error) {
    return { ok: false, payload: undefined };
  }
};

export const obtenerUsuariosConectados = async (cid: string, gid: string) => {
  try {
    const matriculas = await Matricula.find({
      gid: gid,
      cid: cid,
      online: true,
    });

    const uids = matriculas.map((item) => item.uid);
    const usuarios = await Usuario.find(
      {
        _id: {
          $in: uids,
        },
      },
      { nombre: 1, apellido: 1 }
    );

    return { ok: true, payload: usuarios };
  } catch (error) {
    console.log(error);
    return { ok: false, payload: undefined };
  }
};

type ActivoState = {
  id: string;
  gid: string;
  cid: string;
  mid: string;
  bid: string;
  sid: string;
  diapositiva: { activo: boolean; multiple: boolean };
  video: { activo: boolean };
  pregunta: { activo: boolean };
};

export const ActivoSeccion = async (activo: ActivoState) => {
  const { cid, gid, mid, bid, sid } = activo;

  try {
    const activoEncontrado = await Activo.findOne({
      cid: cid,
      gid: gid,
      mid: mid,
      bid: bid,
      sid: sid,
    });

    if (activoEncontrado) {
      const activoEditado = await Activo.findByIdAndUpdate(
        activoEncontrado._id,
        activo,
        { new: true }
      );
      return { ok: true, payload: activoEditado };
    }

    const nuevoActivo = new Activo({
      gid: activo.gid,
      cid: activo.cid,
      mid: activo.mid,
      bid: activo.bid,
      sid: activo.sid,
      diapositiva: activo.diapositiva,
      video: activo.video,
      pregunta: activo.pregunta,
    });
    const activoCreado = await nuevoActivo.save();
    return { ok: true, payload: activoCreado };
  } catch (error) {
    console.log(error);
    return { ok: false, payload: activo };
  }
};

type EjercicioState = {
  eid: string;
  activo: boolean;
};

export const ActivoEjercicio = async (ejercicio: EjercicioState) => {
  const { eid, activo } = ejercicio;

  try {
    const ejercicioEncontrado = await Ejercicio.findById(eid);

    if (ejercicioEncontrado) {
      ejercicioEncontrado.activo = activo;
      const ejercicioEditado = await Ejercicio.findByIdAndUpdate(
        ejercicioEncontrado._id,
        ejercicioEncontrado,
        { new: true }
      );
      return { ok: true, payload: ejercicioEditado };
    }

    return { ok: false, payload: ejercicio };
  } catch (error) {
    console.log(error);
    return { ok: false, payload: ejercicio };
  }
};

type DBQState = {
  cid: string;
  mid: string;
  bid: string;
  sid: string;
  qid: string;
  uid: string;
  fecha: Date;
  respuesta: string;
  estado: boolean;
};

export const crearDBQ = async (activo: DBQState) => {
  try {
    const nuevoDBQ = new DBQ({
      cid: activo.cid,
      mid: activo.mid,
      bid: activo.bid,
      sid: activo.sid,
      qid: activo.qid,
      uid: activo.uid,
      fecha: new Date(),
      respuesta: activo.respuesta,
      estado: activo.estado,
    });
    const dbqCreado = await nuevoDBQ.save();

    return { ok: true, payload: dbqCreado };
  } catch (error) {
    console.log(error);
    return { ok: false, payload: activo };
  }
};
