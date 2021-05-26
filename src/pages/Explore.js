import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Layout, Avatar, Card, Row, Col } from 'antd';
import { HeartOutlined, LoadingOutlined } from '@ant-design/icons';

// api functions
import { getAllAssets } from '../helpers/asset';

const { Meta } = Card;

const Explore = () => {

    const dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));

    // states
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = () => {
        getAllAssets()
            .then((res) => {
                dispatch({
                    type: "LOADED_ALL_ASSETS",
                    payload: res.data
                })
                setAssets(res.data);
                setTimeout(() => {
                    setLoading(true);
                }, 1000);
            });
    }

    const items = () => {
        return (
            assets.map((asset) =>
                <div className="col col-sm-3 my-3">
                    <Card
                        key={asset._id}
                        bordered
                        style={{ width: "100%", display: "block", margin: "auto" }}
                        cover={
                            <Link to={`assets/${asset.slug}`}>
                                <img
                                    className="p-3"
                                    style={{ height: "250px", width: "100%", objectFit: "cover", backgroundSize: "cover", borderRadius: "30px" }}
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

                                    <Link to={`/${asset.owner.username}/profile`}>

                                        <div className="row my-2">
                                            <div className="col-2">
                                                <Avatar size="default" src={asset.owner.picture} />
                                            </div>
                                            <div className="col">

                                                <div style={{ color: "#050D1B", fontWeight: "600", marginTop: "-2px" }}>
                                                    {user &&
                                                        <>{asset.owner._id === user._id ? "you" : asset.owner.username}</>
                                                    }
                                                    {!user &&
                                                        <>{asset.owner.username}</>
                                                    }
                                                </div>

                                                <div style={{ fontSize: "80%", fontWeight: "500", marginTop: "-2px", color: "#999999" }}>Owner</div>
                                            </div>
                                        </div>
                                    </Link>

                                    <span style={{ fontSize: "75%" }}>List price</span>
                                    <div className="row">
                                        <div className="col">
                                            {!asset.isListed &&
                                                <div style={{ fontSize: "130%", color: "#000000" }}>--</div>
                                            }
                                            {asset.isListed &&
                                                <div style={{ fontSize: "130%", color: "#000000", fontWeight: "700" }}>
                                                    {asset.price} <span style={{ fontSize: "60%", color: "#666666", fontWeight: "400" }}>BLC</span>
                                                </div>
                                            }
                                        </div>
                                        <div className="col">
                                            <b style={{ fontSize: "130%", float: "right", color: "#666666" }}><HeartOutlined /> {asset.favourites}</b>
                                        </div>
                                    </div>
                                </>
                            }
                        />
                    </Card>
                </div>
            )
        )
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
                <Layout style={{ background: "#FFFFFF" }}>
                    <div className="my-5">
                        <div className="container py-5 my-5">
                            <h2>Latest Items&#128293;</h2>
                            <div className="my-5">
                                <div type="flex" className="row my-2" >
                                    {items()}
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout >
            }

            {assets.length <= 0 &&
                <div className="py-5 my-5" style={{ display: "block", margin: "auto", textAlign: "center" }}>
                    <h4>No Items Found!</h4>
                </div>
            }

        </>
    )
}

export default Explore;