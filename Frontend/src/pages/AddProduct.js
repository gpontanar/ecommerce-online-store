import { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import UserContext from "../context/UserContext";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function AddProduct() {

  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize the navigate function

  // Input states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  function createProduct(e) {
    e.preventDefault();

    let token = localStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response Data:", data);

        if (data.message !== "Product Registered Successfully") {
          setName("");
          setDescription("");
          setPrice("");

          Swal.fire({
            title: "Product Successfully Added",
            icon: "success",
            text: "Product New Alert",
          }).then(() => {
            navigate("/product")
          });
        } else {
          Swal.fire({
            title: "Something went wrong.",
            icon: "error",
            text: "Please try again later or contact us for assistance",
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  return user?.isAdmin ? (
    <>
      <h3 className="my-2">Add New Product</h3>
      <Form onSubmit={createProduct}>
        <Form.Group>
          <Form.Label>Product Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Product Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Product Description:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter Product Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="my-2 me-2">
          Submit
        </Button>
        <Button variant="danger" className="my-2" onClick={() => navigate("/product")}> 
          Back to Admin Dashboard
        </Button>
      </Form>
    </>
  ) : (
    <h2 className="text-center mt-5">Access Denied</h2>
  );
}