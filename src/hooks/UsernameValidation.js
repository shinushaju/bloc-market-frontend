import { useState, useEffect } from "react";
import { getUsernames } from '../helpers/users';
import { useSelector } from 'react-redux';

const UsernameValidation = ({ username }) => {

    const { user } = useSelector((state) => ({ ...state }));
    const [usernames, setUsernames] = useState([]);
    const [isAvailable, setIsAvailable] = useState(null);
    const [validLength, setValidLength] = useState(null);
    const [lowerCase, setLowerCase] = useState(null);
    const [whiteSpace, hasWhiteSpace] = useState(null);

    const loadUsernames = () => {
        getUsernames(user.token)
            .then((res) => {
                const data = res.data.reduce((a, o) => (a.push(o.username)), []);
                const index = data.indexOf(user.username);
                if (index > -1) {
                    data.splice(index, 1);
                }
                setUsernames(data);
            })
    }

    useEffect(() => {
        loadUsernames();
        setIsAvailable(usernames.includes(username) ? false : true);
        setValidLength(username.length > 4 ? true : false);
        setLowerCase(username.toLowerCase() !== username ? false : true);
        hasWhiteSpace(/^[a-z0-9]+$/.test(username));
    }, [username]);

    return [isAvailable, validLength, lowerCase, whiteSpace];
}

export default UsernameValidation;