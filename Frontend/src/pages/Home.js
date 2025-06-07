import { Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {

    const { user } = useContext(UserContext); 
    const navigate = useNavigate(); 


        return (
            <Row>
                <Col className="mt-5 pt-5 text-center mx-auto">
                    <h1>The Zuitt Shop</h1>
                    <p>Products for everyone, everywhere</p>
                
                    <button 
                        className="btn btn-primary mb-5" 
                        onClick={() => navigate('/product')}>
                        Browse Products
                    </button>

                    <>
                        <h2>Featured Products</h2>
                        <FeaturedProducts />
                    </>
                </Col>
            </Row>
            
        );

    }
  
