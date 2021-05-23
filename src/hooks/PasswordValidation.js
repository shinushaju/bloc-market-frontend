import { useState, useEffect } from "react";

const PasswordValidation = ({ password = "", email }) => {
    const [validContent, setValidContent] = useState(null);
    const [validLength, setValidLength] = useState(null);
    const [hasNumber, setHasNumber] = useState(null);
    const [upperCase, setUpperCase] = useState(null);
    const [lowerCase, setLowerCase] = useState(null);
    const [specialChar, setSpecialChar] = useState(null);

    useEffect(() => {
        setValidContent(password.includes(email.split("@")[0]) ? false : true);
        setValidLength(password.length >= 8 ? true : false);
        setUpperCase(password.toLowerCase() !== password);
        setLowerCase(password.toUpperCase() !== password);
        setHasNumber(/\d/.test(password));
        setSpecialChar(/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password));
    }, [password]);

    return [validContent, validLength, hasNumber, upperCase, lowerCase, specialChar];
}

export default PasswordValidation;