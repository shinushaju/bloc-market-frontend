import React from 'react';
import { Layout, Typography, Alert, Avatar } from 'antd';
import { Link } from 'react-router-dom';
const { Title } = Typography;

const Notifications = () => {

    const notifications = [];

    {
        for (let i = 0; i < 3; i++) {
            notifications.push({
                userImage: 'https://www.cryptokitties.co/profile/profile-19.png',
                userName: 'johndoe',
                event: 'accepted your offer for about $793 on',
                item: 'orc',
                date: '20 minutes ago'
            },
                {
                    userImage: 'https://www.cryptokitties.co/profile/profile-20.png',
                    userName: 'ronik',
                    event: 'made an offer for about $8 on',
                    item: 'meton',
                    date: '50 minutes ago'
                }
            )
        }
    }

    return (
        <Layout style={{ background: "#ffffff" }}>
            <div className="container-fluid my-5">
                <div className="row p-5 my-2">
                    <Title className="px-5 mx-2">Notifications</Title>
                    <div className="container my-3">
                        <div className="row" type="flex">
                            {notifications.map((item) =>

                                <Alert closable className="my-2 align-items-center" style={{ width: "100%", border: "1px solid #B3D4FF", fontSize: "120%", background: "#f2f7ff", borderRadius: "16px" }}
                                    description={
                                        <div className="row">
                                            <div className="col-1 px-3">
                                                <Avatar size="large" src={item.userImage} />
                                            </div>
                                            <div className="col" style={{fontSize: "120%"}}>
                                                <Link href=""> {item.userName} </Link> {item.event} <Link href="activity"> {item.item} </Link>
                                                <div style={{ fontSize: "60%", color: "#666666", textTransform: "uppercase" }}> {item.date}</div>
                                            </div>
                                        </div>
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Notifications;