import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Redirect from './Redirect';
import { currentUser } from '../../helpers/auth';

const GuestRoute = ({ children, ...rest }) => {

    const [ok, setOk] = useState(false);
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            currentUser(user.token)
                .then(() => {
                    setOk(true);
                })
                .catch(() => {
                    setOk(false)
                })
        }
    }, [user])

    return <Route {...rest} />;

}

export default GuestRoute;