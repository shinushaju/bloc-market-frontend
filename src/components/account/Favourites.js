import React, { useState, useEffect } from 'react';
import { Card, Avatar } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { getFavourites } from '../../helpers/users';
import { getAssetInfoById } from '../../helpers/asset';

const { Meta } = Card;

const Favourites = ({ favourites }) => {

    const [assets, setAssets] = useState([]);

    const { user } = useSelector((state) => ({ ...state }));

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
                                        style={{ height: "250px", width: "100%", objectFit: "cover", backgroundSize: "cover" }}
                                        height="auto"
                                        alt={asset.name}
                                        src={asset.assetFile}
                                    />
                                </Link>
                            }

                        >
                            <Meta
                                title={
                                    <div>
                                        {asset.name}
                                    </div>}
                                description={
                                    <>
                                        <div className="row my-2">
                                            <div className="col-2">
                                                <Avatar size="large" src={asset.owner.picture} />
                                            </div>
                                            <div className="col">
                                                <span className="m-1" style={{ fontSize: "50%", border: "1px solid #00875A", background: "#E3FCEF", color: "#00875A", padding: "2px 8px", borderRadius: "100px" }}>OWNER</span>
                                                <Link to={`/${asset.owner.username}/profile`}>
                                                    <div style={{ color: "#000000", marginLeft: "4px", fontSize: "small", color: "#333333" }}>
                                                        @{asset.owner.username}
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
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