import React, { useState } from 'react';
import InActiveFavButton from './heart-icon/InActiveHeart';
import ActiveFavButton from './heart-icon/ActiveHeart';
import { useSelector } from "react-redux";

import { decrementFavouriteCount, getFavouriteCount, incrementFavouriteCount } from '../../helpers/asset';
import { addToFavourites, getFavourites, removeFromFavourites } from '../../helpers/users';

const FavButton = () => {

    const { user, asset } = useSelector((state) => ({ ...state }));

    const [fav, setFav] = useState(false);
    const [count, setCount] = useState(0);

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
            incrementFavouriteCount(asset._id);
            addToFavourites(user._id, asset._id, user.token);
            setTimeout(() => {
                setFav(true);
                setCount(count + 1);
            }, 500);
        }
        else {
            decrementFavouriteCount(asset._id);
            removeFromFavourites(user._id, asset._id, user.token);
            setTimeout(() => {
                setFav(false);
                setCount(count - 1);
            }, 500);
        }
    }

    return (
        <>
            <div className="col-3">
                {fav ? <ActiveFavButton handleFavButton={handleFavButton} /> : <InActiveFavButton handleFavButton={handleFavButton} disabled={user ? false : true} />}
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