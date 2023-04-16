import sqlite3 from "sqlite3"

const db = new sqlite3.Database("database.db", (err) => { if (err) {console.error(err.message)} })

async function createDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id_user INTEGER PRIMARY KEY AUTOINCREMENT,
            login TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            email TEXT NOT NULL
    )`, (err) => { if (err) {console.error(err.message)} })
    
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id_producy INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            productCost INTEGER NOT NULL,
            howMany_product INTEGER NOT NULL,
            id_user INTEGER NOT NULL
    )`, (err) => { if (err) {console.error(err.message)} })
}

export function addUser(username, password, email) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (login, password, email) VALUES (?, ?, ?)`, [username, password, email], (err) => {
            if (err) { resolve (err) }
            else { resolve({message: "User created"}) }
        })
    })
}

export async function getUser(username) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE login = ?`, [username],  (err, row) => {
            if (err) {console.error(err.message)} 
            else {
                if(row) {
                    resolve(row)
                }
                else { resolve({message: "User not found"}) }
            }
        })
    })
}

export async function addProduct(productName, productCost, howManyProduct, idUser) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO products (product_name, productCost, howMany_product, id_user) VALUES (?, ?, ?, ?)`, [productName, productCost, howManyProduct, idUser], (err) => {
            if (err) { resolve (err) }
            else { resolve({message: "Product added", about: [productName, productCost, howManyProduct, idUser]}) }
        })
    })
}

export async function getProducts(idUser) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT * FROM products WHERE id_user = ?`, [idUser], (err, rows) => {
                if (err) {console.error(err.message)} 
                else {
                    if(rows) {
                        resolve(rows)
                    }
                }
            })
        })
}

// getProducts(1).then(data => console.log(data))
// addProduct("testProduct", 10.99, 10, 1).then(data => console.log(data))
// addUser("testuser", "testpassword", "testemail").then(data => console.log(data))
// getUser("test2").then((data) => {console.log(data)})
// createDatabase()