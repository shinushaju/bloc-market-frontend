import React, { useState, useEffect } from 'react';
import { auth, googleAuthProvider } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import googleIcon from './google-icon.svg';
import { Link } from 'react-router-dom';
import { Divider, message } from 'antd';
import { createOrUpdateUser } from '../../helpers/auth'

const Login = ({ history }) => {

    // states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // styles
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }
    const buttonStyle = { cursor: "pointer", border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "medium", backgroundColor: "#0065FF", color: "#ffffff" }
    const googleAuthStyle = { boxShadow: "rgba(0, 0, 0, 0.08) 0px 1.5px 6px", cursor: "pointer", border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "larger", backgroundColor: "#ffffff", color: "#666666" }

    let dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            history.push("/");
        }
    }, [user, history]);


    const loginForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <input type="email" className="py-3 px-4 my-2" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <input type="password" className="py-3 px-4 my-2" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} autoComplete="on"/>
                <div className="my-2 text-right">
                    <Link to="/password/reset">Forgot Password?</Link>
                </div>
                <button type="submit" className="py-3 my-4" style={buttonStyle} onClick={handleSubmit} disabled={!email || !password}>
                    Login with email
                </button>
            </form>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();

            createOrUpdateUser(idTokenResult.token)
                .then((res) => {
                    dispatch({
                        type: "LOGGED_IN_USER",
                        payload: {
                            name: res.data.name,
                            email: res.data.email,
                            picture: res.data.picture,
                            _id: res.data._id,
                            token: idTokenResult.token,
                        },
                    });
                })
                .catch((error) => console.log(error.message));

            message.success('Sign-in Success! ', 3)
                .then(() => history.push('/'));

        } catch (error) {
            message.error(error.message);
        }
    }

    const googleLogin = () => {
        auth
            .signInWithPopup(googleAuthProvider)
            .then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();

                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        dispatch({
                            type: "LOGGED_IN_USER",
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                picture: res.data.picture,
                                _id: res.data._id,
                                token: idTokenResult.token,
                            },
                        });
                    })
                    .catch((error) => console.log(error.message));

                message.success('Sign-in Success! ', 3)
                    .then(() => history.push('/'));
            })
            .catch((error) => {
                message.error(error.message);
            });
    };


    return (
        <div className="my-5">
            <div className="row my-5 justify-content-center">
                <div className="col-sm-4">
                    <div className="container">
                        <h2><b>Login</b></h2>
                        <p>Don't have an account, <Link to="sign-up" style={{ color: "#0065FF", fontWeight: "bold" }}>Sign up</Link></p>
                        <div className="my-5">
                            <button type="submit" className="py-3" style={googleAuthStyle} onClick={googleLogin}>
                                <span><img src={googleIcon} height="24px" alt="Google Icon"/></span> &ensp; Sign in with Google
                            </button>
                            <Divider className="my-4"><span style={{ color: "#999999" }}>or</span></Divider>
                            {loginForm()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;