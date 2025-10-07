import { getAllFlag } from "../model/featureFlagsModel.js" //.js is important else error

export const getAllFlagController= async(req, res ) =>{
    try{
        const result = await getAllFlag() 
        // console.log(result) //return array of flags
        if(result.length == 0) return res.status(200).json({message:'there are no flag in the table'})
        else return res.status(200).json({flags:result}) //show full array
    }
    catch(e){
        console.log("error while fetching flags from table " , e.stack) ;
        return res.status(500).json({error : 'Backend issue , failed to fetch all the flags from the table'})
    }
}