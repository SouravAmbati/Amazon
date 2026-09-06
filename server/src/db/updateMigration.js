import readline from "readline";
import fs from "node:fs";
import path from "node:path";
import pool from "./connection.js";

let array = [];
let schema;
let migrationNumber;
function readFromCommand() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Give Migration Number: ", (name) => {
    migrationNumber=name;
    readTheSchema();
    rl.close();
  });
}
async function getTheFile() {
  const folderPath = "UpdateMigrations/";
  fs.readdirSync(folderPath).map((fileName, index) => {
    if (fileName.startsWith(migrationNumber)) {
        console.log(fileName);
      array.push(fileName);
      return path.join(folderPath, fileName);
    }
  });
}
async function readTheSchema() {
  getTheFile();
  let path = `UpdateMigrations/`;
  let fullPath = path + array.pop();
  fs.readFile(fullPath, "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    schema = data;
    console.log(schema);
    try {
      let result = await pool.query(schema);
      if (result) {
        console.log("migration was successful");
        process.exit(0);
      } else {
        console.log("migration was unsuccessful");
        process.exit(0);
      }
    } catch (error) {
      console.log(error);
    }
  });
}
readFromCommand();
