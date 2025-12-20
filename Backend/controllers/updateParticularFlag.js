import {updateFlag , findWithId} from '../model/featureFlagsModel.js'
import redisClient from '../config/redisConfig.js'

export const updateParticularFlag = async(req, res) =>{
    //find the id from the path
    // const {id} = req.params;
    const id = parseInt(req.params?.id, 10);
    if(isNaN(id)){
        return res.status(400).json({message:"the id must be a number"})
    }
    
    try{
        //1.check the status for this flag(already deleted hai ki nahi )
        const flagStatus = await findWithId(id) ;  
        if(!flagStatus){
            return res.status(400).json({message : 'flagId not found'})
        }
        if(flagStatus.is_deleted){
            return res.status(400).json({message: 'this flag is already deleted, you cannot update it'})
        }
    

        let {name , description , is_active , rollout_percentage } = req.body 

        //2. creating the object with these fields 
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

    
        //3. now call the function to update with valid values 
        const result = await updateFlag(id , filteredObj)
        //now, don't think ki result can never be empty because of above two checks... because, imagine-> above check ke time ,this record was there in the
        //table,but since, ek hi admin thori na hota hai ek table ka,so ,kisi aur admin ne delete kar diya table (and this happened between)
        //step 1 and 3 (so, before this updation ,the record has already been deleted, so backend se -> undefined aayega and this will be stored in the result)
        //so, check -> if result is empty or not(if, empty ,then -> record was deleted in between before teh updation)
        if(!result) {
            return res.status(404).json({message : "Update failed. This record might have beeen deleted before the updation ,maybe because of the concurrent execution of different admin"})
        }
        
        
        //4. change the cached value if present in redis for this flag
        const cacheKey = `flag:${id}`
        const wholeTableCacheKey = `flag:all` ;
        //use Promise.all(array of tasks) instead of linear sequential lines (batch them all, so ,all executes in parallel for faster execution)
        await Promise.all([
            redisClient.del(wholeTableCacheKey) , //even if this cache not there in redis, still no error thrown , feature of redis 
            redisClient.set(cacheKey, JSON.stringify(result)) , 
            redisClient.expire(cacheKey, 60) 
        ])

        

        //finally , return the updated record
        return res.status(200).json({message:`field updated for id = ${id}` , flag:result})
    }
    catch(err){
        console.log('error while updating the flag' , err.stack )
        return res.status(500).json({message:'field updation failed , backend issue'})
    }
    

}

