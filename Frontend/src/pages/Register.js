import { useState, useEffect, useContext  } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';


export default function Register() {

	const {user} = useContext(UserContext);
	const navigate = useNavigate(); 

	// State hooks to store the values of the input fields
		// container, function to set / update the state
	const [firstName,setFirstName] = useState("");
	const [lastName,setLastName] = useState("");
	const [email,setEmail] = useState("");
	const [mobileNo,setMobileNo] = useState(0);
	const [password,setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(false);

    // Check if values are successfully binded
	console.log(firstName);
	console.log(lastName);
	console.log(email);
	console.log(mobileNo);
	console.log(password);
	console.log(confirmPassword)

	useEffect(()=>{

		if((firstName !== "" && lastName !== "" && email !== "" && mobileNo !== "" && password !=="" && confirmPassword !=="") && (password === confirmPassword) && (mobileNo.length === 11)){

			setIsActive(true)

		} else {

			setIsActive(false)

		}

	},[firstName,lastName,email,mobileNo,password,confirmPassword])

	function registerUser(e) {
		// Prevents page redirection via form submission
		e.preventDefault();
	
		fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				mobileNo: mobileNo,
				password: password
			})
		})
		.then(res => res.json())
		.then(data => {
			// Handle the response
			console.log(data);
			if (data.message === "Registered Successfully") {
				setFirstName('');
				setLastName('');
				setEmail('');
				setMobileNo(0);
				setPassword('');
				setConfirmPassword('');
	
				Swal.fire({
					title: "Registration Successful",
					icon: "success",
					text: "Thank you for registering!"
				}).then(() => {
                    navigate('/login'); 
				});
			} else {
				Swal.fire({
					title: "Something went wrong.",
					icon: "error",
					text: "Please try again later or contact us for assistance"
				});
			}
		})
		.catch(err => {
			console.error("Error:", err);
			Swal.fire({
				title: "Error",
				icon: "error",
				text: "An error occurred. Please try again later."
			});
		}); // <-- Ensure this closing parenthesis is present
	}

	useEffect(()=>{

		if((email !== "" && password !=="" && confirmPassword !=="") && (password === confirmPassword)){

			setIsActive(true)

		} else {

			setIsActive(false)

		}

	},[email, password, confirmPassword])

    return (
		
		<Form onSubmit={(e) => registerUser(e)}>
		<h1 className="my-5 text-center">Register</h1>
			<Form.Group>
				<Form.Label>First Name:</Form.Label>
				<Form.Control 
					type="text" 
					placeholder="Enter First Name" 
					required 
					value={firstName}
					onChange={e => {setFirstName(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Last Name:</Form.Label>
				<Form.Control 
					type="text" 
					placeholder="Enter Last Name" 
					required
					value={lastName}
					onChange={e => {setLastName(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Email:</Form.Label>
				<Form.Control 
					type="email" 
					placeholder="Enter Email" 
					required
					value={email}
					onChange={e => {setEmail(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Mobile No:</Form.Label>
				<Form.Control 
					type="number" 
					placeholder="Enter 11 Digit No." 
					required  
					value={mobileNo}
					onChange={e => {setMobileNo(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Password:</Form.Label>
				<Form.Control 
					type="password" 
					placeholder="Enter Password" 
					required 
					value={password}
					onChange={e => {setPassword(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Confirm Password:</Form.Label>
				<Form.Control 
					type="password" 
					placeholder="Confirm Password" 
					required 
					value={confirmPassword}
					onChange={e => {setConfirmPassword(e.target.value)}}
				/>
			</Form.Group>
            {/* conditionally render submit button based on isActive state */}
    	    { isActive ? 
    	    	<Button variant="success" type="submit" id="submitBtn">
    	    		Register
    	    	</Button>
    	        : 
    	        <Button variant="danger" type="submit" id="submitBtn" disabled>
    	        	Please enter your registration details
    	        </Button>
    	    }
				
		</Form>
    )

}