import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Avatar, Button, Badge, Tag, Empty } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { createBrowserHistory } from 'history';
import { LoadingOutlined, WalletTwoTone } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { newNotifications, markNotificationsAsRead, markOneNotificationAsRead } from '../../helpers/notification';

const Notifications = () => {

    moment().format();
    const history = createBrowserHistory();
    const { user } = useSelector((state) => ({ ...state }));

    const [notifications, setNotifications] = useState([]);
    const [badge, setBadge] = useState(false);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        setInterval(() => {
            newNotifications(user._id, user.token)
                .then((res) => {
                    setNotifications(res.data);
                    setLoading(true);
                    if (res.data.length > 0) {
                        setBadge(true);
                        setCount(res.data.length);
                    } else {
                        setBadge(false);
                    }
                })
        }, 3500)
    }, [])

    const handleMarkRead = () => {
        markNotificationsAsRead(user._id, user.token);
        setCount(0);
        setBadge(false);
        setNotifications([]);
    }

    const handleItemClicked = (item) => {
        if (item.event === 'Offer Made' || item.event === 'Offer Accepted' || item.event === 'Offer Rejected') {
            history.push(`/assets/${item.asset_slug}`);
        }
        if (item.event === 'New Follow') {
            history.push(`/${item.sender_username}/profile`);
        }
        if (item.event === 'Ownership Transferred' || item.event === 'Token Deposited' && user) {
            history.push('/wallet');
        }
        markOneNotificationAsRead(user._id, item._id, user.token);
        window.location.reload();
    }


    const notificationType = (item) => {
        if (item.event === 'Offer Made') {
            return (
                <div><Tag size="small" style={{ float: "left" }} color="geekblue">New Offer</Tag></div>
            )
        }
        if (item.event === 'Offer Rejected') {
            return (
                <div><Tag size="small" style={{ float: "left" }} color="volcano">Rejected</Tag></div>
            )
        }
        if (item.event === 'Offer Accepted') {
            return (
                <div><Tag size="small" style={{ float: "left" }} color="green">Accepted</Tag></div>
            )
        }
        if (item.event === 'Ownership Transferred') {
            return (
                <div><Tag size="small" style={{ float: "left" }} color="purple">Transferred</Tag></div>
            )
        }
    }

    const menu = (
        <Menu>
            <div className="row p-3">
                <div className="col-6">
                    <h5 style={{ fontWeight: "400" }}>New Notifications</h5>
                </div>
                {notifications.length > 0 &&
                    <div className="col">
                        <Button style={{ float: "right" }} onClick={handleMarkRead}>Mark all as read</Button>
                    </div>
                }
            </div>
            {!loading &&
                <div className="container my-5 p-5">
                    <div style={{ position: 'absolute', top: '45%', fontSize: "200%", fontWeight: "bold", left: '45%', msTransform: 'translateY(-50%)', transform: 'transalateY(-50%)' }}>
                        <LoadingOutlined />
                    </div>
                </div>
            }
            {loading && notifications.length === 0 &&
                <div className="pb-4">
                    <Empty description="No New Notifications" />
                </div>
            }
            {loading && notifications.length > 0 && notifications.slice(0, 10).map((item) =>
                <>
                    <Menu.Item key={item._id} style={{ background: "#ffffff" }} onClick={() => handleItemClicked(item)} className="mx-3 my-2 px-0">
                        <div className="row">
                            <div className="col-1" >
                                <Avatar size="default" src={item.event === 'Token Deposited' ? <WalletTwoTone twoToneColor="#3F2BE5" style={{ fontSize: "130%" }} /> : item.sender_picture} style={{ backgroundColor: '#ebe9fc' }} />
                            </div>
                            <div className="col-7 mx-2" style={{ whiteSpace: "break-spaces", fontWeight: '450', color: item.is_read ? '#999999' : '#000000' }}>
                                {item.notification.length < 72 ? <>{item.notification}</> : <>{item.notification.substring(0, 72) + '...'}</>}
                                <div style={{ fontSize: "86%", fontWeight: "normal", color: "#999999" }}>
                                    {moment.utc(item.createdAt).local().startOf('seconds').fromNow()}
                                </div>
                            </div>
                            <div className="col-3">
                                {notificationType(item)}
                            </div>
                        </div>
                    </Menu.Item>
                </>
            )}
            <Menu.Item key="3" className="py-2" style={{ color: "#ddd", textAlign: "center" }}><Link to="/notifications">View All Notifications</Link></Menu.Item>
        </Menu>
    );

    return (
        <Dropdown arrow placement="bottomCenter" overlay={menu} overlayStyle={{ width: "400px" }}>
            <Badge count={count} size="small" style={{ display: !badge ? "none" : "block" }}>
                <a style={{ fontWeight: "400", fontSize: "medium" }} className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    Notifications
                </a>
            </Badge>
        </Dropdown>
    )
}

export default Notifications;