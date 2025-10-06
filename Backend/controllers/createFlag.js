import { insertFlag } from "../model/featureFlagsModel.js"

export const createFlag = async(req, res) =>{
    try{
        const {name , description , rollout_percentage} = req.body 
        if(!name || rollout_percentage === undefined) {
            return res.status(400).json({error: 'name and rollout percentage is required'})
        } 
        const newFlag = await insertFlag({name , description , rollout_percentage})
        res.status(200).json({message:'flag creation succesfull' , flag:newFlag})
    }
    catch(err){
        console.log(err.stack)
        res.status(500).json({error:'failed to create flag'})
    }
}