import { useState, useEffect } from "react";
import { getCollectionNames } from '../helpers/collection';
import { useSelector } from 'react-redux';

const CollectionNameValidation = ({name}) => {

    const { user } = useSelector((state) => ({ ...state }));
    const [names, setNames] = useState([]);
    const [isAvailable, setIsAvailable] = useState(null);

    useEffect(() => {
        getCollectionNames(user.token)
            .then((res) => {
                const data = res.data.reduce((a, o) => (a.push(o.name), a), []);
                setNames(data);
                setIsAvailable(names.includes(name) ? false : true);
            })
    }, [name]);

    return [isAvailable];
}

export default CollectionNameValidation;