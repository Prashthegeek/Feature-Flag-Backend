import { deleteFlag } from "../model/featureFlagsModel.js";

export const deleteParticularFlag = async(req, res) =>{
    const id = parseInt(req.params?.id , 10 )//convert to integer in case string is received
    if(!id || id=='undefined'){
        return res.status(400).json({message:'id is required'}) 
    }
    try{
        const result = await deleteFlag(id);
        if(!result){
            return res.status(400).json({message:'No flag with id -> {$id} is found'})
        }
        return res.status(200).json({message:`flag with id->${id} has been deactivated`, flag:result})
    }catch(err){
        console.log(err.stack)
        return res.status(500).json({error:'Flag deletion failed(backend issue) '})
    }
}