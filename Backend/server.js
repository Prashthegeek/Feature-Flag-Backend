import express from 'express'
const app = express() 
//controllers
import flagRoutes from './routes/flagRoutes.js'  //not {flagRoutes} as export default used in flagRoutes

//routes
app.use("/flag" ,flagRoutes );

const PORT = 5000
app.listen(PORT , ()=>{
    console.log(`Server running at port ${PORT}`)
})  