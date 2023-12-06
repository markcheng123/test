import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./components/Home";
import ProductForm from "./components/ProductForm";
import NewProduct from "./components/NewProduct";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column app">
        <Header />
        <div className="flex-grow-1 content">
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route key="create" path="product/new" element={<NewProduct />} />
              <Route key="update" path="product/:id" element={<ProductForm />}/>
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
