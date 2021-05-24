import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Link, useParams } from 'react-router-dom';
import { Typography, Avatar, Card, Divider } from 'antd';
import { LoadingOutlined, HeartOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';

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
    const [owner, setOwner] = useState("");
    const [collection, setCollection] = useState("");
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        loadCollectionInfo();
    }, []);

    const loadCollectionInfo = () => {
        getCollection(path.collection)
            .then((res) => {
                setCollection(res.data);
                loadOwnerInfo(res.data.owner);
                loadAssets(res.data.owner, res.data._id);
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
            {loading &&
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
                                <Divider />
                                <div className="row">
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
                                                            style={{ height: "250px", width: "100%", objectFit: "cover", backgroundSize: "cover" }} height="auto"
                                                            alt={asset.name}
                                                            src={asset.assetFile}
                                                        />
                                                    </Link>
                                                }
                                            >
                                                <Meta
                                                    title={<div>{asset.name}</div>}
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