import React, { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Breadcrumb, Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import UsernameValidation from '../hooks/UsernameValidation';
import { useSelector, useDispatch } from 'react-redux';
import { updateUsername } from '../helpers/users';
import { Link } from 'react-router-dom';
const { Content } = Layout;

const ChangePassword = () => {

    const [buttonLabel, setButtonLabel] = useState("Save");
    const [username, setUserName] = useState("");
    const [isAvailable, validLength, lowerCase, hasWhiteSpace] = UsernameValidation({ username });

    const { user } = useSelector((state) => ({ ...state }));
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "400", fontSize: "medium", backgroundColor: "#F4F5F7", color: "#6E6D7A" }
    const dispatch = useDispatch();

    useEffect(() => {
        setUserName(user.username);
    }, []);

    // username validation
    var usernameAvailable;
    if (isAvailable && username != user.username) {
        usernameAvailable = <div style={{ color: "green" }}>Username available.</div>;
    }
    if (!isAvailable) {
        usernameAvailable = <div style={{ color: "red" }}>Username taken.</div>;
    }
    if (!validLength) {
        usernameAvailable = <div style={{ color: "red" }}>Username must have at least 5 characters.</div>;
    }
    if (!hasWhiteSpace) {
        usernameAvailable = <div style={{ color: "red" }}>No whitespace or special characters allowed.</div>;
    }
    if (!lowerCase) {
        usernameAvailable = <div style={{ color: "red" }}>Only lower-case allowed.</div>;
    }
    if (!username) {
        usernameAvailable = <div style={{ color: "red" }}>Username is required.</div>;
    }


    const handleReset = () => {
        setUserName(user.username);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLabel(<LoadingOutlined style={{ color: "#ffffff" }} />);

        updateUsername(user._id, { username }, user.token)
            .then((res) => {
                dispatch({
                    type: "USERNAME_UPDATE",
                    payload: res.data.username
                });
                message.success(<span>Username updated successfully! &#127881;</span>, 3);
                setButtonLabel('Save');
            })
            .catch((error) => {
                console.log(error);
                setButtonLabel('Save');
            })
    }

    const accountSettingsForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <label>New Password</label>
                <input type="name" className="py-2 px-4 my-2" placeholder="Enter username" value={username} onChange={(e) => setUserName(e.target.value)} style={inputStyle} />
                {usernameAvailable}
                {username != user.username &&
                    <div className="my-4 float-left">
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSubmit}
                            disabled={!username || !isAvailable || !validLength || !lowerCase || !hasWhiteSpace}
                        >
                            {buttonLabel}
                        </Button>
                        <Button
                            size="large"
                            className="mx-3"
                            onClick={handleReset}
                        >
                            Reset
                    </Button>
                    </div>
                }
            </form>
        )
    }
    return (
        <div className="m-5 px-5 py-3">
            <Layout style={{ background: "#FFFFFF" }}>
                <div className="container p-5">
                    <Content style={{ padding: '0 50px' }}>
                        <div className="row px-5">
                            <div className="col-1">
                                <Avatar src={user.picture} size={56} />
                            </div>
                            <div className="col-11">
                                <Breadcrumb style={{ fontSize: "150%" }}>
                                    <Breadcrumb.Item>
                                        <span style={{ color: "#050D1B" }}><b>{user.name}</b></span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <span><b>Change Password</b></span>
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <p style={{ color: "#6E6D7A" }}>Change your password.</p>
                            </div>
                        </div>
                        <div className="container-fluid p-5">
                            <div className="row">
                                <div className="col-sm-3">
                                    <Menu
                                        defaultSelectedKeys={['3']}
                                        mode="inline"
                                        theme="light"
                                    >
                                        <Menu.Item key="1">
                                            <Link to="/settings/account/profile/edit">Edit Profile</Link>
                                        </Menu.Item>
                                        <Menu.Item key="2">
                                            <Link to="/settings/account">Account Settings</Link>
                                        </Menu.Item>
                                        <Menu.Item disabled key="3">
                                            <Link to="/settings/account/password/change">Password</Link>
                                        </Menu.Item>
                                    </Menu>
                                </div>
                                <div className="col-sm-8">
                                    <div className="container px-5">
                                        {accountSettingsForm()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Content>
                </div>
            </Layout>
        </div>
    )
}

export default ChangePassword;