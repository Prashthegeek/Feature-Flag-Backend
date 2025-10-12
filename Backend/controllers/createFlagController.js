import { insertFlag } from "../model/featureFlagsModel.js"

export const createFlagController= async(req, res) =>{
    try{
        const {name , description , rollout_percentage} = req.body 
        // console.log(req.body)
        if(!name || rollout_percentage === undefined) {
            return res.status(400).json({error: 'both name and rollout_percentage fields are compulsorily required'})
        } 

        const rollout = Number(rollout_percentage);  //in case someone gives rolloutPercentage as string in the req body
            if (isNaN(rollout)) {
            return res.status(400).json({ error: "rollout_percentage must be numeric" });
        }

        const newFlag = await insertFlag({name , description , rollout_percentage:rollout}) //returns the flag or the tuple
        res.status(200).json({message:'flag creation succesfull' , flag:newFlag})
    }
    catch(err){
        console.log(err.stack)
        res.status(500).json({error:err.stack})
    }
}