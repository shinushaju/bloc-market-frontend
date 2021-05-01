import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { useSelector } from "react-redux";
import { notification, message } from 'antd';

const ForgotPassword = ({ history }) => {

    const [email, setEmail] = useState("");

    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }
    const buttonStyle = { cursor: "pointer", border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "medium", backgroundColor: "#0065FF", color: "#ffffff" }

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            history.push("/");
        }
    }, [user, history]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            url: process.env.REACT_APP_PASSWORD_RESET_REDIRECT_URL,
            handleCodeInApp: true,
        };

        await auth
            .sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail("");
                emailSentNotification('success');
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

    const emailSentNotification = type => {
        notification[type]({
            description:
                `Password reset link has been sent to ${email}. Click the link to reset password.`
        });
    };

    return (
        <div className="my-5">
            <div className="row my-5 justify-content-center">
                <div className="col-sm-4">
                    <div className="container my-5">
                        <h2><b>Reset Password</b></h2>
                        <div className="my-5">
                            <form>
                                <input type="email" className="py-3 px-4 my-2" placeholder="Enter email address" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
                                <button className="py-3 my-4" style={buttonStyle} onClick={handleSubmit} disabled={!email}>
                                    Reset Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;