import mq from "../../../Queue/MqConnection.js";
import pool from "../../db/connection.js";
import { getObjectURL } from "../../storage/uploadURL.js";
import { v4 as uuidv4 } from "uuid";

export const createProduct=async (req,res)=>{
    const maxSize = 10 * 1024 * 1024;
    const client=await pool.connect();
    try {
        const {product_name,image_type,image_size,color_code}=req.body;
        if(!product_name||!image_type||!image_size||!color_code){
            return res.status(400).json({success:false,message: "All Fields Are Required"});
        }
         //validate the the type,size
        if(image_type !== "image/jpeg"){
            return res.status(400).json({success:false,message: "Only JPEG images are allowed"});
        }
        if(image_size>maxSize){
            return res.status(400).json({success:false,message:"Image size cannot exceed 10 MB"});
        }
        //begin transaction
        await client.query("BEGIN");
        //upload product name to product table
        const productId=await client.query("INSERT INTO product(product_name) VALUES($1) RETURNING id;",[product_name]);
        //upload color to color tablen
        const colorId=await client.query("INSERT INTO colors(hashcode) VALUES($1) RETURNING id;",[color_code]);
        await client.query("UPDATE product SET color=$1 WHERE id=$2",[colorId.rows[0].id,productId.rows[0].id]);
        //create the object key
        const objectKey = `product/${uuidv4()}/image.jpg`;
        //upload image storage key to image table 
        const imageId=await client.query("INSERT INTO images(storage_key) VALUES($1) RETURNING id;",[objectKey]);
        //update the id of the img in product table
        await client.query("UPDATE product SET img=$1 WHERE id=$2",[imageId.rows[0].id,productId.rows[0].id]);
        //generate presigned url
        const url= await getObjectURL(objectKey,image_type);
        //commit
        await client.query('COMMIT')
        res.send({success:true,message:url});
    } catch (error) {
        await client.query('ROLLBACK')  
        throw error;
    } finally{
        client.release();
    }
}
export const PublishKeyToQueueController=async(req,res)=>{
    const key=req.body;
    //check if key provided or not
    if(!key){
        res.send({success:false,message:"Please Provife The Object Key"});
    }
    //publish the key
    const channel=await mq.createChannel();
    const exchange="product_image";
    const routingKey="image";
    const queue="product_image_queue";
    await channel.assertExchange(exchange,"direct",{durable:true});
    await channel.assertQueue(queue,{durable:true});
    await channel.bindQueue(queue,exchange,routingKey);
    const test=channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(key)));
    if(test){
        res.send({success:test,message:"successfully published to queue"});
    }
    setTimeout(()=>{
        mq.close();
    },500);
}