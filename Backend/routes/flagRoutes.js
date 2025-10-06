import {Router} from 'express'
import {createFlag} from './controllers/createFlag.js' //.js laga dena (since, esm)
const router = Router() 

router.post('/' , createFlag)  //for post req on api -> /flag

export default router ;  