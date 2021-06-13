import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu, Avatar, Breadcrumb, Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { Helmet } from 'react-helmet';

// api functions
import { updateName } from '../helpers/users';

const { Content } = Layout;

const EditProfile = () => {

    const dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));

    // states
    const [buttonLabel, setButtonLabel] = useState("Save");
    const [picture, setPicture] = useState("");
    const [name, setName] = useState("");

    // styles
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "400", fontSize: "medium", backgroundColor: "#F4F5F7", color: "#666666" }

    useEffect(() => {
        setPicture(user.picture);
        setName(user.name);
    }, []);

    const handleReset = () => {
        setName(user.name);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLabel(<LoadingOutlined style={{ color: "#ffffff" }} />);
        updateName(user._id, { name }, user.token)
            .then((res) => {
                dispatch({
                    type: "DISPLAY_NAME_UPDATE",
                    payload: res.data.name
                });
                message.success(<span>Name updated successfully! &#127881;</span>, 3);
                setButtonLabel('Save');
            })
            .catch((error) => {
                console.log(error);
                setButtonLabel('Save');
            })
    }


    const handlePictureSubmit = (e) => {
        let images = e.target.files;
        if (images) {
            for (let i = 0; i < images.length; i++) {
                Resizer.imageFileResizer(images[i], 300, 300, 'JPEG', 100, 0, (uri) => {
                    axios.post(`${process.env.REACT_APP_API}/user/${user._id}/picture/upload`, { picture: uri }, {
                        headers: {
                            authtoken: user ? user.token : '',
                        }
                    })
                        .then((res) => {
                            dispatch({
                                type: "DISPLAY_PICTURE_UPDATE",
                                payload: res.data.picture
                            });
                            setPicture(res.data.picture);
                            message.success(<span>Profile picture updated successfully! &#127881;</span>, 3);
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }, "base64", 300, 300);
            }
        }
    }


    const editProfileForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-3">
                        <Avatar src={picture} size={86} />
                    </div>

                    <div className="col-9">
                        <div className="my-4">
                            <label for="file-upload" className="px-4 py-2" style={{ cursor: "pointer", border: "2px solid #050D1B", borderRadius: "8px", fontWeight: "400", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff" }}>
                                Upload new picture
                                <input id="file-upload" type="file" accept="image/png,image/jpg,image/jpeg" multiple={false} onChange={handlePictureSubmit} />
                            </label>
                            <button type="button" className="px-4 py-2 mx-1" style={{ cursor: "pointer", border: "none", borderRadius: "8px", fontWeight: "400", backgroundColor: "#E7E7E9", color: "#050D1B" }}>Delete Picture</button>
                        </div>
                    </div>

                </div>
                <br /><br />
                <label>Name</label><span style={{ color: "red" }}> * </span>
                <input type="text" className="py-2 px-4 my-2" placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                {name !== user.name &&
                    <div className="my-4 float-left">
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSubmit}
                            disabled={!name}
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
        <>
            <Helmet>
                <title>Settings - Edit Profile | Bloc | Market</title>
            </Helmet>
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
                                            <Link to="/account">
                                                <span style={{ color: "#050D1B" }}><b>{user.name}</b></span>
                                            </Link>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item>
                                            <span><b>Edit Profile</b></span>
                                        </Breadcrumb.Item>
                                    </Breadcrumb>
                                    <p style={{ color: "#6E6D7A" }}>Edit your profile information.</p>
                                </div>
                            </div>
                            <div className="container-fluid p-5">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <Menu
                                            defaultSelectedKeys={['1']}
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
                                            {editProfileForm()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Content>
                    </div>
                </Layout>
            </div>
        </>
    )
}

export default EditProfile;