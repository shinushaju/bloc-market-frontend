import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tabs, Avatar, message, Button, Tag, Row, Col, Statistic, Card, Divider } from 'antd';
import { LoadingOutlined, HeartOutlined } from '@ant-design/icons';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Helmet } from 'react-helmet';
import illustration from '../images/empty.png';

// api functions
import { getUserInfo } from '../helpers/users';
import { getMyCollections } from '../helpers/collection';
import { getMyAssets } from '../helpers/asset';

const { TabPane } = Tabs;
const { Meta } = Card;

const PublicProfile = () => {

    const path = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [collections, setCollections] = useState([]);
    const [assets, setAssets] = useState([]);
    const [favourites, setFavourites] = useState([]);

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
                    setUser(res.data);
                    setFavourites(res.data.favourites);
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
                setAssets(res.data)
            })
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
            {loading && !user &&
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
            {loading && user &&
                <>
                    <Helmet>
                        <title>{user.name} | Bloc | Market</title>
                    </Helmet>
                    <div className="container-fluid my-5">
                        <div className="row p-4 m-4">
                            <div className="col-3">
                                <div className="px-1">
                                    <div className="m-3">
                                        <Avatar
                                            src={user.picture}
                                            size={100}
                                        />
                                        <div style={{ fontSize: "220%", fontWeight: "bold", marginTop: 16 }}>{user.name}</div>
                                        <div style={{ color: "#666666" }}>@{user.username}</div>
                                        <CopyToClipboard text={`${user._id}`} onCopy={onCopyText}>
                                            <Tag style={{ marginTop: 8, cursor: "pointer", borderRadius: "100px", border: "1px solid #050D1B", background: "#FFFFFF", padding: "4px 12px", color: "#050D1B", fontSize: "75%" }}>Copy address</Tag>
                                        </CopyToClipboard>
                                        <Divider />
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Statistic title={<small>COLLECTIONS</small>} value={collections.length} valueStyle={{ fontSize: "250%", fontWeight: "600" }} />
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title={<small>OWNED ITEMS</small>} value={assets.length} valueStyle={{ fontSize: "250%", fontWeight: "600" }} />
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                            <div className="col" style={{ width: "100%", margin: "0" }}>

                                <Tabs size="large">
                                    <TabPane
                                        tab={
                                            <span>
                                                <span>Collections</span>
                                            </span>
                                        }
                                        key="1"
                                    >
                                        <div className="row">
                                            {collections.length <= 0 && (
                                                <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                                                    <h3>No Collections Yet!</h3>
                                                </div>
                                            )}

                                            {collections.map((collection) => (
                                                <div className="col-sm-4 my-2">
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
                                            <span>
                                                <span>Owned Items</span>
                                            </span>
                                        }
                                        key="2"
                                    >
                                        <div className="row">
                                            {assets.length <= 0 && (
                                                <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                                                    <h3>No Items Yet!</h3>
                                                </div>
                                            )}

                                            {assets.map((asset) => (
                                                <div className="col-sm-4 my-2">
                                                    <Card
                                                        key={asset._id}
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
                                            <span>
                                                <span>Favourites</span>
                                            </span>
                                        }
                                        key="5"
                                    >
                                        <div className="container-fluid py-2">
                                            <div className="row">
                                                {favourites.length <= 0 && (
                                                    <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                                                        <h3>No Favourites Yet!</h3>
                                                    </div>
                                                )}


                                                {favourites.map((asset) =>
                                                    <div className="col-sm-4 my-3">
                                                        <Card
                                                            key={asset._id}
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
                                                                                        {user &&
                                                                                            <>{asset.owner._id === user._id ? "you" : asset.owner.username}</>
                                                                                        }
                                                                                        {!user &&
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
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default PublicProfile;