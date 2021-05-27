import React, { useState, useEffect } from 'react';
import { Card, Avatar } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Meta } = Card;

const Favourites = ({ favourites }) => {

    const [assets, setAssets] = useState([]);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        setAssets(favourites);
    }

    return (
        <div className="container-fluid py-2">
            <div className="row">
                {assets.length <= 0 && (
                    <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                        <h3>No Favourites Yet!</h3>
                    </div>
                )}


                {assets.map((asset) =>
                    <div className="col-sm-4 my-3">
                        <Card
                            key={asset._id}
                            bordered
                            style={{ width: "96%" }}

                            cover={
                                <Link to={`assets/${asset.slug}`}>
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
                                        <Link to={`/${asset.owner.username}/profile`}>
                                            <div className="row my-2">
                                                <div className="col-2">
                                                    <Avatar size="default" src={asset.owner.picture} />
                                                </div>
                                                <div className="col">
                                                    <div style={{ fontSize: "small", fontWeight: "600", color: "#333333" }}>
                                                        {asset.owner.username}
                                                    </div>
                                                    <div style={{ fontSize: "80%", fontWeight: "500", marginTop: "-2px", color: "#999999" }}>Owner</div>
                                                </div>
                                            </div>
                                        </Link>
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
    )
}

export default Favourites;