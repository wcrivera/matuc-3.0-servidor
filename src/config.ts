import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT || "8080",
  DB_CNN_STRING: process.env.DB_CNN_STRING || "admin",
  PRIMARY_CONN_STR: process.env.PRIMARY_CONN_STR || "admin",
  SECONDARY_CONN_STR: process.env.SECONDARY_CONN_STR || "admin",
  SECRET_JWT_SEED_CLIENTE: process.env.SECRET_JWT_SEED_CLIENTE || "cliente",
  SECRET_JWT_SEED_PIMU: process.env.SECRET_JWT_SEED_PIMU || "pimu",
  SECRET_JWT_SEED_ADMIN: process.env.SECRET_JWT_SEED_ADMIN || "admin",
  SECRET_JWT_SEED_USER_MAIL: process.env.SECRET_JWT_SEED_USER_MAIL || "mail",
  SECRET_JWT_SEED_PASS_MAIL: process.env.SECRET_JWT_SEED_PASS_MAIL || "pass",
};
