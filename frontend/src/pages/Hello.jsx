import "./Hello.css"
import Button from '@mui/material/Button';
import { useEffect } from 'react';

function Hello () {
    useEffect(() => {
        if(localStorage.getItem("token")){
            fetch("http://localhost:3000/verify", {
                method: "POST",
                headers: {
                    Authorization: `${localStorage.getItem("token")}`
                }
            }).then(response => {
                if (response.status === 200){
                    window.location.href = "/home";
                }else{
                    localStorage.removeItem("token");
                }
            })
        }
    }, [])

    return (
        <div id='contener'>
            <div id="gradient"></div>
            <h1>Zliczamy wydatki wielkanocne!</h1>
            <h2>Śledź ile wydajesz na świąteczne przygotowania</h2>
            <div id="buttonContainer">
                <a href="/register"><Button variant="contained">Zarejestruj</Button></a>
                <a href="/login"><Button variant="contained">Zaloguj</Button></a>
            </div>
        </div>
    )
}

export default Hello;