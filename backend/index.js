import express from "express"
import jwt from "jsonwebtoken"
import { addUser, getUser, addProduct, getProducts } from "./dbHandler.js"
import * as dotenv from "dotenv"
import bcrypt from "bcrypt"
import cors from "cors"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors());


function middleVerify(req, res, next) {
    const token = req.header('Authorization');
    if (!token) { return res.status(403).json({err: "invalid token"}) }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({err: "bad token"})
        }
        req.user = user;
        next();
    });
}

app.post("/verify", middleVerify, (req, res) => {
    res.status(200).json({ message: "Token is valid" })
})

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello on 'swiatecznewydatki' api. Try go to '/register' for register \
    or '/login' for login. It returns JWT" })
})

app.post("/register", (req, res) => {
    const { login, password, email } = req.body
    if (login && password && email) {
        getUser(login).then((data) => {
            if (data.message) {
                const salt = bcrypt.genSaltSync(10)
                const hashedPassword = bcrypt.hashSync(`${password}${process.env.PWD_PEPPER}`, salt)
                addUser(login, `${hashedPassword}`, email).then((data) => {
                    res.status(200).json({ message: "User created" })
                })
            } else {
                res.status(400).json({ message: "User already exist" })
            }
        })
    } else {
        res.status(400).json({ message: "Bad request (Remember that the JSON should contain 'username', 'password', and 'email')" })
    }
})

app.post("/login", (req, res) => {
    const { login, password } = req.body
    if (login && password) {
        getUser(login).then(data => {
            if(data.message) {
                res.status(400).json({ message: "User not found" })
            }
            else {
                const isPasswordMatch = bcrypt.compareSync(`${password}${process.env.PWD_PEPPER}`, data.password)
                if(!isPasswordMatch){ res.status(400).json({ message: "Wrong password" }) }
                else {
                    const token = jwt.sign({ id: data.id_user, login: data.login }, process.env.JWT_SECRET, { expiresIn: "5h" })
                    res.status(200).json({ message: "Logged in", username: data.login, token: token })
                }
            }
        })
    }
    else {
        res.status(400).json({ message: "Bad request (Remember that the JSON should contain 'username', 'password', and 'email')" })
    }
})

app.post("/addProduct", middleVerify, (req, res) => {
    const userData = {...req.user, ...req.body}
    if(!userData.prodName || !userData.prodCost || !userData.howMany || !userData.id) { res.status(400).json({ message: "Bad request" }) }
    addProduct(userData.prodName, userData.prodCost, userData.howMany, userData.id)
        .then(data => {
            if(data.message) { res.status(200).json({ message: "Product added" }) }
            else { res.status(400).json({ message: "Product not added" }) }
        })
})

app.get("/getProducts", middleVerify, (req, res) => {
    const userId = req.user.id
    getProducts(userId)
        .then(data => {
            res.status(200).json(data)
        })
})

app.listen(3000, () => {
  console.log("http://localhost:3000/")
})