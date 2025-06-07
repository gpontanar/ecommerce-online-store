import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function EditProduct({ product, fetchData, setProducts }) {

	const notyf = new Notyf();

	const [productId, setproductId] = useState(product._id);
	const [name, setName] = useState(product.name);
	const [description, setDescription] = useState(product.description);
	const [price, setPrice] = useState(product.price);

	const [showEdit, setShowEdit] = useState(false);

	const openEdit = () => {

		setShowEdit(true);

	}

	const closeEdit = () => {

		setShowEdit(false);
        
	}

	// function to update the course
const editProduct = async (e, productId) => {
    e.preventDefault();
    console.log(productId);

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ name, description, price }),
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            notyf.success("Successfully updated");
            closeEdit();
            const updatedProducts = await fetchData(); // Fetch updated list
            setProducts(updatedProducts); // Update state in AdminDashboard
        } else {
            notyf.error("Something went wrong");
        }
    } catch (error) {
        console.error("Error updating product:", error);
        notyf.error("Failed to update");
    }
};



	return(
		<>
			<Button variant="primary" size="sm" onClick={() => openEdit()}>Update</Button>

			{/*EDIT MODAL*/}
            <Modal show={showEdit} onHide={closeEdit}>
                <Form onSubmit={e => editProduct(e, productId)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>    
                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                            type="text" 
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="productDescription">
	    	                        <Form.Label>Description</Form.Label>
                            <Form.Control 
                            type="text" 
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="productPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control 
                            type="number" 
                            required
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEdit}>Close</Button>
                        <Button variant="success" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
		</>
	)

}