import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Avatar, Button, Badge, Tag, Empty } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { createBrowserHistory } from 'history';
import { useSelector } from 'react-redux';
import { newNotifications, markNotificationsAsRead, markOneNotificationAsRead } from '../../helpers/notification';


const Notifications = () => {

    moment().format();
    const history = createBrowserHistory();
    const { user } = useSelector((state) => ({ ...state }));

    const [notifications, setNotifications] = useState([]);
    const [badge, setBadge] = useState(false);

    useEffect(() => {
        setInterval(() => {
            newNotifications(user._id, user.token)
                .then((res) => {
                    setNotifications(res.data);
                    if (res.data.length > 0) {
                        setBadge(true);
                    } else {
                        setBadge(false);
                    }
                })
        }, 5000)
    }, [])

    const handleMarkRead = () => {
        markNotificationsAsRead(user._id, user.token);
        setBadge(false);
        setNotifications([]);
    }

    const handleItemClicked = (item) => {
        history.push(`/assets/${item.asset_slug}`);
        markOneNotificationAsRead(user._id, item._id, user.token);
        window.location.reload();
    }


    const notificationType = (item) => {
        if (item.event === 'Offer Made') {
            return (
                <div><Tag size="small" style={{ float: "left" }} color="green">New Offer</Tag></div>
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
            {notifications.length === 0 &&
                <div className="pb-4">
                    <Empty description="No New Notifications" />
                </div>
            }
            {notifications.length > 0 && notifications.slice(0, 10).map((item) =>
                <>
                    <Menu.Item key={item._id} style={{ background: "#f1f6f9", borderRadius: "8px" }} onClick={() => handleItemClicked(item)} className="mx-3 my-2 px-0 py-2">
                        <div className="row px-2">
                            <div className="col-1" >
                                <Avatar size="default" src={item.sender_picture} />
                            </div>
                            <div className="col-7 mx-2" style={{ whiteSpace: "break-spaces", fontWeight: '400', color: item.is_read ? '#999999' : '#000000' }}>
                                {item.notification}
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
            <Menu.Item disabled key="3" className="py-2" style={{ color: "#999999", textAlign: "center" }}>View All Notifications</Menu.Item>
        </Menu>
    );

    return (
        <Dropdown arrow placement="bottomCenter" overlay={menu} overlayStyle={{ width: "400px" }} trigger={['click']} >
            <Badge dot size="small" style={{ display: !badge ? "none" : "block" }}>
                <a style={{ fontWeight: "400", fontSize: "medium" }} className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    Notifications
                </a>
            </Badge>
        </Dropdown>
    )
}

export default Notifications;