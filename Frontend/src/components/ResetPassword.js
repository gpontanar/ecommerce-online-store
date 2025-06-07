import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const ResetPassword = () => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

const handleResetPassword = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setMessage('Passwords do not match');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/users/update-password`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: password }),
      }
    );

    if (response.ok) {
      setMessage('Password reset successfully');
      setPassword('');
      setConfirmPassword('');
    } else {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Password reset failed');
      } else {
        const errorText = await response.text();
        setMessage(`Unexpected error: ${errorText}`);
      }
    }
  } catch (error) {
    setMessage('An error occurred. Please try again.');
    console.error(error);
  }
};


  const handleOpenModal = () => {
    setPassword('');
    setConfirmPassword('');
    setMessage('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button className="btn btn-warning" onClick={handleOpenModal}>
        Reset Password
      </button>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleResetPassword}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (message) setMessage('');
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (message) setMessage('');
                }}
                required
              />
            </Form.Group>

            {message && (
              <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                {message}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Reset Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ResetPassword;
