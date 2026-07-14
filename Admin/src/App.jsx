import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProductsTable from "./Features/Products/Components/ProductsTable";
import CreateProduct from "./Features/Products/Components/CreateProduct";
import Orders from "./Features/OrdersPage/Orders";

const App = () => {
  const [activePage, setActivePage] = useState("products");
    return (
        <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
        >
            <Navbar />

            <main className="min-h-screen bg-gray-50">
                {activePage === "products" && <ProductsTable />}

                {activePage === "create-product" && <CreateProduct />}

                {/* {activePage === "out-of-stock" && <OutOfStock />} */}

                {activePage === "orders" && <Orders />}
            </main>
        </Sidebar>
    );
};

export default App;