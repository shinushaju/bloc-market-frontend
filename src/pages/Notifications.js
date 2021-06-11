import React, { useState, useEffect } from 'react';
import { Layout, Typography, Alert, Empty, Avatar, Button, Divider, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getNotifications, markNotificationsAsRead, markOneNotificationAsRead, deleteAllNotificatons } from '../helpers/notification';
import { LoadingOutlined } from '@ant-design/icons';
const { Title } = Typography;
const { Content } = Layout;

const Notifications = ({ history }) => {


    moment().format();
    const { user } = useSelector((state) => ({ ...state }));
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setInterval(() => {
            getNotifications(user._id, user.token)
                .then((res) => {
                    setNotifications(res.data);
                    setLoading(true);
                })
        }, 3500)

        console.log(notifications)
    }, [])

    const notificationType = (item) => {
        if (item.event === 'New Follow') {
            return (
                <div><Tag size="small" style={{ float: "right" }} color="gold">New Follower</Tag></div>
            )
        }
        if (item.event === 'Offer Made') {
            return (
                <div><Tag size="small" style={{ float: "right" }} color="geekblue">New Offer</Tag></div>
            )
        }
        if (item.event === 'Offer Rejected') {
            return (
                <div><Tag size="small" style={{ float: "right" }} color="volcano">Offer Rejected</Tag></div>
            )
        }
        if (item.event === 'Offer Accepted') {
            return (
                <div><Tag size="small" style={{ float: "right" }} color="green">Accepted</Tag></div>
            )
        }
        if (item.event === 'Ownership Transferred') {
            return (
                <div><Tag size="small" style={{ float: "right" }} color="purple">Transferred</Tag></div>
            )
        }
    }

    const handleMarkRead = () => {
        markNotificationsAsRead(user._id, user.token);
    }

    const clearNotifications = () => {
        deleteAllNotificatons(user._id, user.token);
        setTimeout(() => {
            setNotifications([]);
        }, 1500)
    }

    const handleItemClicked = (item) => {
        if (item.event === 'Offer Made' || item.event === 'Offer Accepted' || item.event === 'Offer Rejected') {
            history.push(`/assets/${item.asset_slug}`);
        }
        if (item.event === 'New Follow') {
            history.push(`/${item.sender_username}/profile`);
        }
        if (item.event === 'Ownership Transferred' && user && user.token) {
            history.push(`/wallet`);
        }
        markOneNotificationAsRead(user._id, item._id, user.token);
    }


    return (
        <Layout>
            <div className="container-fluid py-5 mt-5">
                <Content className="my-4" style={{ display: "block", margin: "auto", minHeight: "500px", width: "650px", padding: '24px', background: "#ffffff", borderRadius: "12px" }}>
                    <div className="row">
                        <div className="col-6">
                            <h3 style={{ fontWeight: "400" }}>Latest Notifications</h3>
                        </div>
                        {notifications.length > 0 &&
                            <div className="col">
                                <Button type="primary" style={{ float: "right" }} onClick={clearNotifications}>Clear All</Button>
                                <Button className="mx-2" style={{ float: "right" }} onClick={handleMarkRead}>Mark all as read</Button>
                            </div>
                        }
                    </div>
                    {!loading &&
                        <div className="container my-5 p-5">
                            <div style={{ position: 'absolute', top: '50%', fontSize: "200%", fontWeight: "bold", left: '48%', msTransform: 'translateY(-50%)', transform: 'transalateY(-50%)' }}>
                                <LoadingOutlined />
                            </div>
                        </div>
                    }
                    {loading && notifications.length === 0 &&
                        <div className="p-5 my-5">
                            <Empty description="You don't have any notifications!" />
                        </div>
                    }
                    <div className="my-3 px-3">
                        {loading && notifications.length > 0 && notifications.sort((a, b) => (a.is_read < b.is_read) ? -1 : 1).map((item) =>
                            <div key={item._id} className="row py-3 px-0 my-2" onClick={() => handleItemClicked(item)} style={{ cursor: "pointer", background: item.is_read ? "#ffffff" : "#f4f9f9", borderRadius: "12px" }}>
                                <div className="col-1" >
                                    <Avatar size="default" src={item.sender_picture} />
                                </div>
                                <div className="col" style={{ whiteSpace: "break-spaces", fontWeight: item.is_read ? '400' : '450' }}>
                                    <div className="row">
                                        <div className="col-8">
                                            {item.notification}
                                            <div style={{ fontSize: "86%", fontWeight: "normal", color: "#999999" }}>
                                                {moment.utc(item.createdAt).local().startOf('seconds').fromNow()}
                                            </div>
                                        </div>
                                        <div className="col">
                                            {notificationType(item)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Content>
            </div>
        </Layout>
    )
}

export default Notifications;