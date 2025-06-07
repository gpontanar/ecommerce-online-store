import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">The Zuitt Shop</Navbar.Brand>
                <Nav.Link as={NavLink} to={user.isAdmin ? "/product" : "/product"} style={{ color: 'white' }}>
                    {user.isAdmin ? "Admin Dashboard" : "Products"}
                </Nav.Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user.id ? (
                            <>
                                {!user.isAdmin && <Nav.Link as={NavLink} to="/cart">Cart</Nav.Link>}
                                {!user.isAdmin && <Nav.Link as={NavLink} to="/orders">Orders</Nav.Link>}
                                <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                                <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
