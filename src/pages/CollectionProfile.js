import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Link, useParams } from 'react-router-dom';
import { Typography, Avatar, Card, Button, Divider } from 'antd';
import { LoadingOutlined, HeartOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import illustration from '../images/empty.png';

// api functions
import { getUserInfoById } from '../helpers/users';
import { getCollection } from '../helpers/collection';
import { getMyAssetsByCollection } from '../helpers/asset';

const { Title } = Typography;
const { Meta } = Card;

const CollectionProfile = () => {

    const path = useParams();
    const { user } = useSelector((state) => ({ ...state }));

    // states
    const [owner, setOwner] = useState(null);
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        loadCollectionInfo();
    }, []);

    const loadCollectionInfo = () => {
        getCollection(path.collection)
            .then((res) => {
                if (res.data !== null) {
                    setCollection(res.data);
                    loadOwnerInfo(res.data.owner);
                    loadAssets(res.data.owner, res.data._id);
                }
                setTimeout(() => {
                    setLoading(true);
                }, 2000);
            })
    }

    const loadOwnerInfo = (id) => {
        getUserInfoById(id)
            .then((res) => {
                setOwner(res.data);
            })
    }

    const loadAssets = (id, collection) => {
        console.log(id, collection)
        getMyAssetsByCollection(id, collection)
            .then((res) => {
                setAssets(res.data);
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
            {loading && !collection &&
                <div className="container-fluid py-5">
                    <div className="my-5" style={{ textAlign: "center", position: 'absolute', top: '5%', fontSize: "300%", fontWeight: "bold", left: '40%', msTransform: 'translateY(-50%)', transform: 'transalateY(-50%)' }}>
                        <img src={illustration} height="400px" width="auto" alt="Page Not Found" />
                        <h4>Collection Not Found!</h4>
                        <Link to="/">
                            <Button type="primary" size="large">Redirect to Home</Button>
                        </Link>
                    </div>
                </div>
            }
            {loading && collection &&
                <>
                    <Helmet>
                        <title>Collection - {collection.name} | Bloc | Market</title>
                    </Helmet>
                    <div className="container-fluid my-5">
                        <div className="row p-4 m-4">
                            <div className="col-3">
                                <div className="px-1">
                                    <div className="m-3">
                                        <Avatar
                                            src={collection.cover}
                                            size={100}
                                        />

                                        <div style={{ fontSize: "220%", fontWeight: "bold", marginTop: "24px" }}>
                                            {collection.name}
                                            <div style={{ fontSize: "42%", fontWeight: "normal", color: "#999999" }}>Collection</div>
                                        </div>
                                    </div>
                                    <div className="mx-3 my-5">
                                        <Link to={`/${owner.username}/profile`}>
                                            <div className="row my-4">
                                                <div className="col-2">
                                                    <Avatar size="large" src={owner.picture} />
                                                </div>
                                                <div className="col">
                                                    <div className="mx-2">
                                                        {user && (
                                                            <div style={{ color: "#000000", fontWeight: "700", marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: owner._id === user._id ? "you" : owner.username }}></div>
                                                        )}
                                                        {!user && (
                                                            <div style={{ color: "#000000", marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: owner.username }}></div>
                                                        )}
                                                        <div style={{ fontSize: "80%", fontWeight: "500", color: "#999999" }}>Owner</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link></div>
                                </div>
                            </div>
                            <div className="col" style={{ width: "100%", margin: "0" }}>
                                <Title>Items</Title>
                                <div className="row my-3">
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
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default CollectionProfile;