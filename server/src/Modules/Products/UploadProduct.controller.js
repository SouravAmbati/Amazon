import {v2 as cloudinary} from "cloudinary";
import { createProductService } from "./UploadProduct.service.js";


export const createProduct = async (req, res) => {
  try {
    const { product_name, colors, sizes, about_product, price,category } = req.body;
    if(!product_name&&!colors&&!sizes&&!about_product&&!price&&!category){
      return res.send({success:false,message:"All fields are required"});
    }
    const image1=req.files.image1[0];
    const image2=req.files.image2[0];
    const image3=req.files.image3[0];
    const image4=req.files.image4[0];
    const images=[image1,image2,image3,image4].filter((item)=>item!=undefined);
    let imagesURL=await Promise.all(
        images.map(async (item)=>{
            let result=await cloudinary.uploader.upload(item.path,{resource_type:'image'});
            return result.secure_url;
        })
    )
    console.log(imagesURL);
    const response=await createProductService(product_name, colors,imagesURL, sizes, about_product, price,category);
    res.send(response);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
