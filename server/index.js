import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import randomstring from "randomstring";
import { MongoClient, ObjectId } from "mongodb";
import { createUser, getUserByName, getUserByEmail, getUserById } from "./helper.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

const MONGO_URL = process.env.MONGO_URL;
async function createConnection() {
    try {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        console.log("MongoDB is connected ");
        return client;
    } catch (error) {
        console.error('MongoDB connection Error:', error);
        throw error;
    }
}

export const client = await createConnection();

app.listen(PORT, () => console.log("Server is running in port:", PORT));

export async function generateHashedPassword(password) {
    const NO_OF_ROUNDS = 10;
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

app.get("/", function (req, res) {
    res.send("Password Reset Flow");
});

app.post("/signup", async function (request, response) {
    const { FirstName, LastName, Email, Password } = request.body;
    const userFromDB = await getUserByName(Email);

    if (userFromDB) {
        response.status(400).send({ message: "User already exists" });
    } else {
        const hashedPassword = await generateHashedPassword(Password);
        const result = await createUser({
            FirstName: FirstName,
            LastName: LastName,
            Email: Email,
            Password: hashedPassword,
        });
        console.log(result)
        response.send({ message: "successful Signup" });
    }
});

app.post("/login", async function (request, response) {
    const { Email, Password } = request.body;
    const userFromDB = await getUserByName(Email);

    if (!userFromDB) {
        response.status(400).send({ message: "Invalid Credential" });
        return;
    } else {
        const storedPassword = userFromDB.Password;
        const isPasswordMatch = await bcrypt.compare(Password, storedPassword);
        if (isPasswordMatch) {

            const secret = process.env.SECRET_KEY;
            const payload = {
                Email: Email,
            };

            let token = jwt.sign(payload, secret, { expiresIn: "1h" });
            let userData = {
                id: userFromDB._id,
                FirstName: userFromDB.FirstName,
                LastName: userFromDB.LastName,
                Email: userFromDB.Email,
            }
            response.status(200).send({ code: 0, message: 'ok', data: token, user: userData });
        } else {
            response.status(400).send({ message: "Invalid Credential" });
            return;
        }
    }
});

app.post("/forgetPassword", async function (request, response) {
    const { Email } = request.body;
    const userFromDB = await getUserByEmail(Email);

    if (!userFromDB) {
        return response.status(400).json({ message: "This is not a registered E-mail" });
    }

    const randomString = randomstring.generate();
    const linkForUser = `${process.env.FRONTEND_URL}/reset-password/${userFromDB._id}/${randomString}`;

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.USER_NAME,
        to: Email,
        subject: "Reset Password",
        html: `<div class="container">
              <h1>Password Reset</h1>
              <p>Hi ${userFromDB.FirstName},</p>
              <p>We received a request to reset your password. If you didn't make this request, you can ignore this email. No changes will be made to your account.</p>
              <p>To reset your password, click the button below:</p>
              <a class="button" href="${linkForUser}">Reset Password</a>
              <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
              <p>${linkForUser}</p>
              <div class="footer">
                <p>Best regards,<br>Password Recovery system</p>
              </div>
            </div>`,
    };

    try {
        await transporter.sendMail(mailOptions)
        const expiresin = new Date();
        expiresin.setHours(expiresin.getHours() + 1);
        await client
            .db("Password-reset")
            .collection("Users")
            .findOneAndUpdate(
                { Email: Email },
                {
                    $set: {
                        resetPasswordToken: randomString,
                        resetPasswordExpires: expiresin,
                    },
                }
            );

        return response.json({ message: "User exists and password reset mail is sent" });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Error sending email" });
    }
});

app.post("/verifyToken", async function (request, response) {
    const { id, token } = request.body;
    const userFromDB = await getUserById(id);
    const currTime = Date.now();

    try {
        if (currTime <= userFromDB.resetPasswordExpires) {
            if (token === userFromDB.resetPasswordToken) {
                return response.json({ message: "Changing Password Approved" });
            } else {
                return response.status(400).json({ message: "Invalid Token" });
            }
        } else {
            return response.status(400).json({ message: "Token Expired" });
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Something went wrong!" });
    }
});

app.put("/changePassword", async function (request, response) {
    const { Password, id } = request.body;

    try {
        const hashedPassword = await generateHashedPassword(Password);
        await client
            .db("Password-reset")
            .collection("Users")
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { Password: hashedPassword } }
            );

        return response.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Unexpected error in password updation" });
    }
});
