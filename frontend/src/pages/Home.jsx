import "./Home.css"
import { useEffect, useState } from "react";

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Home(){
    const [products, setProducts] = useState([]);
    const [cost, setCost] = useState(0);

    const [prodName, setProdName] = useState("");
    const [prodCost, setProdCost] = useState(0);
    const [prodAmount, setProdAmount] = useState(1);

    function handleLogoutBtn(){
        localStorage.clear();
        window.location.href = "/";
    }

    function getProducts(){
        fetch("http://localhost:3000/getProducts", {
            method: "GET",
            headers: {
                Authorization: `${localStorage.getItem("token")}`
            }
        }).then(res => res.json())
        .then(data => {
            setProducts(data);
        })
    }

    useEffect(() => {
        if (!localStorage.getItem("token")){
            window.location.href = "/";
        }
        
        getProducts();
    }, [])

    useEffect(() => {
        let sum = 0;
        products.forEach(product => {
            sum += product.productCost * product.howMany_product;
        })
        setCost(sum);
    }, [products])

    function addProduct(){
        let ok = true;
        if (prodName === ""){
            ok = false;
            alert("Podaj nazwę produktu")
        }
        if (prodCost === 0){
            ok = false;
            alert("Podaj cenę produktu")
        }

        if(ok == true){
            fetch("http://localhost:3000/addProduct/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    "prodName": prodName,
                    "prodCost": prodCost,
                    "howMany": prodAmount
                })
            }).then((data) => data.json())
            .then((data) => {
                if(data.message === "Product added"){
                    getProducts();
                }
            })
        }
    }

    return(
        <div id="container">
            <div id="gradient"></div>
            <h1 id="welcomeU">Witaj {localStorage.getItem("username")}</h1>
            <Button variant="contained" id="logoutBtn" onClick={() => {handleLogoutBtn()}}>Wyloguj</Button>
            
            <div id="addProdForm">
                <Typography variant="h4">Dodaj produkt</Typography>
                <div class="rows">
                    <TextField onChange={(e) => {setProdName(e.target.value)}} label="nazwa produktu" variant="outlined"/>
                    <TextField onChange={(e) => {setProdCost(e.target.value)}} label="cena produktu" type="number" variant="outlined"/>
                    <TextField onChange={(e) => {setProdAmount(e.target.value)}} label="ilość produktu (domyślnie 1)" type="number" variant="outlined"/>
                </div>
                <Button variant="contained" onClick={() => {addProduct()}}>Dodaj produkt</Button>
            </div>
            
            <div id="panel">
                <div id="sumCost"><Typography variant="h4">Łączna suma: {cost}zł</Typography></div>
                <div id="prodContainer">
                    {products.map((product, index) => {
                        return (
                            <div className="product" key={index}>
                                <h2 className="name">{product.product_name}</h2>
                                <h2 className="cost">{product.productCost}zł</h2>
                                <h2 className="amount">Liczba: {product.howMany_product}</h2>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Home;