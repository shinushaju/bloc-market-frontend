import React from 'react';
import { Modal, Tabs, Avatar } from 'antd';
const { TabPane } = Tabs;

const FollowListModal = ({ modal, following, activeKey, followers, setModalVisible }) => {

    return (
        <Modal
            closable
            centered
            maskClosable={false}
            width="360px"
            destroyOnClose
            bodyStyle={{ height: "500px" }}
            onCancel={() => setModalVisible(false)}
            footer={null}
            visible={modal}>
            <Tabs defaultActiveKey={activeKey}>
                <TabPane tab="Following" key="following">
                    <div style={{ overflowY: "scroll", height: "380px" }} className="scrollbar">
                        {following.length === 0 &&
                            <div style={{ margin: "auto", textAlign: "center", paddingTop: "30px", display: "block" }}>No Following</div>
                        }
                        {following.map((follower) =>
                            <div className="pb-3">
                                <a href={`/${follower.username}/profile`}>
                                    <Avatar size="large" src={follower.picture} />
                            &emsp;
                            <span style={{ fontSize: "120%", color: "#000000", fontWeight: "400" }}>{follower.name}</span>
                                </a>
                            </div>
                        )}
                    </div>
                </TabPane>
                <TabPane tab="Followers" key="followers">
                    <div style={{ overflowY: "scroll", height: "400px" }} className="scrollbar">
                        {followers.length === 0 &&
                            <div style={{ margin: "auto", textAlign: "center", paddingTop: "30px", display: "block" }}>No Followers</div>
                        }
                        {followers.map((follower) =>
                            <div className="pb-3">
                                <a href={`/${follower.username}/profile`}>
                                    <Avatar size="large" src={follower.picture} />
                            &emsp;
                            <span style={{ fontSize: "120%", color: "#000000", fontWeight: "400" }}>{follower.name}</span>
                                </a>
                            </div>
                        )}
                    </div>
                </TabPane>
            </Tabs>
        </Modal >
    )
}

export default FollowListModal;