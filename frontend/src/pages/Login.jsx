import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Login(){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setLogin(localStorage.getItem("Llogin"))
        setPassword(localStorage.getItem("Lpassword"))
    }, [])

    function handleLoginChange(e){
        setLogin(e.target.value);
        localStorage.setItem("Llogin", e.target.value);
    }

    function handlePasswordChange(e){
        setPassword(e.target.value);
        localStorage.setItem("Lpassword", e.target.value);
    }

    function handleLogninBtn(){
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                login: login,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Logged in"){
                localStorage.clear()
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", login);
                window.location.href = "/";
            } else {
                alert("Błędny login lub hasło");
            }
        })
    }

    return (
        <div id="container">
            <div id="gradient"></div>
            <div id="form">
                <Typography variant="h2">Logowanie</Typography>
                <TextField onChange={(e) => handleLoginChange(e)} label="Login" variant="outlined" value={localStorage.getItem("Llogin")}/>
                <TextField onChange={(e) => handlePasswordChange(e)} label="Password" type='password' variant="outlined" value={localStorage.getItem("Lpassword")}/>
                <Button onClick={() => handleLogninBtn()} variant="contained">Zaloguj</Button>
            </div>
        </div>
    )
}

export default Login;