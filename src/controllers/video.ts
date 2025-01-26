import { RequestHandler } from "express";
import Video from "../models/video";
import Usuario from "../models/usuario";
import Matricula from "../models/matricula";
import Activo from "../models/activo";
// import Modulo from "../models/modulo";
import Seccion from "../models/seccion";

export const obtenerVideosModulo: RequestHandler = async (req, res) => {
  const { mid } = req.params;

  try {
    const { uid } = req.params;

    const usuario = await Usuario.findOne({ _id: uid });

    console.log(usuario);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

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
    //   const videos = await Video.find(
    //     { mid: mid },
    //     {
    //       cid: false,
    //       mid: false,
    //       url: false,
    //     }
    //   );
    //   return res.json({
    //     ok: true,
    //     videos,
    //   });
    // }

    // const activos = (await Activo.find({ mid: mid }))
    //   .filter((item) => item.video.activo)
    //   .map((item) => item.sid.toString());

    // const videos = await Video.find(
    //   { sid: { $in: activos } },
    //   {
    //     cid: false,
    //     mid: false,
    //     url: false,
    //   }
    // );

    if (usuario.admin) {
      const videos = await Video.find({ mid: mid });

      return res.json({
        ok: true,
        videos,
      });
    }

    const videos = await Video.find(
      { mid: mid },
      {
        cid: false,
        mid: false,
        url: false,
      }
    );

    return res.json({
      ok: true,
      videos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

export const obtenerVideoSeccion: RequestHandler = async (req, res) => {
  const { sid } = req.params;

  try {
    // const video = await Video.findOne({ sid: sid });

    // if (!video) {
    //   return res.json({
    //     ok: false,
    //     msg: "Video no existe",
    //   });
    // }

    // return res.json({
    //   ok: true,
    //   video,
    // });

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
      const video = await Video.findOne({ sid: sid });
      return res.json({
        ok: true,
        video,
      });
    }

    const activo = await Activo.findOne({ sid: sid });

    if (activo && activo.video.activo) {
      const video = await Video.findOne({ sid: sid });
      return res.json({
        ok: true,
        video,
      });
    }

    return res.json({
      ok: false,
      msg: "Video no está activo",
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
export const crearVideo: RequestHandler = async (req, res) => {
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

    const nuevoVideo = new Video(req.body);
    const videoCreado = await nuevoVideo.save();

    return res.json({
      ok: true,
      msg: "Video creado",
      videoCreado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarVideo: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    const { id } = req.params;
    const video = await Video.findById(id);

    const matricula = await Matricula.findOne({ uid: uid, cid: video?.cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const videoEliminado = await Video.findByIdAndDelete(id);

    return res.json({
      ok: true,
      msg: "Video eliminado",
      videoEliminado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const editarVideo: RequestHandler = async (req, res) => {
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

    const { vid, sid, mid, bid, seccion } = req.body;

    const mismoVideoEncontrado = await Video.findOne({ _id: vid });

    if (!mismoVideoEncontrado) {
      return res.json({
        ok: false,
        msg: "Video no existe",
      });
    }

    const videoEditado = await Video.findByIdAndUpdate(vid, req.body, {
      new: true,
    });

    return res.json({
      ok: true,
      msg: "Video editada",
      videoEditado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};
