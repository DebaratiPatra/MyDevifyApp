import mysql from "mysql";

export const db = mysql.createConnection({
    host:"localhost",
    user: "social_user",
    password: "Debar@ti1250", 
    port: 3304, 
    database:"mydevify_social"
}) 