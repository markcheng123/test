import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./components/Home";
import ProductForm from "./components/ProductForm";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column app">
        <Header />
        <div className="flex-grow-1 content">
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="product/new" element={<ProductForm key="create" />} />
              <Route path="product/:id" element={<ProductForm key="update" />}/>
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
