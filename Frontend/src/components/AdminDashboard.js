import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EditProduct from "./EditProduct";
import ArchiveProduct from "./ArchiveProduct";

export default function AdminDashboard({ fetchData }) {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

   useEffect(() => {
    const loadProducts = async () => {
        try {
            const data = await fetchData();
            console.log("Fetched Data:", data); // Debugging log

            if (Array.isArray(data)) {
                setProducts([...data]); // Ensure a new reference
            } else {
                console.error("Expected an array but received:", data);
                setProducts([]); // Prevent undefined state
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setProducts([]);
        }
    };

    loadProducts();
}, [fetchData]); // Ensure effect runs when fetchData changes


    useEffect(() => {
        console.log("Products state updated:", products); // Debugging log
    }, [products]); // Ensure we see when products updates

    return (
        <>
            <h1 className="text-center my-2">Admin Dashboard</h1>
            
            <div className="d-flex justify-content-center mb-3">
                <Button variant="danger" className="mx-2" onClick={() => navigate('/addproduct')}>
                    Add Product
                </Button>
                <Button variant="success" className="mx-2" onClick={() => navigate('/user-orders')}>
                    Orders
                </Button>
            </div>
            
            {products.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr className="text-center">
                           {/* <th>ID</th>*/}
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Availability</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                               {/* <td>{product._id}</td>*/}
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td className={product.isActive ? "text-success" : "text-danger"}>
                                    {product.isActive ? "Available" : "Unavailable"}
                                </td>
                                <td>
                                    <EditProduct product={product} fetchData={fetchData} setProducts={setProducts} />
                                   <ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData} setProducts={setProducts} />

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p className="text-center">No products available.</p>
            )}
        </>
    );
}
