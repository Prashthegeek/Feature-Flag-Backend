import redisClient from "../config/redisConfig.js";
import { deleteFlag , findWithId} from "../model/featureFlagsModel.js";

export const deleteParticularFlag = async(req, res) =>{
    const id = parseInt(req.params?.id , 10 )//convert to integer in case string is received
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid or missing ID' })
    }
    try{
        //1.check if this id exists or not 
        const flagStatus = await findWithId(id);
        if(!flagStatus){
            return res.status(400).json({message: `flag with id=${id} doesn't exist `})
        }
        if(flagStatus.is_deleted){
            return res.status(400).json({message: `flag with id=${id} was already deleted , no need to delete it again`})
        }
        // 2. Soft delete: update is_active = false(since, analytics me use)
        const result = await deleteFlag(id);

        //above checks already passed ,so , no definitely , result will not be empty 
        //delete stored instance of this flag from redis

        // 3. invalidate Redis Caches
        const cacheKey = `flag:${id}`;
        const wholeTableCacheKey = `flag:all`;

        // using Promise.all for faster concurrent execution
        await Promise.all([
            redisClient.del(cacheKey),  //won't be giving any error even if cacheKey doesn't exist, feature of redis
            redisClient.del(wholeTableCacheKey) //won't be giving any error even if wholeTAbleCacheKey doesn't exist, feature of redis
        ]);
        return res.status(200).json({message:`flag with id->${id} has been marked as deleted `, flag:result})
    }catch(err){
        console.log(err.stack)
        return res.status(500).json({error:'Flag deletion failed(backend issue) '})
    }
}