import {Router} from 'express'
import {createFlagController} from '../controllers/createFlagController.js' //.js laga dena (since, esm)
import {getAllFlagController} from '../controllers/getAllFlagController.js'
const router = Router() 

router.post('/' , createFlagController)  //for post req on api -> /flag
router.get('/' , getAllFlagController) // for get req on api -> /flag

export default router ;  