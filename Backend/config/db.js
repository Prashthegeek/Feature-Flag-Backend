const { Pool } = require('pg');
import dotenv from 'dotenv'
dotenv.config() 

const pool = new Pool({
  host: process.env.db_host,
  port: process.env.db_port,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database
});

pool.connect()
  .then(() => console.log("Connected to Postgres"))
  .catch(err => console.error("Postgres connection error:", err));

module.exports = pool;