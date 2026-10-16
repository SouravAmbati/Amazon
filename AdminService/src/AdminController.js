import { uploadFile } from "../utils/UploadFile.js";

export const UploadUrls=async(req,res)=>{
    try {
        const{images}=req.body;
        if(!images){
            return res.json({success:false,message:"Images Required"});
        }
        const urls=await uploadFile(images);
        if(!urls){
            return res.status(400).json({success:false,message:urls});
        }
        res.status(201).json({success:true,urls:urls});
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}