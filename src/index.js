import React from 'react';
import ReactDOM from 'react-dom/client';
import "./css/common.css"
import "./public/css/style.css"
import App from "./App.jsx"



const container = document.getElementById("root")
const root = ReactDOM.createRoot(container)

root.render(
    // <React.StrictMode>
        <App />
    // </React.StrictMode>
);