import pool from "../../db/connection.js";
import { getObjectURL } from "../../storage/uploadURL.js";
import { v1 as uuidv1 } from 'uuid';

export const createProduct=async (req,res)=>{
    const maxSize = 10 * 1024 * 1024;
    const client=await pool.connect();
    try {
        const {product_name,image_name,image_type,image_size,color_code}=req.body;
        //begin transaction
        client.query("BEGIN");
        //upload product name to product table
        const productId=await client.query("INSERT INTO product(product_name) VALUES($1) RETURNING id;",[product_name]);
        //upload color to color tablen
        const colorId=await client.query("INSERT INTO colors(hashcode) VALUES($1) RETURNING id;",[color_code]);
        await client.query("UPDATE product SET color=$1 WHERE id=$2",[colorId.rows[0].id,productId.rows[0].id]);
        //validate the the type,size
        if(image_type!=="jpeg"){
            res.send({success:false,message:"Image Format Is Unacceptable"});
            await client.query('ROLLBACK')
        }
        if(image_size>maxSize){
            res.send({success:false,message:"Image Size Is Unacceptable"});
            await client.query('ROLLBACK')
        }
        //create the object key
        let uuid=uuidv1();
        let objectKey=`product/${uuid}/${image_name}`;
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