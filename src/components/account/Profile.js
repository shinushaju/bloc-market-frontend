import React from 'react';
import { useSelector } from 'react-redux';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Avatar, Tag, message, Button } from 'antd';
import { Link } from 'react-router-dom';

const Profile = () => {

    const { user } = useSelector((state) => ({ ...state }));

    const onCopyText = () => {
        message.success('Address copied!')
    };

    return (
        <div className="m-5">
            <Avatar src={user.picture} size={130} />
            <div style={{ marginTop: "18px" }}>
                <Button size="large" shape="round" style={{ opacity: 1, background: "#ffffff", border: "none", color: "#050D1B", boxShadow: "rgba(0, 0, 0, 0.1) -4px 7px 25px -6px" }}>
                    0x{user._id.substring(0, 6) + '...' + user._id.substring(18, 24)} &emsp;
                     <CopyToClipboard text={`0x${user._id}`} onCopy={onCopyText}>
                        <span style={{ marginTop: "-8px", background: "#050D1B", position: "absolute", height: "40px", width: "64px", marginLeft: "-12px", border: "none", color: "#ffffff", borderRadius: "100px" }}>
                           <div style={{marginTop: "6px"}}>Copy</div>
                        </span>
                    </CopyToClipboard>
                </Button>
            </div>
            <div style={{ fontSize: "220%", fontWeight: "bold", marginTop: "14px" }}>{user.name.substring(0, 14)}</div>
            <div style={{ fontSize: "larger" }}>@{user.username.substring(0, 14)}</div>

            <div className="my-3">
                {user && (
                    <Link to={`/${user.username}/profile`}>
                        Preview Profile
                    </Link>
                )}
            </div>
            <div className="my-3">
                {user && (
                    <Link to='/settings/account/profile/edit'>
                        <Button style={{ background: "#000000", color: "#ffffff" }}>Edit Profile</Button>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Profile;