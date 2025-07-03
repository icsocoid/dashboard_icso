import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/index.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
            <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
    </React.StrictMode>
);
