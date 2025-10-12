import { getAllFlag } from "../model/featureFlagsModel.js" //.js is important else error
import redisClient from "../config/redisConfig.js"
export const getAllFlagController= async(req, res ) =>{
    try{
        const cacheKey = `flag:all`
        const cacheRes = await redisClient.get(cacheKey) //cacheKey will be a json
        if(cacheRes){
            console.log("cache hit")
            return res.status(200).json({flags:JSON.parse(cacheRes)}) //so,convert json to object and then -> again send in the form of json(becoz of .json)
        }
        const result = await getAllFlag() 
        // console.log(result) //return array of flags
        if(result.length == 0){
            const mes  = 'there are no flags in the table'
           return res.status(200).json({message:mes})
           //don't cache it  (as we are not invalidating redis data incase ,same record inserted) , so, if redis caches this -> then no records found msg till it expires
        } 
        else {
            await redisClient.set(cacheKey ,JSON.stringify(result)) //stored object of arrays in the json format
            await redisClient.expire(cacheKey , 60)
            return res.status(200).json({flags:result}) //result -> object of array
        }
    }
    catch(e){
        console.log("error while fetching flags from table " , e.stack) ;
        return res.status(500).json({error : 'Backend issue , failed to fetch all the flags from the table'})
    }
}