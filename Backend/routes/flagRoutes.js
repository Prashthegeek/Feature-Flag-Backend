import {Router} from 'express'
import {createFlagController} from '../controllers/createFlagController.js' //.js laga dena (since, esm)
import {getAllFlagController} from '../controllers/getAllFlagController.js'
import {getParticularFlag} from '../controllers/getParticularFlagController.js'
const router = Router() 

router.post('/' , createFlagController)  //for post req on api -> /flag
router.get('/' , getAllFlagController) // for get req on api -> /flag
router.get('/:id' , getParticularFlag) //path paramater , so api hit on -> /flag/:id ex-> /flag/12 ,but, 
//if query parameter hota like -> /flag?id=12 (then api hit only on /flag) , both are paramter and to extract them is same
//as -> const {something_to_extract} = req.params ; in backend 

export default router ;  