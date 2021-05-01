import React, { useState, useEffect } from 'react';
import googleIcon from './google-icon.svg';
import { Link } from 'react-router-dom';
import { Divider, notification, message } from 'antd';
import { auth, googleAuthProvider } from '../../firebase';
import { useDispatch, useSelector } from "react-redux";

const Signup = ({ history }) => {

    // states
    const [email, setEmail] = useState("");

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

    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <input type="email" className="py-3 px-4 my-2" value={email} placeholder="Enter email address" onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <button type="submit" className="py-3 my-4" style={buttonStyle} onClick={handleSubmit} disabled={!email}>
                    Sign up with email
                </button>
            </form>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            url: process.env.REACT_APP_SIGNUP_REDIRECT_URL,
            handleCodeInApp: true,
        };
        await auth.sendSignInLinkToEmail(email, config);
        emailSentNotification('success');
        window.localStorage.setItem("emailForSignup", email);
        setEmail('');
    }

    const emailSentNotification = type => {
        notification[type]({
            description:
                `Email has been sent to ${email}. Click the link to complete the registration.`,
        });
    };

    const googleSignup = () => {
        auth
            .signInWithPopup(googleAuthProvider)
            .then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();

                dispatch({
                    type: "LOGGED_IN_USER",
                    payload: {
                        email: user.email,
                        token: idTokenResult.token,
                    },
                });

                message.success('Sign-in Success! ', 3)
                    .then(() => history.push('/'));
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

    return (
        <div class="my-5">
            <div class="row my-5 justify-content-center">
                <div class="col-sm-4">
                    <div className="container">
                        <h2><b>Sign Up</b></h2>
                        <p>Already have an account, <Link to="login" style={{ color: "#0065FF", fontWeight: "bold" }}>Login</Link></p>
                        <div className="my-5">

                            <button type="submit" className="py-3" style={googleAuthStyle} onClick={googleSignup}>
                                <span><img src={googleIcon} height="24px" /></span> &emsp; Sign up with Google
                            </button>
                            <Divider className="my-4"><span style={{ color: "#999999" }}>or</span></Divider>
                            {signupForm()}

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Signup;