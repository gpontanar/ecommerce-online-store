import { useState, useEffect, useContext } from 'react';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Cart() {
    const { user } = useContext(UserContext);
    const notyf = new Notyf();
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [products, setProducts] = useState({}); // Store product details by productId

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Show the loading notification when the component is mounted
        Swal.fire({
            title: 'Loading cart, please wait...',
            html: '<i class="fas fa-shopping-cart fa-2x"></i>', // Cart loading icon
            allowOutsideClick: false, // Prevent closing by clicking outside
            showConfirmButton: false, // Hide the confirm button
            didOpen: () => {
                Swal.showLoading(); // Show the loading spinner
            },
        });

        // Fetch the cart for the logged-in user
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.cart) {
                    setCart(data.cart);
                    fetchProductDetails(data.cart.cartItems); // Fetch product details
                } else {
                    notyf.error('Failed to load cart.');
                }
            })
            .catch(err => {
                console.error('Error fetching cart:', err);
                notyf.error('Error fetching cart.');
            })
            .finally(() => {
                Swal.close(); // Close the loading notification once the fetch is complete
            });
    }, []);

    const fetchProductDetails = (cartItems) => {
        const productIds = cartItems.map(item => item.productId);
        Promise.all(
            productIds.map(productId =>
                // fetch(`${process.env.REACT_APP_API_URL}/products/active/${productId}`)
                fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`Failed to fetch product ${productId}`);
                        }
                        return res.json();
                    })
                    .then(product => ({ productId, product }))
                    .catch(err => {
                        console.error(`Error fetching product ${productId}:`, err);
                        return null;
                    })
            )
        ).then(results => {
            const productMap = {};
            results.forEach(result => {
                if (result) {
                    productMap[result.productId] = result.product;
                }
            });
            setProducts(productMap); // Store product details in state
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to remove this product from your cart?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, remove it!',
                cancelButtonText: 'Cancel',
                customClass: {
                    confirmButton: 'btn btn-danger',
                    cancelButton: 'btn btn-primary',
                    actions: 'swal2-buttons-spacing',
                },
                buttonsStyling: false,
            }).then(result => {
                if (result.isConfirmed) {
                    removeFromCart(productId);
                }
            });
        } else {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ productId, newQuantity }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.updatedCart) {
                        setCart(data.updatedCart);
                        Swal.fire({
                            title: 'Product Quantity now updated',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });
                    } else {
                        notyf.error('Failed to update quantity.');
                    }
                })
                .catch(err => {
                    console.error('Error updating quantity:', err);
                    notyf.error('Error updating quantity.');
                });
        }
    };

    const removeFromCart = (productId) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.updatedCart) {
                    setCart(data.updatedCart);
                    notyf.success('Product removed from cart.');
                } else {
                    notyf.error('Failed to remove product from cart.');
                }
            })
            .catch(err => {
                console.error('Error removing product from cart:', err);
                notyf.error('Error removing product from cart.');
            });
    };

    const checkout = () => {
        Swal.fire({
            title: 'Confirm Payment',
            text: 'Do you want to proceed with the payment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Confirm Payment.',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-primary',
                actions: 'swal2-buttons-spacing',
            },
            buttonsStyling: false,
        }).then(result => {
            if (result.isConfirmed) {
                setIsLoading(true); // Set loading state
                fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status}`);
                        }
                        return res.json();
                    })
                    .then(data => {
                        if (data.message === 'Ordered Successfully') {
                            setCart(null); // Clear the cart state
                            notyf.success('Ordered Successfully');
                            navigate('/orders'); // Navigate to the Orders page
                        } else {
                            notyf.error('Failed to checkout.');
                        }
                    })
                    .catch(err => {
                        console.error('Error during checkout:', err);
                        notyf.error('Error during checkout.');
                    })
                    .finally(() => {
                        setIsLoading(false); // Reset loading state
                    });
            }
        });
    };

    const clearCart = () => {
        Swal.fire({
            title: 'Empty cart',
            text: 'Do you want to empty your cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Empty my cart!',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-primary',
                actions: 'swal2-buttons-spacing',
            },
            buttonsStyling: false,
        }).then(result => {
            if (result.isConfirmed) {
                setIsLoading(true); // Set loading state
                fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(res => {
                        console.log('Response:', res); // Debugging log
                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status}`);
                        }
                        return res.json();
                    })
                    .then(data => {
                        console.log('Clear Cart Response:', data); // Debugging log
                        if (data.message === 'Cart cleared successfully.') {
                            setCart(null); // Reset the cart state to trigger a re-render
                            setCart(data.updatedCart); // Update the cart state with the cleared cart
                            notyf.success('Cart has been cleared successfully.');
                        } else {
                            notyf.error('Failed to clear cart.');
                        }
                    })
                    .catch(err => {
                        console.error('Error clearing cart:', err);
                        notyf.error('Error clearing cart.');
                    })
                    .finally(() => {
                        setIsLoading(false); // Reset loading state
                    });
            }
        });
    };
    
    if (!cart || cart.cartItems.length === 0) {
        return (
            <div className="text-center mt-5">
                <h1 className="text-muted">Your Cart is Empty</h1>
                <Button
                    className="mt-3"
                    style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        borderColor: 'blue',
                    }}
                    onMouseEnter={e => (e.target.style.backgroundColor = 'red')}
                    onMouseLeave={e => (e.target.style.backgroundColor = 'blue')}
                    onClick={() => navigate('/product')}
                >
                    Shop Now
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-5">
            <h2
                className="text-center py-2"
                style={{
                    backgroundColor: 'black',
                    color: 'white',
                    fontWeight: 'bold',
                }}
            >
                Your Cart
            </h2>
            <Row>
                {cart.cartItems.map(item => {
                    const product = products[item.productId];
                    return (
                        <Col key={item._id} xs={12} md={6} lg={4} className="mb-4">
                            <Card className="h-100">
                            <Card.Body>
                                <Card.Title>{product ? product.name : 'Loading...'}</Card.Title>
                                <div className="mb-3">
                                    <strong>Quantity:</strong>
                                    <div className="d-flex align-items-center mt-2">
                                        <Button
                                            style={{
                                                backgroundColor: 'blue',
                                                color: 'white',
                                                borderColor: 'blue',
                                            }}
                                            onMouseEnter={e => (e.target.style.backgroundColor = 'red')}
                                            onMouseLeave={e => (e.target.style.backgroundColor = 'blue')}
                                            size="sm"
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        >
                                            -
                                        </Button>
                                        <Form.Control
                                            type="number"
                                            value={item.quantity}
                                            onChange={e =>
                                                updateQuantity(item.productId, Math.max(0, Number(e.target.value)))
                                            }
                                            className="mx-2 text-center"
                                            style={{
                                                width: '60px',
                                                color: 'darkorange',
                                                fontWeight: 'bold',
                                            }}
                                        />
                                        <Button
                                            style={{
                                                backgroundColor: 'blue',
                                                color: 'white',
                                                borderColor: 'blue',
                                            }}
                                            onMouseEnter={e => (e.target.style.backgroundColor = 'red')}
                                            onMouseLeave={e => (e.target.style.backgroundColor = 'blue')}
                                            size="sm"
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                                <Card.Text className="text-orange fw-bold">
                                    Subtotal: ₱{item.subtotal}
                                </Card.Text>
                                <Button
                                    className="w-100 mt-3"
                                    style={{
                                        backgroundColor: 'blue',
                                        color: 'white',
                                        borderColor: 'blue',
                                    }}
                                    onMouseEnter={e => (e.target.style.backgroundColor = 'red')}
                                    onMouseLeave={e => (e.target.style.backgroundColor = 'blue')}
                                    onClick={() => {
                                        Swal.fire({
                                            title: 'Are you sure?',
                                            text: 'Do you want to remove this product from your cart?',
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonText: 'Yes, remove it!',
                                            cancelButtonText: 'Cancel',
                                            customClass: {
                                                confirmButton: 'btn btn-danger',
                                                cancelButton: 'btn btn-primary',
                                                actions: 'swal2-buttons-spacing',
                                            },
                                            buttonsStyling: false,
                                        }).then(result => {
                                            if (result.isConfirmed) {
                                                removeFromCart(item.productId);
                                            }
                                        });
                                    }}
                                >
                                    Remove Item
                                </Button>
                            </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
                <h4 className="text-end mt-4 fw-bold">Total Price: ₱{cart.totalPrice}</h4>
                <Col xs={12} className="d-flex justify-content-between align-items-center mt-4" >   
                    <Button
                        className="w-50 ms-2"
                        style={{
                            backgroundColor: 'darkred',
                            color: 'white',
                            borderColor: 'darkred',
                        }}
                        onMouseEnter={e => (e.target.style.backgroundColor = 'red')}
                        onMouseLeave={e => (e.target.style.backgroundColor = 'darkred')}
                        onClick={clearCart}
                        disabled={isLoading} // Disable the button while loading
                    >
                        {/* Clear all items from cart */}
                        {isLoading ? 'Processing...' : 'Clear all items from cart'}
                    </Button>
                    
                    <Button
                        className="w-50 ms-2"
                        style={{
                            backgroundColor: 'darkgreen',
                            color: 'white',
                            borderColor: 'darkgreen',
                        }}
                        onMouseEnter={e => (e.target.style.backgroundColor = 'green')}
                        onMouseLeave={e => (e.target.style.backgroundColor = 'darkgreen')}
                        onClick={checkout} // Call the checkout function
                    >
                        Checkout
                    </Button>
                </Col>
            </Row>
        </div>
    );

}