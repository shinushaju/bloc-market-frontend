import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tabs, Avatar, message, Tag, Button, Card } from 'antd';
import { LoadingOutlined, HeartOutlined } from '@ant-design/icons';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Helmet } from 'react-helmet';
import illustration from '../images/empty.png';
import FollowButton from '../components/micro-components/FollowButton';
import FollowListModal from '../components/modals/FollowListModal';

// api functions
import { getUserInfo } from '../helpers/users';
import { getMyCollections } from '../helpers/collection';
import { getMyAssets, getMyCreatedAssets } from '../helpers/asset';

const { TabPane } = Tabs;
const { Meta } = Card;

const PublicProfile = () => {

    const path = useParams();
    const { user } = useSelector((state) => ({ ...state }));

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [collections, setCollections] = useState([]);
    const [assets, setAssets] = useState([]);
    const [createdAssets, setCreatedAssets] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [following, setFollowing] = useState(false);
    const [follower, setFollower] = useState(false);
    const [followingList, setFollowingList] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const [modal, setModalVisible] = useState(false);
    const [activeKey, setKey] = useState('followers');

    const onCopyText = () => {
        message.success('Address copied!')
    };

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = () => {
        getUserInfo(path.username)
            .then((res) => {
                if (res.data) {
                    if (user) {
                        res.data.followers.find((follower) => {
                            if (follower._id === user._id) {
                                setFollowing(true);
                            }
                        });
                        res.data.following.find((following) => {
                            if (following._id === user._id) {
                                setFollower(true);
                            }
                        });
                    }
                    setUserInfo(res.data);
                    setFavourites(res.data.favourites);
                    setFollowingList(res.data.following);
                    setFollowersList(res.data.followers);
                    loadUserCollectionsAndAssets(res.data._id);
                }
            })
        setTimeout(() => {
            setLoading(true);
        }, 2000);
    }

    const loadUserCollectionsAndAssets = (id) => {
        getMyCollections(id)
            .then((res) => {
                setCollections(res.data);
            })

        getMyAssets(id)
            .then((res) => {
                setAssets(res.data);
            })

        getMyCreatedAssets(id)
            .then((res) => {
                setCreatedAssets(res.data);
                console.log("CREATED", res.data)
            })
    }

    const followingListModal = () => {
        setKey('following');
        setModalVisible(true);
    }

    const followerListModal = () => {
        setKey('followers');
        setModalVisible(true);
    }

    return (
        <>
            {!loading &&
                <div className="container-fluid py-5">
                    <div className="my-5" style={{ position: 'absolute', top: '36%', fontSize: "300%", fontWeight: "bold", left: '48%', msTransform: 'translateY(-50%)', transform: 'transalateY(-50%)' }}>
                        <LoadingOutlined />
                    </div>
                </div>
            }
            {loading && !userInfo &&
                <div className="container-fluid py-5">
                    <div className="my-5" style={{ textAlign: "center", position: 'absolute', top: '5%', fontSize: "300%", fontWeight: "bold", left: '40%', msTransform: 'translateY(-50%)', transform: 'transalateY(-50%)' }}>
                        <img src={illustration} height="400px" width="auto" alt="Page Not Found" />
                        <h4>Profile Not Found!</h4>
                        <Link to="/">
                            <Button type="primary" size="large">Redirect to Home</Button>
                        </Link>
                    </div>
                </div>
            }
            {loading && userInfo &&
                <>
                    <Helmet>
                        <title>{userInfo.name} | Bloc | Market</title>
                    </Helmet>
                    <div className="container-fluid my-5">
                        <div className="row p-4 m-4">
                            <div className="col-3">
                                <div className="px-1">
                                    <div className="m-3">
                                        <Avatar src={userInfo.picture} size={130} />
                                        <div style={{ marginTop: "18px" }}>
                                            <Button size="large" shape="round" style={{ opacity: 1, background: "#ffffff", border: "none", color: "#050D1B", boxShadow: "rgba(0, 0, 0, 0.1) -4px 7px 25px -6px" }}>
                                                {userInfo.address.substring(0, 6) + '...' + userInfo.address.substring(36, 42)} &emsp;
                                                <CopyToClipboard text={`0x${userInfo.address}`} onCopy={onCopyText}>
                                                    <span style={{ marginTop: "-8px", background: "#050D1B", position: "absolute", height: "40px", width: "64px", marginLeft: "-12px", border: "none", color: "#ffffff", borderRadius: "100px" }}>
                                                        <div style={{ marginTop: "8px" }}>Copy</div>
                                                    </span>
                                                </CopyToClipboard>
                                            </Button>
                                        </div>
                                        <div style={{ fontSize: "220%", fontWeight: "bold", marginTop: "14px" }}>{userInfo.name.substring(0, 14)}</div>
                                        <span style={{ fontSize: "larger" }}>@{userInfo.username.substring(0, 14)}</span>&ensp;

                                        {user && user.token && user._id !== userInfo._id &&
                                            <Tag color="geekblue" style={{ padding: "2px 4px", borderRadius: "4px", display: follower ? 'inline' : 'none' }}>Follows you</Tag>
                                        }

                                        {user && user.token && user._id !== userInfo._id &&
                                            <div className="my-3">
                                                <FollowButton following={following} profile={userInfo} reload={loadUserInfo} />
                                            </div>
                                        }

                                        <div className="row my-4">
                                            <div className="col-6">
                                                <div onClick={followingListModal} style={{ cursor: "pointer" }}>
                                                    <div style={{ fontSize: "200%", margin: "0", fontWeight: "700", color: "#050D1B" }}>{followingList.length}</div>
                                                    <div style={{ fontSize: "120%", color: "#666666", fontWeight: "500", marginTop: "-8px" }}>Following</div>
                                                </div>
                                            </div>
                                            <div className="col" onClick={followerListModal} style={{ cursor: "pointer" }}>
                                                <div style={{ fontSize: "200%", margin: "0", fontWeight: "700", color: "#050D1B" }}>{followersList.length}</div>
                                                <div style={{ fontSize: "120%", color: "#666666", fontWeight: "500", marginTop: "-8px" }}>Followers</div>
                                            </div>
                                        </div>

                                        {followersList.length > 0 &&
                                            <div className="my-5">
                                                <h5>Followed By</h5>
                                                <div className="my-3">
                                                    <Avatar.Group
                                                        size="large"
                                                        maxCount={5}
                                                        maxStyle={{
                                                            color: '#f56a00',
                                                            backgroundColor: '#fde3cf',
                                                        }}
                                                    >
                                                        {followersList.slice(0, 8).map((follower) =>
                                                            <a href={`/${follower.username}/profile`}>
                                                                <Avatar style={{ border: "3px solid #ffffff" }} src={follower.picture} />
                                                            </a>
                                                        )}
                                                    </Avatar.Group>
                                                </div>
                                                <div className="my-2" onClick={followerListModal} style={{ cursor: "pointer", fontSize: "120%", fontWeight: "500", color: "#666666" }}>
                                                    View All
                                            </div>
                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="col" style={{ width: "100%", margin: "0" }}>

                                <Tabs size="large">
                                    <TabPane
                                        tab={
                                            <span>Collections ({collections.length})</span>
                                        }
                                        key="collections"
                                    >
                                        <div className="row">
                                            {collections.length <= 0 && (
                                                <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                                                    <h3>No Collections Yet!</h3>
                                                </div>
                                            )}

                                            {collections.map((collection) => (
                                                <div key={collection._id} className="col-sm-4 my-2">
                                                    <Card
                                                        hoverable
                                                        cover={
                                                            <Link to={`/collections/${collection.slug}`}>
                                                                <img
                                                                    width="100%"
                                                                    style={{ height: "250px", width: "100%", objectFit: "cover", backgroundSize: "cover" }}
                                                                    height="auto"
                                                                    alt="Collection name"
                                                                    src={collection.cover}
                                                                />
                                                            </Link>
                                                        }
                                                    >
                                                        <Meta title={<b>{collection.name}</b>} />
                                                    </Card>
                                                </div>
                                            ))}
                                        </div>
                                    </TabPane>
                                    <TabPane
                                        tab={
                                            <span>Owned ({assets.length})</span>
                                        }
                                        key="owned"
                                    >
                                        <div className="row">
                                            {assets.length <= 0 && (
                                                <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                                                    <h3>No Items Yet!</h3>
                                                </div>
                                            )}

                                            {assets.map((asset) => (
                                                <div key={asset._id} className="col-sm-4 my-2">
                                                    <Card
                                                        bordered
                                                        style={{ width: "100%" }}
                                                        cover={
                                                            <Link to={`/assets/${asset.slug}`}>
                                                                <img
                                                                    width="100%"
                                                                    className="p-3"
                                                                    style={{ height: "250px", width: "100%", objectFit: "cover", backgroundSize: "cover", borderRadius: "24px" }} height="auto"
                                                                    alt={asset.name}
                                                                    src={asset.assetFile}
                                                                />
                                                            </Link>
                                                        }
                                                    >
                                                        <Meta
                                                            style={{ marginTop: "-24px" }}
                                                            title={<div style={{ fontSize: "130%" }}>{asset.name}</div>}
                                                            description={
                                                                <>
                                                                    <span style={{ fontSize: "75%" }}>List price</span>
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            {!asset.isListed && <>--</>}
                                                                            {asset.isListed &&
                                                                                <div style={{ fontSize: "120%", color: "#000000", fontWeight: "700" }}>
                                                                                    {asset.price} BLC
                                                </div>
                                                                            }
                                                                        </div>
                                                                        <div className="col">
                                                                            <b style={{ float: "right", color: "#333333" }}><HeartOutlined /> {asset.favourites}</b>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            }
                                                        />
                                                    </Card>
                                                </div>
                                            ))}
                                        </div>
                                    </TabPane>

                                    <TabPane
                                        tab={
                                            <span>Created ({createdAssets.length})</span>
                                        }
                                        key="created"
                                    >
                                        <div className="row">
                                            {createdAssets.length <= 0 && (
                                                <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                                                    <h3>No Items Yet!</h3>
                                                </div>
                                            )}

                                            {createdAssets.map((asset) => (
                                                <div key={asset._id} className="col-sm-4 my-2">
                                                    <Card
                                                        bordered
                                                        style={{ width: "100%" }}
                                                        cover={
                                                            <Link to={`/assets/${asset.slug}`}>
                                                                <img
                                                                    width="100%"
                                                                    className="p-3"
                                                                    style={{ height: "250px", width: "100%", objectFit: "cover", backgroundSize: "cover", borderRadius: "24px" }} height="auto"
                                                                    alt={asset.name}
                                                                    src={asset.assetFile}
                                                                />
                                                            </Link>
                                                        }
                                                    >
                                                        <Meta
                                                            style={{ marginTop: "-24px" }}
                                                            title={<div style={{ fontSize: "130%" }}>{asset.name}</div>}
                                                            description={
                                                                <>
                                                                    <span style={{ fontSize: "75%" }}>List price</span>
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            {!asset.isListed && <>--</>}
                                                                            {asset.isListed &&
                                                                                <div style={{ fontSize: "120%", color: "#000000", fontWeight: "700" }}>
                                                                                    {asset.price} BLC
                                                </div>
                                                                            }
                                                                        </div>
                                                                        <div className="col">
                                                                            <b style={{ float: "right", color: "#333333" }}><HeartOutlined /> {asset.favourites}</b>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            }
                                                        />
                                                    </Card>
                                                </div>
                                            ))}
                                        </div>
                                    </TabPane>

                                    <TabPane
                                        tab={
                                            <span>Favourites</span>
                                        }
                                        key="favourites"
                                    >
                                        <div className="row">
                                            {favourites.length <= 0 && (
                                                <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                                                    <h3>No Favourites Yet!</h3>
                                                </div>
                                            )}
                                            {favourites.map((asset) =>
                                                <div key={asset._id} className="col-sm-4 my-2">
                                                    <Card
                                                        bordered
                                                        style={{ width: "100%" }}
                                                        cover={
                                                            <Link to={`/assets/${asset.slug}`}>
                                                                <img
                                                                    width="100%"
                                                                    className="p-3"
                                                                    style={{ height: "250px", width: "100%", objectFit: "cover", backgroundSize: "cover", borderRadius: "24px" }}
                                                                    height="auto"
                                                                    alt={asset.name}
                                                                    src={asset.assetFile}
                                                                />
                                                            </Link>
                                                        }
                                                    >
                                                        <Meta
                                                            style={{ marginTop: "-24px" }}
                                                            title={<div style={{ fontSize: "130%" }}>{asset.name}</div>}
                                                            description={
                                                                <>
                                                                    <a href={`/${asset.owner.username}/profile`}>
                                                                        <div className="row my-2">
                                                                            <div className="col-2">
                                                                                <Avatar size="default" src={asset.owner.picture} />
                                                                            </div>
                                                                            <div className="col">
                                                                                <div style={{ fontSize: "small", fontWeight: "600", color: "#333333" }}>
                                                                                    {userInfo &&
                                                                                        <>{asset.owner._id === userInfo._id ? "you" : asset.owner.username}</>
                                                                                    }
                                                                                    {!userInfo &&
                                                                                        <>{asset.owner}</>
                                                                                    }
                                                                                </div>
                                                                                <div style={{ fontSize: "80%", fontWeight: "500", marginTop: "-2px", color: "#999999" }}>Owner</div>
                                                                            </div>
                                                                        </div>
                                                                    </a>
                                                                    <span style={{ fontSize: "75%" }}>List price</span>
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <div style={{ fontSize: "120%", color: "#000000", fontWeight: "700" }}>
                                                                                3.05 BLC
                                                                </div>
                                                                        </div>
                                                                        <div className="col">
                                                                            <b style={{ float: "right", color: "#333333" }}><HeartOutlined /> {asset.favourites}</b>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            }
                                                        />
                                                    </Card>
                                                </div>
                                            )}
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <FollowListModal modal={modal} following={followingList} reload={loadUserInfo} activeKey={activeKey} userInfo={userInfo} followers={followersList} setModalVisible={setModalVisible} />
                </>
            }
        </>
    )
}

export default PublicProfile;