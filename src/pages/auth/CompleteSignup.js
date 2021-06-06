import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { auth } from '../../firebase';

// password validator
import PasswordValidation from '../../hooks/PasswordValidation';

// api functions
import { createOrUpdateUser } from "../../helpers/auth";

const CompleteSignup = ({ history }) => {

    let dispatch = useDispatch();

    // states
    const [buttonLabel, setButtonLabel] = useState("Complete Sign Up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [
        validContent,
        validLength,
        hasNumber,
        upperCase,
        lowerCase,
        specialChar,
    ] = PasswordValidation({ password, email });

    // styles
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }
    const buttonStyle = { cursor: "pointer", border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "medium", backgroundColor: "#0065FF", color: "#ffffff" }

    useEffect(() => {
        if (window.localStorage.getItem("emailForSignup") === null) {
            // history.push('/sign-up');
        }
        else {
            setEmail(window.localStorage.getItem("emailForSignup"));
        }
    }, [])

    const setFirst = (e) => {
        setPassword(e.target.value);
    };

    const completeSignupForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <input type="email" className="py-3 px-4" value={email} style={inputStyle} disabled />
                <br /><br />
                <input type="password" className="py-3 px-4" placeholder="Create password" value={password} onChange={setFirst} style={inputStyle} />

                <div className="row my-3" style={{ fontSize: "96%" }}>
                    <div className="col-sm-6">
                        <ul>
                            <li style={validContent ? { color: "#36b34a" } : { color: "#666666" }}>
                                Must not contain your name, username or email
                            </li>
                            <li style={validLength ? { color: "#36b34a" } : { color: "#666666" }}>
                                At least 8 characters
                            </li>
                            <li style={hasNumber ? { color: "#36b34a" } : { color: "#666666" }}>
                                At least 1 number
                            </li>
                        </ul>
                    </div>
                    <div className="col-sm-6">
                        <ul>
                            <li style={upperCase ? { color: "#36b34a" } : { color: "#666666" }}>
                                One upper-case letter
                            </li>
                            <li style={lowerCase ? { color: "#36b34a" } : { color: "#666666" }}>
                                One lower-case letter
                            </li>
                            <li style={specialChar ? { color: "#36b34a" } : { color: "#666666" }}>
                                One special character
                            </li>
                        </ul>
                    </div>
                </div>
                <button type="submit" className="py-3 my-4" style={buttonStyle} onClick={handleSubmit}
                    disabled={!email || !password || !validLength || !hasNumber || !lowerCase || !upperCase || !specialChar}>
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

        if (!validLength) {
            message.error('Password must be at least 8 characters long!', 3);
            return;
        }

        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            // console.log("USER", result);
            if (result.user.emailVerified) {
                window.localStorage.removeItem("emailForSignup");
                let user = auth.currentUser;
                await user.updatePassword(password);
                const idTokenResult = await user.getIdTokenResult();
                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        dispatch({
                            type: "CURRENT_USER",
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                username: res.data.username,
                                picture: res.data.picture,
                                _id: res.data._id,
                                token: idTokenResult.token,
                                address: res.data.address,
                                privateKey: res.data.privateKey
                            },
                        });
                    })
                    .catch((error) => {
                        console.log(error.message)
                        setButtonLabel('Complete Sign Up');
                    });
                message.loading('Signing up in progress..', 2)
                    .then(() => message.success('Sign-up Success! ', 3))
                    .then(() => {
                        message.loading('Redirecting..', 4)
                        setTimeout(() => {
                            history.push('/')
                        }, 7000)
                    });
            }
        }
        catch (error) {
            console.log(error.message)
            message.error('Link expired or has already been used!', 3);
            setButtonLabel('Complete Sign Up');
        }
    }


    return (
        <div className="my-5">
            <div className="row my-5 justify-content-center">
                <div className="col-sm-4">
                    <div className="container my-1">
                        <h2><b>Complete Sign Up</b></h2>
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