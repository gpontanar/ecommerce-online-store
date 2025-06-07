import { Card, Button, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; //Added
import '../index.css';

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); //Added

    // Fetch featured products from the backend
    useEffect(() => {
        fetch( `${process.env.REACT_APP_API_BASE_URL}/products/active`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.slice(0, 4)); // 4 products lang to display in Feeatured Products
            })
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    return (
        <Row className="mt-5">
            {products.map(product => (
                <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title className="text-primary">{product.name}</Card.Title>
                            <Card.Text style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                {product.description}
                            </Card.Text>
                            <Card.Text className="text-orange fw-bold">
                                ₱{product.price}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            {/* <Button variant="primary" size="sm">
                                Details
                            </Button> */}
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate(`/product-details/${product._id}`)}
                            >
                                Details
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}