// lib/db.js
import mysql from 'mysql2/promise';

const connectionParams = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export const getConnection = async () => {
  const connection = await mysql.createConnection(connectionParams);
  return connection;
};