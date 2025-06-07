import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

export default function Login() {
  const { user, setUser, unsetUser } = useContext(UserContext); // Use context to get user, setUser, unsetUser

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  function authenticate(e) {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          localStorage.setItem('token', data.access);
          retrieveUserDetails(data.access);

          Swal.fire({
            title: 'Login Successful',
            icon: 'success',
            text: 'Welcome to Zuitt!',
          });
        } else {
          Swal.fire({
            title: 'Authentication failed',
            icon: 'error',
            text: 'Check your login details and try again.',
          });
        }
      })
      .catch((error) => {
        console.error('Error during authentication:', error);
      });

    setEmail(''); // Reset email and password fields after submission
    setPassword('');
  }

  const retrieveUserDetails = (token) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('API Response:', data); // Log the response to see the structure

        // Check if user data exists in the response (directly use the returned object)
        if (data && data._id) {
          setUser({
            id: data._id,          // Using _id directly from the API response
            isAdmin: data.isAdmin, // Ensure isAdmin is being set
          });

        } else {
          console.error('No user data found in API response');
          unsetUser(); // Clear user state if no valid user data
        }
      })
      .catch((err) => {
        console.error('Error fetching user details:', err);
        unsetUser(); // Clear user state on error
      });
  };

  // useEffect to validate if fields are filled to enable the Submit button
  useEffect(() => {
    if (email !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  // Check if the user is already logged in, and if so, redirect to /product
  if (user && user.id !== null) {
    return <Navigate to="/product" />;
  }

  return (
<>
  <Form onSubmit={(e) => authenticate(e)}>
    <h1 className="my-5 text-center">Login</h1>
    <Form.Group controlId="userEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </Form.Group>

    <Form.Group controlId="password">
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </Form.Group>

    {isActive ? (
      <Button variant="primary" type="submit" id="submitBtn">
        Submit
      </Button>
    ) : (
      <Button variant="danger" type="submit" id="submitBtn" disabled>
        Submit
      </Button>
    )}
  </Form>

 <p className="text-center">
  Don't have an account yet? <Link to="/register">Click here</Link> to register.
</p>

</>
  );
}