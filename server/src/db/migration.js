import fs from "node:fs";
import path from "node:path";
import pool from "./connection.js";


let array=[];
let schema;
async function getTheFile(){
    const folderPath='Migrations/';
    fs.readdirSync(folderPath).map((fileName,index)=>{
        array.push(fileName);
        return path.join(folderPath,fileName);
    });

}
async function readTheSchema() {
    getTheFile();
    let path="Migrations/";
    let fullPath=path+'001_product.sql';
  fs.readFile(fullPath,"utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    schema=data;
    try {
        let result=await pool.query(schema);
        if(result){
            console.log("migration was successful");
        }else{
             console.log("migration was unsuccessful");
        }
    } catch (error) {
        console.log(error);
    }
  });
}
readTheSchema()
