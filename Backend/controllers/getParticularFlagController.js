import {findWithId} from '../model/featureFlagsModel.js'
export const getParticularFlag  =async(req, res) =>{
    try{
        const {id}= req.params ; //req.params is an object ,so destructure it  
        const _id = Number(id) ; //to check if it is number alike or not 
        if(Number.isNaN(_id)) return res.status(400).json({error:'id parameter can only be number'}) //if it is not number,then i cannot query 
        console.log(_id);
        const result = await findWithId(_id)
        console.log(result) 
        return res.status(200).json({flag:result})
    }
    catch(err){
        console.log("backend issue handling find a flag with an id ")
        return res.status(500).json({error:'issue while fetching a particular flag with the given id'})
    }
}