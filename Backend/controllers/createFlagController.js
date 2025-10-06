import { insertFlag } from "../model/featureFlagsModel.js"

export const createFlagController= async(req, res) =>{
    try{
        const {name , description , rolloutPercentage} = req.body 
        // console.log(req.body)
        if(!name || rolloutPercentage === undefined) {
            return res.status(400).json({error: 'both name and rollout percentage fields are compulsorily required'})
        } 

        const rollout = Number(rolloutPercentage);  //in case someone gives rolloutPercentage as string in the req body
            if (isNaN(rollout)) {
            return res.status(400).json({ error: "rolloutPercentage must be numeric" });
        }

        const newFlag = await insertFlag({name , description , rolloutPercentage:rollout}) //returns the flag or the tuple
        res.status(200).json({message:'flag creation succesfull' , flag:newFlag})
    }
    catch(err){
        console.log(err.stack)
        res.status(500).json({error:err.stack})
    }
}