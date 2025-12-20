import {updateFlag} from '../model/featureFlagsModel.js'
import redisClient from '../config/redisConfig.js'
export const updateParticularFlag = async(req, res) =>{
    let {name , description , is_active , rollout_percentage } = req.body 

    //creating the object with these fields 
    const obj = {name , description , is_active , rollout_percentage }
    // const {name , description } = obj ; 
    
    //filter out those keys whose values are undefined(because, api is not getting hit by all the values , sometimes user only want to update)
    //rolloutPercentage ,so,he is not going to mention other fields as previous one ... so they are undefined
    
    const filteredObj = {} ;
    for(const key in obj){
        if(obj[key] !== undefined){
            filteredObj[key] = obj[key]
        }
    }


    //find the id from the path
    // const {id} = req.params;
    const id = parseInt(req.params?.id, 10);
    try{
        //now call the function to update with valid values 
        const result = await updateFlag(id , filteredObj)
        //change the cached value if present in redis for this flag
        const cacheKey = `flag:${id}`
        await redisClient.del(cacheKey) ; 
        //also set new values in redis 
        await redisClient.set(cacheKey, JSON.stringify(result))
        await redisClient.expire(cacheKey, 60) //60 sec
        

        //also invalidate the flag:all (cache to store whole table)(since, records updated ), so -> invalidate already stored table
        const wholeTableCacheKey = `flag:all` ;
        await redisClient.del(wholeTableCacheKey); //even if this cache not there in redis, still no error thrown


        //finally , return the updated record
        return res.status(200).json({message:`field updated for id = ${id}` , flag:result})
    }
    catch(err){
        console.log('error while updating the flag' , err.stack )
        return res.status(500).json({message:'field updation failed , backend issue'})
    }
    

}

