import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Form, Card } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function ProductDetails() {
    const { id } = useParams(); // Get product ID from URL
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const notyf = new Notyf();

    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Fetch product details by ID
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error('Error fetching product details:', err));
    }, [id]);

    const handleQuantityChange = (e) => {
        const value = Math.max(1, Number(e.target.value)); // Ensure minimum value is 1
        setQuantity(value);
    };

    const addToCart = () => {
        const subtotal = product.price * quantity;

        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                productId: product._id,
                quantity,
                subtotal,
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.updatedCart) {
                    notyf.success('Product added to cart!');
                } else {
                    notyf.error('Failed to add product to cart.');
                }
            })
            .catch(err => {
                console.error('Error adding to cart:', err);
                notyf.error('Error adding to cart.');
            });
    };

    return (
        <Row className="mt-5 justify-content-center">
            <Col xs={12} md={8} lg={6}>
                <Card className="p-4 shadow">
                    <Card.Header className="bg-dark text-white text-center">
                        <h2>{product.name}</h2>
                    </Card.Header>
                    <Card.Body>
                        <p className="text-left">{product.description}</p>
                        <h4 className="text-orange text-left">Price: ₱{product.price}</h4>

                        <Form.Group className="my-3">
                            <Form.Label className="fw-bold text-left">Quantity:</Form.Label>
                            <div className="d-flex align-items-center">
                                <Button
                                    variant="secondary"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </Button>
                                <Form.Control
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="mx-2 text-center"
                                    style={{ width: '80px' }}
                                />
                                <Button
                                    variant="secondary"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </Button>
                            </div>
                        </Form.Group>
                        
                        {user.id ? (
                            user.isAdmin ? (
                                <Button variant="secondary" className="w-100" disabled>
                                    Admins cannot add to cart
                                </Button>
                            ) : (
                                <Button variant="primary" className="w-100" onClick={addToCart}>
                                    Add to Cart
                                </Button>
                            )
                        ) : (
                            <Button
                                className="login-to-cart-btn w-100 text-white mt-3"
                                onClick={() => navigate('/login')}
                            >
                                Log in to Add to Cart
                            </Button>
                        )}

                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}