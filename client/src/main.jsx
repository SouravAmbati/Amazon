import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BrowserRouter } from 'react-router-dom';
import { ProductProvider } from './contexts/ProductContext.jsx';
import { ToastContainer, toast } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <ToastContainer />
  <ProductProvider>
    <App />
  </ProductProvider>
  </BrowserRouter>,
)
