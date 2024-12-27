import { RequestHandler } from "express";
import Diapositiva from "../models/diapositiva";
import Usuario from "../models/usuario";
import Matricula from "../models/matricula";
// import Modulo from "../models/modulo";
import Seccion from "../models/seccion";
import Activo from "../models/activo";

export const obtenerDiapositivasModulo: RequestHandler = async (req, res) => {
  const { mid } = req.params;

  try {
    // const { uid } = req.params;

    // const modulo = await Modulo.findOne({ _id: mid });

    // if (!modulo) {
    //   return res.status(404).json({
    //     ok: false,
    //     msg: "Modulo no encontrado",
    //   });
    // }

    // const matricula = await Matricula.findOne({ cid: modulo.cid, uid: uid });

    // if (!matricula) {
    //   return res.status(404).json({
    //     ok: false,
    //     msg: "Matrícula no existe",
    //   });
    // }

    // if (matricula.rol === "Profesor" || matricula.rol === "Ayudante") {
    //   const diapositivas = await Diapositiva.find(
    //     { mid: mid },
    //     {
    //       cid: false,
    //       mid: false,
    //       autor: false,
    //       diapositivas: false,
    //       publico: false,
    //     }
    //   );
    //   return res.json({
    //     ok: true,
    //     diapositivas,
    //   });
    // }

    // const activos = (await Activo.find({ mid: mid }))
    //   .filter((item) => item.diapositiva.activo)
    //   .map((item) => item.sid.toString());

    // const diapositivas = await Diapositiva.find(
    //   { sid: { $in: activos } },
    //   {
    //     cid: false,
    //     mid: false,
    //     autor: false,
    //     diapositivas: false,
    //     publico: false,
    //   }
    // );

    const diapositivas = await Diapositiva.find(
      { mid: mid },
      {
        cid: false,
        mid: false,
        autor: false,
        diapositivas: false,
        publico: false,
      }
    );

    return res.json({
      ok: true,
      diapositivas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const obtenerDiapositivasBloque: RequestHandler = async (req, res) => {
  const { bid } = req.params;

  try {
    // const { uid } = req.params;

    // const bloque = await Bloque.findOne({ _id: bid });

    // if (!bloque) {
    //   return res.status(404).json({
    //     ok: false,
    //     msg: "Bloque no encontrado",
    //   });
    // }

    // const matricula = await Matricula.findOne({ cid: bloque.cid, uid: uid });

    // if (!matricula) {
    //   return res.status(404).json({
    //     ok: false,
    //     msg: "Matrícula no existe",
    //   });
    // }

    // if (matricula.rol === "Profesor" || matricula.rol === "Ayudante") {
    //   const diapositivas = await Diapositiva.find({ bid: bid });
    //   return res.json({
    //     ok: true,
    //     diapositivas,
    //   });
    // }

    const activos = (await Activo.find({ bid: bid }))
      .filter((item) => item.diapositiva.activo)
      .map((item) => item.sid.toString());

    if (activos.length === 0) {
      return res.json({
        ok: false,
        msg: "Diapositiva no existe",
      });
    }

    const diapositivas = await Diapositiva.find({ sid: { $in: activos } });

    // console.log(diapositivas)

    return res.json({
      ok: true,
      diapositivas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const obtenerDiapositivaSeccion: RequestHandler = async (req, res) => {
  const { sid } = req.params;

  try {
    const { uid } = req.params;

    const seccion = await Seccion.findOne({ _id: sid });

    if (!seccion) {
      return res.status(404).json({
        ok: false,
        msg: "Sección no encontrada",
      });
    }

    const matricula = await Matricula.findOne({ cid: seccion.cid, uid: uid });

    if (!matricula) {
      return res.status(404).json({
        ok: false,
        msg: "Matrícula no existe",
      });
    }

    if (matricula.rol === "Profesor" || matricula.rol === "Ayudante") {
      const diapositiva = await Diapositiva.findOne({ sid: sid });
      return res.json({
        ok: true,
        diapositiva,
      });
    }

    const activo = await Activo.findOne({ sid: sid });

    if (activo && activo.diapositiva.activo) {
      const diapositiva = await Diapositiva.findOne({ sid: sid });
      return res.json({
        ok: true,
        diapositiva,
      });
    }

    return res.json({
      ok: false,
      msg: "Diapositiva no está activa",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const obtenerDiapositivasBloquePublico: RequestHandler = async (
  req,
  res
) => {
  const { bid } = req.params;

  try {
    // const diapositivas = await Diapositiva.find({ bid: bid, publico: true });
    const diapositivas = await Diapositiva.find({ bid: bid });

    if (diapositivas.length === 0) {
      return res.json({
        ok: false,
        msg: "Diapositiva no existe",
      });
    }

    return res.json({
      ok: true,
      diapositivas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// ADMINISTRADOR
export const crearDiapositiva: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { cid } = req.body;

    const matricula = await Matricula.findOne({ uid: uid, cid: cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const nuevaDiapositiva = new Diapositiva(req.body);
    const diapositivaCreada = await nuevaDiapositiva.save();

    return res.json({
      ok: true,
      msg: "Diapositiva creada",
      diapositivaCreada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarDiapositiva: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { cid } = req.body;

    const matricula = await Matricula.findOne({ uid: uid, cid: cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const { did } = req.params;

    const diapositivaEliminada = await Diapositiva.findByIdAndDelete(did);

    return res.json({
      ok: true,
      msg: "Diapositiva eliminada",
      diapositivaEliminada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const editarDiapositiva: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { did } = req.params;
    const diapositiva = await Diapositiva.findById(did);

    const matricula = await Matricula.findOne({
      uid: uid,
      cid: diapositiva?.cid,
    });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const mismaDiapositivaEncontrado = await Diapositiva.findOne({ _id: did });

    if (!mismaDiapositivaEncontrado) {
      return res.json({
        ok: false,
        msg: "Diapositiva no existe",
      });
    }

    const diapositivaEditada = await Diapositiva.findByIdAndUpdate(
      did,
      req.body,
      { new: true }
    );

    return res.json({
      ok: true,
      msg: "Diapositiva editada",
      diapositivaEditada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};
