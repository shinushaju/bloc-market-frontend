import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { addFollowerHandler, addFollowingHandler, removeFollowerHandler, removeFollowingHandler } from '../../helpers/users';
import { newFollowNotification } from '../../helpers/notification';

const FollowButton = ({ following, profile, reload }) => {

    const { user } = useSelector((state) => ({ ...state }));
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        setIsFollowing(following);
    }, [])

    const handleFollow = () => {
        addFollowingHandler(user._id, profile._id, user.token)
            .then(() => {
                reload();
            });
        addFollowerHandler(user._id, profile._id, user.token)
            .then(() => {
                newFollowNotification({ sender: user._id, sender_name: user.name, sender_picture: user.picture, sender_username: user.username, receiver: profile._id, event: 'New Follow' }, user.token)
                reload();
                setIsFollowing(true);
            });
    }

    const handleUnfollow = () => {
        removeFollowingHandler(user._id, profile._id, user.token)
            .then(() => {
                reload();
            });
        removeFollowerHandler(user._id, profile._id, user.token)
            .then(() => {
                reload();
                setIsFollowing(false);
            });
    }
    return (
        <Button
            className="px-4"
            size="large"
            shape="round"
            style={{ border: "1px solid #050D1B", color: isFollowing ? '#ffffff' : '#050D1B', background: isFollowing ? '#050D1B' : '#ffffff' }}
            onClick={isFollowing ? handleUnfollow : handleFollow}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </Button>
    )
}

export default FollowButton;