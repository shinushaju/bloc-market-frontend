import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Divider, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import googleIcon from './google-icon.svg';

// email validator
import EmailValidation from '../../hooks/EmailValidation';

// api functions
import { createOrUpdateUser } from '../../helpers/auth'
import { auth, googleAuthProvider } from "../../firebase";

const Login = ({ history }) => {

    let dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));
    var emailValidity;

    // states
    const [buttonLabel, setButtonLabel] = useState("Login with email");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validEmail] = EmailValidation({ email });

    // styles
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }
    const buttonStyle = { cursor: "pointer", border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "medium", backgroundColor: "#0065FF", color: "#ffffff" }
    const googleAuthStyle = { boxShadow: "rgba(0, 0, 0, 0.08) 0px 1.5px 6px", cursor: "pointer", border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "larger", backgroundColor: "#ffffff", color: "#666666" }

    useEffect(() => {
        if (user && user.token) {
            history.push("/");
        }
    }, [user, history]);

    // checking email valid or not.
    if (email != '' && !validEmail) {
        emailValidity = <p style={{ color: "red" }}>Please enter a valid email</p>;
    }


    const loginForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <input type="email" className="py-3 px-4 my-2" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <br />
                {emailValidity}
                <input type="password" className="py-3 px-4 my-2" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} autoComplete="on" />
                <div className="my-2 text-right">
                    <Link to="/password/reset">Forgot Password?</Link>
                </div>
                <button type="submit" className="py-3 my-4" style={buttonStyle} onClick={handleSubmit} disabled={!email || !password || !validEmail}>
                    {buttonLabel}
                </button>
            </form>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLabel(<LoadingOutlined style={{ color: "#ffffff", fontSize: "larger" }} />);

        if (!email || !password) {
            message.error('Email and password is required!', 3);
            return;
        }

        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();

            createOrUpdateUser(idTokenResult.token)
                .then((res) => {
                    dispatch({
                        type: "CURRENT_USERR",
                        payload: {
                            name: res.data.name,
                            email: res.data.email,
                            username: res.data.username,
                            picture: res.data.picture,
                            _id: res.data._id,
                            token: idTokenResult.token,
                        },
                    });
                })
                .catch((error) => {
                    setButtonLabel('Login with email');
                    console.log(error.message)
                });

            message.success(`Authenticated as ${user.email}`, 5)
                .then(() => history.push('/'));

        } catch (error) {
            message.error(error.message);
            setButtonLabel('Login with email');
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
                        //console.log(res.data);
                        dispatch({
                            type: "CURRENT_USER",
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                username: res.data.username,
                                picture: res.data.picture,
                                _id: res.data._id,
                                token: idTokenResult.token,
                            },
                        });
                    })
                    .catch((error) => console.log(error.message));

                message.success(`Authenticated as ${user.email}`, 5)
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
                                <span><img src={googleIcon} height="24px" alt="Google Icon" /></span> &ensp; Sign in with Google
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