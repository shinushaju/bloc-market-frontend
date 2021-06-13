import React, { useEffect, useState } from 'react';
import InActiveFavButton from './heart-icon/InActiveHeart';
import ActiveFavButton from './heart-icon/ActiveHeart';
import { useSelector } from "react-redux";

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
            setOnWait(true);
            incrementFavouriteCount(asset._id)
                .then((res) => {
                    addToFavourites(user._id, asset._id, user.token);
                    setFav(true);
                    setCount(res.data.favourites);
                    setTimeout(() => {
                        setOnWait(false);
                    }, 500)
                })
        }
        else {
            setOnWait(true);
            decrementFavouriteCount(asset._id)
                .then((res) => {
                    removeFromFavourites(user._id, asset._id, user.token);
                    setFav(false);
                    setCount(res.data.favourites);
                    setTimeout(() => {
                        setOnWait(false);
                    }, 500)
                })

        }
    }

    return (
        <>
            <div className="col-3">
                {fav ? <ActiveFavButton handleFavButton={handleFavButton} disabled={noUser || onWait} /> : <InActiveFavButton handleFavButton={handleFavButton} disabled={noUser || onWait} />}
            </div>
            <div className="col-9">
                <div className="mx-3">
                    <b style={{ fontSize: "175%" }}>{count}</b>
                    <div>Favourites</div>
                </div>
            </div>
        </>
    )
}

export default FavButton;