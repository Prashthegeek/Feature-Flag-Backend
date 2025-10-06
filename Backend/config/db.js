import {Pool} from 'pg'
import dotenv from 'dotenv'
dotenv.config() 

// const {Pool} = pg
const pool = new Pool({
  host: process.env.db_host,
  port: process.env.db_port,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database
});
//steps -> start docker desktop , docker-compose up -d , then it would work
pool.connect()
  .then(() => console.log("Connected to Postgres"))
  .catch(err => console.error("Postgres connection error:", err));

export default pool 