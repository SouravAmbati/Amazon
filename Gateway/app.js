import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "IdempotencyKey",
  ],
};

app.use(cors(corsOptions));

// Explicitly handle browser preflight requests
app.options(/.*/, cors(corsOptions));

app.use("/admin", proxy("http://localhost:3001"));

app.listen(3000,()=>{
    console.log(`Gateway service is running on port 3000`)
})