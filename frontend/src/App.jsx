import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hello from "./pages/Hello";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useEffect } from "react";

function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Hello/> } />
                <Route path="/register" element={ <Register/> } />
                <Route path="/login" element={ <Login/> } />
                <Route path="/home" element={ <Home/> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App;