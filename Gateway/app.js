import express from "express";
import proxy from "express-http-proxy";

const app = express();

app.use("/admin", proxy("http://localhost:3001"));

app.listen(3000,()=>{
    console.log(`Gateway service is running on port 3000`)
})