import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'sweetalert2/dist/sweetalert2.min.css';
import "./index.css"

import App from './App.jsx'
import axios from "axios";
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
<StrictMode>
    <App />
</StrictMode>
)

