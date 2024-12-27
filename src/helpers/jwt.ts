import * as jwt from 'jsonwebtoken';
import config from '../config';

export const generarJWT = (uid : string) =>  {
    
    return new Promise(( resolve, reject ) => {
        
        const payload = { uid };

        jwt.sign(payload, config.SECRET_JWT_SEED_CLIENTE, {
            expiresIn: '60d'
        }, ( err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT')
            } else {
                resolve(token);
            }
        });

    });
}

// export const generarPJWT = (uid : string) =>  {
    
//     return new Promise(( resolve, reject ) => {
        
//         const payload = { nombre: 'Claudio', apellido: 'Rivera', email: 'wcrivera@uc.cl', curso: 'PIMUA', grupo: 1 };

//         jwt.sign(payload, config.SECRET_JWT_SEED_PIMU, {
//             expiresIn: '60d'
//         }, ( err, token) => {
//             if (err) {
//                 console.log(err);
//                 reject('No se pudo generar el JWT')
//             } else {
//                 resolve(token);
//             }
//         });

//     });
// }

export const generarJWTAdmin = (uid : string) =>  {
    
    return new Promise(( resolve, reject ) => {
        
        const payload = { uid };

        jwt.sign(payload, config.SECRET_JWT_SEED_ADMIN, {
            expiresIn: '60d'
        }, ( err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT')
            } else {
                resolve(token);
            }
        });

    });
}

export const comprobarJWT = (token = '') => {

    try {
        const payload: any = jwt.verify(token, config.SECRET_JWT_SEED_CLIENTE);

        return [true, payload.uid]

    } catch (error) {
        return [false, null]
    }
}

export const comprobarAdminJWT = (token = '') => {

    try {
        const payload: any = jwt.verify(token, config.SECRET_JWT_SEED_ADMIN);

        return [true, payload.uid]

    } catch (error) {
        return [false, null]
    }
}

