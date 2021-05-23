import React from 'react';
import { useSelector } from 'react-redux';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Avatar, Tag, message } from 'antd';
import { Link } from 'react-router-dom';

const Profile = () => {

    const { user } = useSelector((state) => ({ ...state }));

    const onCopyText = () => {
        message.success('Address copied!')
    };

    return (
        <div className="m-5">
                <Avatar
                    src={user.picture}
                    size={100}
                />
                <div style={{fontSize: "220%", fontWeight: "bold", marginTop: 16}}>{user.name}</div>
                <div style={{color: "#666666"}}>@{user.username}</div>
                <CopyToClipboard text={`${user._id}`} onCopy={onCopyText}>
                    <Tag style={{ marginTop: 8, cursor: "pointer", border: "1px solid #050D1B", borderRadius: "100px", background: "#FFFFFF", padding: "4px 12px", color: "#050D1B", fontSize: "75%" }}>Copy address</Tag>
                </CopyToClipboard>
                <div className="my-3">
                    {user && (
                        <Link to={`/${user.username}/profile`}>
                            View Public Profile
                        </Link>
                    )}
                </div>
        </div>
    )
}

export default Profile;