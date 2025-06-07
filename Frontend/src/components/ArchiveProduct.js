import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { fetchData } from './FetchData';

export default function ArchiveProduct({ product, isActive, fetchData, setProducts }) {

    const notyf = new Notyf();

    const [productId, setProductId] = useState(product._id);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');

    const handleClose = () => setShowModal(false);
    const handleShow = (action) => {
        setActionType(action); // 'archive' or 'activate'
        setShowModal(true);
    };

 const archiveToggle = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            notyf.success('Successfully Disabled');
            const updatedProducts = await fetchData(); // Fetch updated list
            setProducts(updatedProducts); // Update state
        } else {
            notyf.error('Something Went Wrong');
        }
    } catch (error) {
        console.error('Error disabling product:', error);
        notyf.error('Failed to disable');
    }
    handleClose(); // Close modal after action
};

const activateToggle = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            notyf.success('Successfully Activated');
            const updatedProducts = await fetchData(); // Fetch updated list
            setProducts(updatedProducts); // Update state
        } else {
            notyf.error('Something Went Wrong');
        }
    } catch (error) {
        console.error('Error activating product:', error);
        notyf.error('Failed to activate');
    }
    handleClose(); // Close modal after action
};


    return (
        <>
            {isActive ? (
                <Button variant="danger" size="sm" onClick={() => handleShow('archive')}>
                    Disable
                </Button>
            ) : (
                <Button variant="success" size="sm" onClick={() => handleShow('activate')}>
                    Activate
                </Button>
            )}

            {/* Modal for confirmation */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {actionType === 'archive'
                        ? 'Are you sure you want to disable this product?'
                        : 'Are you sure you want to activate this product?'}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant={actionType === 'archive' ? 'danger' : 'success'}
                        onClick={actionType === 'archive' ? archiveToggle : activateToggle}
                    >
                        Yes, {actionType === 'archive' ? 'Disable' : 'Activate'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}