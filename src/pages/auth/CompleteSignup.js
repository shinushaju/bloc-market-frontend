import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { message } from 'antd';
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../../helpers/auth";

const CompleteSignup = ({ history }) => {

    // states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // styles
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }
    const buttonStyle = { cursor: "pointer", border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "medium", backgroundColor: "#0065FF", color: "#ffffff" }

    let dispatch = useDispatch();

    useEffect(() => {
        setEmail(window.localStorage.getItem("emailForSignup"));
    }, [])


    const completeSignupForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <input type="email" className="py-3 px-4 my-2" value={email} style={inputStyle} disabled />
                <input type="password" className="py-3 px-4 my-2" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                <button type="submit" className="py-3 my-4" style={buttonStyle} onClick={handleSubmit} disabled={!email || !password}>
                    Continue
                </button>
            </form>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            message.error('Email and password is required!', 3);
            return;
        }

        if (password.length < 6) {
            message.error('Password must be at least 6 characters long!', 3);
            return;
        }

        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            console.log("USER", result);
            if (result.user.emailVerified) {
                window.localStorage.removeItem("emailForSignup");
                let user = auth.currentUser;
                await user.updatePassword(password);
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
                message.loading('Signing up in progress..', 2)
                    .then(() => message.success('Sign-up Success! ', 3))
                    .then(() => history.push('/'));
            }
        }
        catch (error) {
            console.log(error.message)
            message.error('Link expired or has already been used!', 3);
        }
    }


    return (
        <div className="my-5">
            <div className="row my-5 justify-content-center">
                <div className="col-sm-4">
                    <div className="container my-5">
                        <h2><b>Complete Signup</b></h2>
                        <div className="my-5">
                            {completeSignupForm()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompleteSignup;