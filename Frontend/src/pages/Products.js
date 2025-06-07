import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import ProductList from "../components/ProductList";
import AdminDashboard from "../components/AdminDashboard";
import { fetchData } from "../components/FetchData";

export default function Products() {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);

//     useEffect(() => {
//         async function loadData() {
//             const data = await fetchData();
//             setProducts(data);
//         }
//         loadData();
//     }, []);

//     if (!user) {
//         return <p className="text-center">Please log in to view products.</p>;
//     }

//     return user.isAdmin ? <AdminDashboard fetchData={fetchData} setProducts={setProducts} /> : <ProductList products={products} />;
// }
useEffect(() => {
    if (user) {
        // Fetch data only if the user is logged in
        async function loadData() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        loadData();
    }
}, [user]);

if (!user) {
    return <p className="text-center">Please log in to view products.</p>;
}

return user.isAdmin ? (
    <AdminDashboard fetchData={fetchData} setProducts={setProducts} />
) : (
    <ProductList products={products} />
);
}
