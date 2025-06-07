import { useState, useEffect } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [expandAll, setExpandAll] = useState(false); // State to toggle "View All / Close All"

    useEffect(() => {
        // Show loading modal
        Swal.fire({
            title: 'Loading Order History...',
            text: 'Please wait while we fetch your order history.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(res => res.json())
            .then(async data => {
                if (data.orders) {
                    const ordersWithProductDetails = await Promise.all(
                        data.orders.map(async order => {
                            const productsWithDetails = await Promise.all(
                                order.productsOrdered.map(async product => {
                                    try {
                                        const productDetails = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${product.productId}`)
                                            .then(res => {
                                                if (!res.ok) {
                                                    throw new Error(`Failed to fetch product ${product.productId}`);
                                                }
                                                return res.json();
                                            });
                                        return {
                                            ...product,
                                            name: productDetails.name || 'Unknown Product',
                                        };
                                    } catch (err) {
                                        console.error(`Error fetching product ${product.productId}:`, err);
                                        return {
                                            ...product,
                                            name: 'Unknown Product',
                                        };
                                    }
                                })
                            );
                            return {
                                ...order,
                                productsOrdered: productsWithDetails,
                            };
                        })
                    );
                    setOrders(ordersWithProductDetails);

                    // Calculate the total price for all orders
                    const total = ordersWithProductDetails.reduce((sum, order) => sum + order.totalPrice, 0);
                    setTotalPrice(total);
                } else {
                    console.error('Failed to fetch orders.');
                }
            })
            .catch(err => {
                console.error('Error fetching orders:', err);
            })
            .finally(() => {
                // Close loading modal
                Swal.close();
            });
    }, []);

    const toggleExpandAll = () => {
        setExpandAll(!expandAll); // Toggle the expand and or collapse state
    };

    return (
        <div className="mt-5">
            <h1
                className="text-center py-2"
                style={{
                    backgroundColor: 'black',
                    color: 'white',
                    fontWeight: 'bold',
                }}
            >
                Your Order History
            </h1>
            <div className="text-center mb-3">
                <Button
                    style={{
                        backgroundColor: 'darkblue',
                        color: 'white',
                        borderColor: 'darkblue',
                    }}
                    onMouseEnter={e => (e.target.style.backgroundColor = 'blue')}
                    onMouseLeave={e => (e.target.style.backgroundColor = 'darkblue')}
                    onClick={toggleExpandAll}
                >
                    {expandAll ? 'Close All' : 'View All'}
                </Button>
            </div>
            <Accordion activeKey={expandAll ? orders.map((_, index) => index.toString()) : undefined}>
                {orders.map((order, index) => (
                    <Accordion.Item key={order._id} eventKey={index.toString()}>
                        <Accordion.Header style={{ backgroundColor: 'darkblue', color: 'white', cursor: 'pointer' }}>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <span>Order #{index + 1}</span>
                                <span>Purchased on: {new Date(order.orderedOn).toLocaleString()}</span>
                                <span>Click to view Details</span>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <Card.Body>
                                <h5>Order ID: {order._id}</h5>
                                <p><strong>Items:</strong></p>
                                <ul>
                                    {order.productsOrdered.map(product => (
                                        <li key={product.productId}>
                                            <strong>Product:</strong> {product.name} <br />
                                            <strong>Quantity:</strong> {product.quantity} <br />
                                            <strong>Subtotal:</strong> ₱{product.subtotal}
                                            <hr style={{ margin: '10px 0' }} /> {/* Horizontal line below the Subtotal par ma kita per product orders */}
                                        </li>
                                    ))}
                                </ul>
                                {/* <p><strong>Order Status:</strong> {order.status}</p> */}
                            </Card.Body>
                        </Accordion.Body>
                        <Card.Footer style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                            <p className="fw-bold">
                                <strong>Total Price:</strong> <span style={{ color: 'orange' }}>₱{order.totalPrice}</span>
                            </p>
                        </Card.Footer>
                    </Accordion.Item>
                ))}
            </Accordion>
            <h4 className="text-end mt-4 fw-bold">Total Spent: ₱{totalPrice}</h4>
        </div>
    );
}