import { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [productName, setProductName] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500000);
    const [hasSearched, setHasSearched] = useState(false);

    const { user } = useContext(UserContext); // Access user context
    const navigate = useNavigate(); // Initialize navigate function

    // Fetch all products on page load
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
            .then(res => res.json())
            .then(data => {
                console.log('Fetched products:', data);
                setProducts(data);
            })
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    // Handle Search by Name
    const searchByName = () => {
        setHasSearched(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/search-by-name`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: productName })
        })
            .then(res => res.json())
            .then(data => setSearchResults(data))
            .catch(err => console.error('Error searching by name:', err));
    };

    // Handle Search by Price
    const searchByPrice = () => {
        setHasSearched(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/search-by-price`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: productName, minPrice, maxPrice })
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSearchResults(data);
                } else {
                    setSearchResults([]);
                }
            })
            .catch(err => {
                console.error('Error searching by price:', err);
                setSearchResults([]);
            });
    };

    // Handle Clear
    const clearSearch = () => {
        setProductName('');
        setMinPrice(0);
        setMaxPrice(500000);
        setSearchResults([]);
        setHasSearched(false);
    };

    return (
        <div className="mt-5">
            {/* Product Search Section */}
            <h2 className="text-center">Product Search</h2>
            <Row className="mb-4">
                <Col xs={12} className="mb-3">
                    <Form.Group>
                        <Form.Label>Product Name:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter product name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col xs={12} md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label>Minimum Price:</Form.Label>
                        <div className="d-flex align-items-center">
                            <Button
                                variant="secondary"
                                onClick={() => setMinPrice(Math.max(0, minPrice - 500))}
                            >
                                -
                            </Button>
                            <Form.Control
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                                className="mx-2"
                            />
                            <Button
                                variant="secondary"
                                onClick={() => setMinPrice(minPrice + 500)}
                            >
                                +
                            </Button>
                        </div>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label>Maximum Price:</Form.Label>
                        <div className="d-flex align-items-center">
                            <Button
                                variant="secondary"
                                onClick={() => setMaxPrice(Math.max(0, maxPrice - 500))}
                            >
                                -
                            </Button>
                            <Form.Control
                                type="number"
                                value={maxPrice}
                                onChange={(e) =>
                                    setMaxPrice(Math.min(500000, Number(e.target.value)))
                                }
                                className="mx-2"
                            />
                            <Button
                                variant="secondary"
                                onClick={() => setMaxPrice(Math.min(500000, maxPrice + 500))}
                            >
                                +
                            </Button>
                        </div>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-4 text-center">
                <Col>
                    <Button variant="primary" onClick={searchByName} className="mx-2">
                        Search by Name
                    </Button>
                    <Button variant="primary" onClick={searchByPrice} className="mx-2">
                        Search by Price
                    </Button>
                    <Button variant="danger" onClick={clearSearch} className="mx-2">
                        Clear
                    </Button>
                </Col>
            </Row>

            {/* Search Results */}
            <h3>Search Results:</h3>
            <Row>
                {Array.isArray(searchResults) && searchResults.length > 0 ? (
                    searchResults.map((product) => (
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
                    ))
                ) : (
                    hasSearched && (
                        <Col>
                            <p className="text-center text-muted">
                                No products found for the selected criteria.
                            </p>
                        </Col>
                    )
                )}
            </Row>

            <hr />

            {/* Product List Section */}
            <h2 className="text-center">Our Products</h2>
            <Row>
                {products.map((product) => (
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
        </div>
    );
}