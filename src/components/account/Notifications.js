import React from 'react';
import { Menu, Dropdown, Avatar, Button } from 'antd';
import { Link } from 'react-router-dom';


const Notifications = () => {
    const menu = (
        <Menu>
            <div className="row p-3">
                <div className="col-6">
                    <h5>Notifications</h5>
                </div>
                <div className="col">
                    <Button style={{ float: "right" }}>Mark all as read</Button>
                </div>
            </div>
            <Menu.Item key="0" className="mx-3 px-0 py-3">
                <Link to="/assets/id">
                    <div className="row">
                        <div className="col-1" >
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        </div>
                        <div className="col-7 mx-2" style={{ whiteSpace: "break-spaces" }}>John Doe made an offer of 65 BLC on Googliness.</div>
                        <div className="col-3">
                            <span style={{ fontSize: "85%", float: "right", color: "#999999" }}>3 minutes ago</span>
                        </div>
                    </div>
                </Link>
            </Menu.Item>
            <Menu.Divider className="mx-3 px-0" />
            <Menu.Item key="3" className="py-2" style={{ color: "#999999", textAlign: "center" }}>View All Notifications</Menu.Item>
        </Menu>
    );

    return (
        <Dropdown arrow placement="bottomCenter" overlay={menu} overlayStyle={{ width: "400px" }} trigger={['click']}>
            <a style={{ fontWeight: "400", fontSize: "medium" }} className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                Notifications
            </a>
        </Dropdown>
    )
}

export default Notifications;