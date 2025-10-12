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
            //store in redis as well
            const mes  = 'there are no flags in the table'
            await redisClient.set('flag:all' ,JSON.stringify(mes)) 
            await redisClient.expire('flag:all' , 60) //expires in 60 sec
           return res.status(200).json({message:mes}) 
        } 
        else {
            await redisClient.set('flag:all' ,JSON.stringify(result)) //stored object of arrays in the json format
            await redisClient.expire('flag:all' , 60)
            return res.status(200).json({flags:result}) //result -> object of array
        }
    }
    catch(e){
        console.log("error while fetching flags from table " , e.stack) ;
        return res.status(500).json({error : 'Backend issue , failed to fetch all the flags from the table'})
    }
}