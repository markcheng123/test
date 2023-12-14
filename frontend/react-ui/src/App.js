import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./components/Home";
import ProductForm from "./components/ProductForm";
import Alert from "./components/Alert";
import {useState} from "react";

function App() {

  const [alert, setAlert] = useState({});

  const handleAlert = (type) => {
    setAlert(type
      ? {show: true, bg: type === 'deleted'? 'danger' : 'success', msg: `Product ${type} successfully!`}
      : {...alert, show: false});
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column position-relative app">
        <Alert alert={alert} onAlert={handleAlert}/>
        <Header />
        <div className="container-md flex-grow-1 content">
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="product/new" element={<ProductForm key="create" onAlert={handleAlert}/>} />
              <Route path="product/:id" element={<ProductForm key="update" onAlert={handleAlert}/>}/>
              <Route path="*" element={<Navigate to='/' />}/>
            </Route>
          </Routes>
          <Outlet />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
