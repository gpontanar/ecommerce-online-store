import { useState, useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';

import { Notyf } from 'notyf';

import UserContext from '../context/UserContext';

import ResetPassword from '../components/ResetPassword';

export default function Profile(){

	const notyf = new Notyf();

    const { user } = useContext(UserContext);

    const [details,setDetails] = useState({});
    
    const navigate = useNavigate();

    useEffect(() => {
	    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`
			}
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)
			// Set the user states values with the user details upon successful login.
			if (typeof data !== undefined) {

				setDetails(data);

            } else if (data.error === "User not found") {

                notyf.error("User Not Found")

            } else {

                notyf.error("Something Went Wrong. Contact Your System Admin.")
            }
	    });
    }, [])


	return user.id === null ? (
        <Navigate to="/product" />
    ) : (
        <>

           

            <div style={{ backgroundColor: 'navy', color: 'white', padding: '10px' }}>
                <h2>Your Profile</h2>
            </div>

            <Container
                className="d-flex flex-column align-items-center mt-5 p-5"
                style={{ backgroundColor: 'darkblue', color: 'white', borderRadius: '10px' }}
            >
                <h1 style={{ color: 'orange', fontWeight: 'bold' }}>HELLO!</h1>
                <div
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        overflow: 'hidden',
                        margin: '20px 0',
                    }}
                >
                    <img
                        src="https://d92mrp7hetgfk.cloudfront.net/images/sites/misc/Zuitt_Logo/original.jpg?1608744848"
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <h2 style={{ fontWeight: 'bold' }}>{`${details.firstName} ${details.lastName}`}</h2>
                <h3 style={{ fontWeight: 'bold' }}>Welcome back!</h3>
                <hr style={{ width: '100%', borderColor: 'white', margin: '20px 0' }} />
                <h4 style={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>Contact info:</h4>
                <p style={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>
                    <strong>Email:</strong> {details.email}
                </p>
                <p style={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>
                    <strong>Mobile:</strong> {details.mobileNo}
                </p>

                <ResetPassword />
                
            </Container>

            
            

        </>
    );

}