import redisClient from "../config/redisConfig.js";
import { deleteFlag } from "../model/featureFlagsModel.js";

export const deleteParticularFlag = async(req, res) =>{
    const id = parseInt(req.params?.id , 10 )//convert to integer in case string is received
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid or missing ID' })
    }
    try{
        // Soft delete: update is_active = false(since, analytics me use)
        const result = await deleteFlag(id);
        if(!result){
            return res.status(400).json({message:`No flag with id -> {$id} is found or flag was already deactivated`})
        }
        //delete stored instance of this flag from redis
        const cacheKey = `flag:${id}`
        const cacheRes = await redisClient.del(cacheKey) //throws no error even if not present in redis
        //don't cache again in case of delete (my rule)
        return res.status(200).json({message:`flag with id->${id} has been deactivated`, flag:result})
    }catch(err){
        console.log(err.stack)
        return res.status(500).json({error:'Flag deletion failed(backend issue) '})
    }
}