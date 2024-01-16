
import { client } from "./index.js";
import { ObjectId } from "mongodb";

export async function getUserByName(Email) {
    return await client.db("Password-reset").collection("Users").findOne({ Email: Email });
}

export async function getUserById(id) {
    return await client.db("Password-reset").collection("Users").findOne({ _id: new ObjectId(id) });
}

export async function createUser(data) {
    return await client.db("Password-reset").collection("Users").insertOne(data);
}

export async function getUserByEmail(Email) {
    return await client.db("Password-reset").collection("Users").findOne({ Email: Email });
}