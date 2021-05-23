import React, { useState, useEffect } from 'react';
import { Spin } from "antd";
import {LoadingOutlined} from '@ant-design/icons'
import { useHistory } from 'react-router-dom';

const Redirect = (req, res) => {
    const [count, setCount] = useState(3);
    let history = useHistory();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount)
        }, 1000);

        count === 0 && history.push("/login");

        return () => clearInterval(interval);
    }, [count, history]);

    return (
        <div className="container-fluid py-5">
            <div className="my-5" style={{position: 'absolute', top: '36%', fontSize: "300%", fontWeight: "bold", left: '48%', msTransform: 'translateY(-50%)', transform: 'transalateY(-50%)'}}>
                <LoadingOutlined />
            </div>
        </div>
    )
};

export default Redirect;
