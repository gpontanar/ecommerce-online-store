import { useEffect, useState, useContext } from "react";
import { Accordion, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Swal from "sweetalert2";

export default function UserOrders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productMap, setProductMap] = useState({});
  const navigate = useNavigate();

  // Fetch orders and product details when the component mounts
  useEffect(() => {
    if (!user || !user.isAdmin) {
      setLoading(false);
      return;
    }

    const fetchOrdersAndProducts = async () => {
      try {
        const token = user.token || localStorage.getItem("token");
        
        // Fetch orders
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders);

        // Extract product IDs
        const uniqueProductIds = [
          ...new Set(
            data.orders.flatMap(order =>
              order.productsOrdered.map(product => product.productId)
            )
          ),
        ];

        // Fetch product names
        const productFetches = uniqueProductIds.map(id =>
          fetch(`http://ec2-18-217-117-56.us-east-2.compute.amazonaws.com/b5/products/${id}`)
            .then(res => res.json())
            .catch(() => ({ _id: id, name: "Unknown Product" }))
        );

        const products = await Promise.all(productFetches);
        const productIdToNameMap = products.reduce((map, product) => {
          map[product._id] = product.name;
          return map;
        }, {});

        setProductMap(productIdToNameMap);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndProducts();
  }, [user]);

  // Show SweetAlert2 loading spinner
  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Loading...",
        text: "Fetching orders and product details.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    } else {
      Swal.close();
    }
  }, [loading]);

  // If the user doesn't have access or there was an error
  if (!user || !user.isAdmin) {
    return <Alert variant="danger">ACCESS DENIED: You do not have permission to view this page.</Alert>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">User Orders</h2>

      <div className="text-center my-3">
        <Button variant="danger" onClick={() => navigate("/product")}>
          Back to Admin Dashboard
        </Button>
      </div>

      <Accordion>
        {orders.map((order, index) => (
          <Accordion.Item eventKey={index.toString()} key={order._id}>
            <Accordion.Header>Order ID: {order._id}</Accordion.Header>
            <Accordion.Body>
              <p><strong>User ID:</strong> {order.userId}</p>
              <p><strong>Purchased On:</strong> {new Date(order.orderedOn).toLocaleString()}</p>

              <h5>Products Ordered:</h5>
              <ul>
                {order.productsOrdered.map((product) => (
                  <li key={product._id}>
                    <strong>Product Name:</strong> {productMap[product.productId] || "Product Not Available"} |{" "}
                    <strong>Quantity:</strong> {product.quantity} |{" "}
                    <strong>Subtotal:</strong> Php{product.subtotal}
                  </li>
                ))}
              </ul>

              <h4>
                <span style={{ color: "orange", fontWeight: "bold" }}>Total Price:</span>{" "}
                <span style={{ fontWeight: "bold" }}>Php {order.totalPrice}</span>
              </h4>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
