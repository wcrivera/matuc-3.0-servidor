import { RequestHandler } from "express";

import Modulo from "../models/modulo";
import Usuario from "../models/usuario";
import Matricula from "../models/matricula";

export const obtenerModulosCurso: RequestHandler = async (req, res) => {
  const { cid, uid } = req.params;

  try {
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado",
      });
    }

    if (usuario.admin) {
      const modulos = await Modulo.find({ cid: cid }).sort({ modulo: 1 });

      const moduloNoticias = {
        mid: "0",
        cid: cid,
        modulo: 0,
        nombre: "Noticias",
      };

      return res.json({
        ok: true,
        msg: "Módulos obtenidos",
        modulos: [moduloNoticias, ...modulos],
      });
    }

    const matricula = await Matricula.findOne({
      cid: cid,
      uid: uid,
      rol: "Profesor",
    });

    if (!matricula) {
      const modulos = await Modulo.find({ cid: cid, activo: true }).sort({
        modulo: 1,
      });

      const moduloNoticias = {
        mid: "0",
        cid: cid,
        modulo: 0,
        nombre: "Noticias",
      };

      return res.json({
        ok: true,
        msg: "Módulos obtenidos",
        modulos: [moduloNoticias, ...modulos],
      });
    } else {
      const modulos = await Modulo.find({ cid: cid }).sort({ modulo: 1 });

      const moduloNoticias = {
        mid: "0",
        cid: cid,
        modulo: 0,
        nombre: "Noticias",
      };

      return res.json({
        ok: true,
        msg: "Módulos obtenidos",
        modulos: [moduloNoticias, ...modulos],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const obtenerModulosCursoPublico: RequestHandler = async (req, res) => {
  const { cid } = req.params;

  try {
    const modulos = await Modulo.find({ cid: cid }).sort("modulo");

    return res.json({
      ok: true,
      msg: "Módulos obtenidos",
      modulos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

// ADMINISTRADOR
export const crearModulo: RequestHandler = async (req, res) => {
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

    const { modulo, nombre } = req.body;

    const nuevoModulo = new Modulo({ cid, modulo, nombre });
    const moduloCreado = await nuevoModulo.save();

    return res.json({
      ok: true,
      msg: "Módulo creado",
      moduloCreado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const eliminarModulo: RequestHandler = async (req, res) => {
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
    const modulo = await Modulo.findById(id);

    const matricula = await Matricula.findOne({ uid: uid, cid: modulo?.cid });

    if (usuario.admin === false && matricula?.rol !== "Administrador") {
      return res.status(403).json({
        ok: false,
        msg: "Usuario sin permiso",
      });
    }

    const moduloEliminado = await Modulo.findByIdAndDelete(id);

    if (moduloEliminado) {
      await Modulo.updateMany(
        { cid: moduloEliminado.cid, modulo: { $gt: moduloEliminado.modulo } },
        { $inc: { modulo: -1 } }
      );

      const modulosActualizado = await Modulo.find({
        cid: moduloEliminado.cid,
      }).sort({ modulo: 1 });

      return res.json({
        ok: true,
        msg: "Módulo eliminado",
        modulosActualizado,
      });
    } else {
      return res.json({
        ok: false,
        msg: "Módulo no existe",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

export const editarModulo: RequestHandler = async (req, res) => {
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

    const { id, modulo } = req.body;

    const mismoModuloEncontrado = await Modulo.findOne({ _id: id });

    if (!mismoModuloEncontrado) {
      return res.json({
        ok: false,
        msg: "Módulo no existe",
      });
    }

    if (mismoModuloEncontrado.modulo === modulo) {
      console.log("mismo módulo");
      await Modulo.findByIdAndUpdate(id, req.body, { new: true });
      const modulosEditado = await Modulo.find({ cid: cid }).sort({
        modulo: 1,
      });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        modulosEditado,
      });
    }

    const diferenteModuloEncontrado = await Modulo.findOne({ cid, modulo });

    if (!diferenteModuloEncontrado) {
      await Modulo.findByIdAndUpdate(id, req.body, { new: true });
      const modulosEditado = await Modulo.find({ cid: cid }).sort({
        modulo: 1,
      });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        modulosEditado,
      });
    } else {
      await Modulo.findByIdAndUpdate(id, req.body, { new: true });
      await Modulo.findByIdAndUpdate(
        diferenteModuloEncontrado._id,
        { modulo: mismoModuloEncontrado.modulo },
        { new: true }
      );
      const modulosEditado = await Modulo.find({ cid: cid }).sort({
        modulo: 1,
      });
      return res.json({
        ok: true,
        msg: "Módulo editado",
        modulosEditado,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    });
  }
};

// export const editarModuloUpDown: RequestHandler = async (req, res) => {
//   try {
//     const { uid } = req.params;
//     const usuario = await Usuario.findById(uid);

//     if (!usuario) {
//       return res.status(404).json({
//         ok: false,
//         msg: "Usuario no registrado",
//       });
//     }

//     if (usuario.admin === false) {
//       return res.status(403).json({
//         ok: false,
//         msg: "Usuario sin permiso",
//       });
//     }

//     const { moduloUp, moduloDown } = req.body;

//     const moduloUpEditado = await Modulo.findByIdAndUpdate(
//       moduloUp.id,
//       moduloUp,
//       { new: true }
//     );
//     const moduloDownEditado = await Modulo.findByIdAndUpdate(
//       moduloDown.id,
//       moduloDown,
//       { new: true }
//     );

//     return res.json({
//       ok: true,
//       msg: "Módulo editado",
//       moduloUpEditado,
//       moduloDownEditado,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       ok: false,
//       msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
//     });
//   }
// };
