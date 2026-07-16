import argon2 from "argon2";

async function hashPassword(password){
    const hash=await argon2.hash(password);
    return hash;
}

async function verifyPassword(password,passwordHash){
    //we pass raw password+stored hash
    return await argon2.verify(passwordHash,password);
}

export{hashPassword,verifyPassword};