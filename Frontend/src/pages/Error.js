import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Error() {


    return (
        <Row>
            <Col className="mt-5 pt-5 text-center mx-auto">
                <h1>404 Not Found</h1>
                <h3>Under Maintenance</h3>
                <Link className="btn btn-primary" to={"/"}>Return to Home</Link>
            </Col>
        </Row>
    )
}