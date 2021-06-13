import React, { useEffect, useState } from 'react';
import InActiveFavButton from './heart-icon/InActiveHeart';
import ActiveFavButton from './heart-icon/ActiveHeart';
import { useSelector } from "react-redux";
import { Layout, Avatar, Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

import { decrementFavouriteCount, getFavouriteCount, incrementFavouriteCount } from '../../helpers/asset';
import { addToFavourites, getFavourites, removeFromFavourites } from '../../helpers/users';

const FavButton = () => {

    const { user, asset } = useSelector((state) => ({ ...state }));

    const [fav, setFav] = useState(false);
    const [count, setCount] = useState(0);
    const [noUser, setNoUser] = useState(true);
    const [onWait, setOnWait] = useState(false);

    useEffect(() => {
        if (user && user.token) {
            setNoUser(false);
        }
    })
    getFavouriteCount(asset._id)
        .then((res) => {
            setCount(res.data.favourites);
        });

    if (user) {
        getFavourites(user._id)
            .then((res) => {
                const favourites = [];
                const arr = res.data.favourites;
                arr.map((item) => (
                    favourites.push(item._id)
                ))
                if (favourites.includes(asset._id)) {
                    setFav(true);
                }
                else {
                    setFav(false);
                }
            })
    }


    const handleFavButton = () => {
        if (!fav) {
            //setFav(true);
            setOnWait(true);
            incrementFavouriteCount(asset._id)
                .then(() => {
                    setCount(count + 1);
                })
            addToFavourites(user._id, asset._id, user.token);
            setOnWait(false);
        }
        else {
            //setFav(false);
            setOnWait(true);
            decrementFavouriteCount(asset._id)
                .then(() => {
                    setCount(count - 1);
                })
            removeFromFavourites(user._id, asset._id, user.token);
            setOnWait(false);     
        }
    }

    return (
        <>
            <div className="col-3">
                {fav ? <Button style={{border: "none"}} shape="circle" icon={<HeartFilled size="large" style={{color: "#DE350B"}} color="#DE350B"/>} size="large"  onClick={handleFavButton} disabled={noUser || onWait} /> : <Button style={{border: "none"}} shape="circle" icon={<HeartOutlined size="large"/>} size="large"  onClick={handleFavButton} disabled={noUser || onWait} />}
            </div>
            <div className="col-9">
                <div className="mx-3 my-1">
                    <b style={{ fontSize: "150%" }}>{count}</b>
                    <div>Favourites</div>
                </div>
            </div>
        </>
    )
}

export default FavButton;