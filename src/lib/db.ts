import mysql, { ConnectionOptions } from "mysql2/promise";

const access: ConnectionOptions = {
  host: "localhost",
  user: "root",
  password: "",
  database: "cdn_core",
};

export const createConnection = async () => {
  return mysql.createConnection(access);
};
