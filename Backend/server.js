import express from 'express'
const app = express() 
app.use(express.json()) ; //for parsing the request body

import flagRoutes from './routes/flagRoutes.js'  //not {flagRoutes} as export default used in flagRoutes
import { initializeFeatureFlagTable } from './model/featureFlagsModel.js';
//routes
app.use("/flag" ,flagRoutes );

const PORT = 5000
app.listen(PORT , async()=>{
    console.log(`Server running at port ${PORT}`)
    //initialize the table(feature flag table)
    await initializeFeatureFlagTable() ; //create the table
})  