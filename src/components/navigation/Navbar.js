import React, { useEffect, useState } from 'react';
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom"
import {  } from 'react-router-dom';
import logo from './bloc.svg'
import { Menu, Button, message, Avatar, Badge } from 'antd';
import { UserOutlined, AppstoreAddOutlined, SettingOutlined, LogoutOutlined} from '@ant-design/icons';
const { SubMenu } = Menu;

const Navbar = () => {

    const [current, setCurrent] = useState("");
    const [notificationsCount, setNotificationsCount] = useState('6')
    let history = useHistory();
    let dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));
    
    useEffect(() => {
        setCurrent(history.location.pathname.substring(1))
    }, [])

    const handleClick = (e) => {
        setCurrent(history.location.pathname.substring(1));
      };

    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type: "LOGOUT",
            payload: null,
        });
        history.push("/assets");
        message.info('Signed out!');
    };

    const notifications = () => {
        setNotificationsCount('0');
    }

    return (
        <Menu theme="light" onClick={handleClick} selectedKeys={[current]} mode="horizontal" style={{ padding: "18px 80px", borderBottomColor: "transparent", position: 'fixed', zIndex: 50, width: '100%', background: "#ffffff" }}>
           <Menu.Item key="/">
                <Link to="/">
                    <img src={logo} height="30px" width="auto" alt="Bloc Logo" />
                </Link>
            </Menu.Item>

            {user && (
                <SubMenu className="float-right" selectedKeys={[current]} key="SubMenu" title={<Avatar size="large" src={user.picture} />}>
                    <Menu.Item key="profile" style={{ fontWeight: "400" }}><Link to="/profile"><UserOutlined /> Profile</Link></Menu.Item>
                    <Menu.Item key="store" style={{ fontWeight: "400" }}><Link to="/store"><AppstoreAddOutlined /> My Store</Link></Menu.Item>
                    <Menu.Item key="account" style={{ fontWeight: "400" }}><Link to="/account/profile/edit"><SettingOutlined /> Settings</Link></Menu.Item>
                    <hr></hr>
                    <Menu.Item key="logout" style={{ fontWeight: "400" }} onClick={logout}><LogoutOutlined /> Log Out</Menu.Item>
                </SubMenu>
            )}

            {!user && (
                <Menu.Item key="sign-up" className="float-right"><Link to="/sign-up"><Button shape="round" className="px-4" size="large" style={{ border: "none", fontWeight: "400", fontSize: "medium", backgroundColor: "#121212", color: "#ffffff" }}>Sign up</Button></Link></Menu.Item>
            )}

            {!user && (
                <Menu.Item key="login" className="float-right" style={{ fontWeight: "400", fontSize: "medium" }}><Link to="/login">Login</Link></Menu.Item>
            )}
            { user && (
                <Menu.Item disabled key="notifications" className="float-right" onClick={notifications} >
                    <Link to="/notifications">
                        <span style={{ fontWeight: "400", fontSize: "medium" }}>Notifications</span>
                        <Badge count={notificationsCount} dot>
                        </Badge>
                    </Link>
                </Menu.Item>
            )}
            <Menu.Item disabled key="activity" className="float-right" style={{ fontWeight: "400", fontSize: "medium" }}><Link to="/activity">Activity</Link></Menu.Item>
            <Menu.Item key="assets" className="float-right" style={{ fontWeight: "400", fontSize: "medium" }}><Link to="/assets">Explore</Link></Menu.Item>
        </Menu>
    )
}

export default Navbar;