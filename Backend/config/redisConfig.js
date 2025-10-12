//npm i ioredis
import Redis from 'ioredis'

const redisClient = new Redis() //this creates tcp connection with render

export default redisClient 

