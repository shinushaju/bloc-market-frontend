import React from 'react';
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom"
import { Link } from 'react-router-dom';
import logo from './blocmarket-logo.svg'
import { Menu, Button, message } from 'antd';
const { SubMenu } = Menu;

const Navbar = () => {

    let history = useHistory();

    let dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));

    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type: "LOGOUT",
            payload: null,
        });
        history.push("/login");
        message.info('Signed out!');
    };


    return (
        <Menu theme="light" mode="horizontal" style={{ padding: "18px 80px", borderBottomColor: "transparent", position: 'fixed', zIndex: 1, width: '100%', background: "#ffffff" }}>
            <Link to="/">
                <img src={logo} height="24px" width="auto" alt="Bloc Logo" />
            </Link>

            {user && (
                <SubMenu className="float-right" key="SubMenu" title="My Profile">
                    <Menu.Item key="logout" onClick={logout}>Log Out</Menu.Item>
                </SubMenu>
            )}

            {!user && (
                <Menu.Item className="float-right"><Link to="/sign-up"><Button shape="round" className="px-4" size="large" style={{ border: "none", fontWeight: "500", backgroundColor: "#0065FF", color: "#ffffff" }}>Sign up</Button></Link></Menu.Item>
            )}

            {!user && (
                <Menu.Item className="float-right"><Link to="/login">Sign In</Link></Menu.Item>
            )}
            <Menu.Item className="float-right"><Link to="/activity">Activity</Link></Menu.Item>
            <Menu.Item className="float-right"><Link to="/explore">Explore</Link></Menu.Item>
        </Menu>
    )
}

export default Navbar;