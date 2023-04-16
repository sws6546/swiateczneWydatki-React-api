import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./Register.css"

import { useEffect, useState } from 'react';

function register() {
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const handleLoginChange = (event) => { 
        setLogin(event.target.value) 
        localStorage.setItem("login", event.target.value);
    }
    const handleEmailChange = (event) => { setEmail(event.target.value); localStorage.setItem("email", event.target.value); }
    const handlePasswordChange = (event) => { setPassword(event.target.value); localStorage.setItem("password", event.target.value); }
    const handleRepeatPasswordChange = (event) => { setRepeatPassword(event.target.value); localStorage.setItem("repeatPassword", event.target.value) }

    useEffect(() => {
        setLogin(localStorage.getItem("login"))
        setEmail(localStorage.getItem("email"))
        setPassword(localStorage.getItem("password"))
        setRepeatPassword(localStorage.getItem("repeatPassword"))
    }, [])

    const handleRegister = () => {
        let ok = true;
        if (login.length < 3) {
            alert("Login musi mieć co najmniej 3 znaki");
            ok = false;
        }
        let mailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!mailPattern.test(email)) {
            alert("Niepoprawny adres e-mail");
            ok = false;
        }
        if (password.length < 8) {
            alert("Hasło musi mieć co najmniej 8 znaków");
            ok = false;
        }
        if (password !== repeatPassword) {
            alert("Hasła nie są identyczne");
            ok = false;
        } 

        if (ok) {
            fetch("http://localhost:3000/register", {
                method: "POST",
                // mode: 'no-cors',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login: login,
                    email: email,
                    password: password
                })
            }).then((response) => {
                if (response.status === 200) {
                    alert("Udało się zarejestrować");
                    window.location.href = "http://localhost:5173";
                } else {
                    alert("Nie udało się zarejestrować, taki użytkownik już istnieje");
                }
            })
        }
    }

    return (
        <div id="container">
            <div id="gradient"></div>
            <div id="form">
                <Typography variant="h2">Rejestracja</Typography>
                <TextField onChange={(e) => handleLoginChange(e)} label="Login" variant="outlined" value={localStorage.getItem("login")}/>
                <TextField onChange={(e) => handleEmailChange(e)} label="E-mail" variant="outlined" value={localStorage.getItem("email")}/>
                <TextField onChange={(e) => handlePasswordChange(e)} label="Password" type='password' variant="outlined" value={localStorage.getItem("password")}/>
                <TextField onChange={(e) => handleRepeatPasswordChange(e)} label="Repeat Password" type='password' variant="outlined" value={localStorage.getItem("repeatPassword")}/>
                <Button onClick={handleRegister} variant="contained">Zarejestruj</Button>
            </div>
        </div>
    )
}

export default register