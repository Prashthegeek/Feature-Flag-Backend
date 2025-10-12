import {findWithId} from '../model/featureFlagsModel.js'
import redisClient from '../config/redisConfig.js'


export const getParticularFlag  =async(req, res) =>{
    try{
        const {id}= req.params ; //req.params is an object ,so destructure it  
        const _id = Number(id) ; //to check if it is number alike or not 
        if(Number.isNaN(_id)) return res.status(400).json({error:'id parameter can only be number'}) //if it is not number,then i cannot query 
        console.log(_id);
        
        //get from redis
        const cacheKey = `flag:${_id}`
        const cacheRes = await redisClient.get(cacheKey) //cacheRes is now json
        if(cacheRes) {
            console.log('cache hit')
            return res.status(200).json({flag:JSON.parse(cacheRes)}) //cacheRes is already json, parse it to object and then fit it in json res 
        }

        //get from db 
        const result = await findWithId(_id)
        // console.log(result)  

        //in case -> result is empty -> means-> no row with this id exist
        if(!result){
            //console.log("no flag with this id exist")
            const mes = "no flag with this id exist"
            await redisClient.set(cacheKey , JSON.stringify({mes:"no flag with this id exist"})) //save in json format(and caps me JSON hota hai)
            await redisClient.expire(cacheKey , 60) //expire after 60 sec(ttl)
            return res.status(200).json({message:mes})
        }

        //set in redis
        redisClient.set(cacheKey , JSON.stringify(result)) //save in json format(and caps me JSON hota hai)
        redisClient.expire(cacheKey , 60) //expire after 60 sec(ttl)
        return res.status(200).json({flag:result})
    }
    catch(err){
        console.log("backend issue handling find a flag with an id ")
        return res.status(500).json({error:'issue while fetching a particular flag with the given id'})
    }
}