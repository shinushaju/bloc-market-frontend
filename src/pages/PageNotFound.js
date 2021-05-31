import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import illustration from '../images/404.png';

const PageNotFound = () => {
    return (
        <div className="container-fluid py-5">
            <div className="my-5" style={{ textAlign: "center", position: 'absolute', top: '5%', fontSize: "300%", fontWeight: "bold", left: '31%', msTransform: 'translateY(-50%)', transform: 'transalateY(-50%)' }}>
                <img src={illustration} height="400px" width="auto" alt="Page Not Found" />
                <h4>Page Not Found!</h4>
                <Link to="/">
                    <Button type="primary" size="large">Redirect to Home</Button>
                </Link>
            </div>
        </div>
    )
}

export default PageNotFound;