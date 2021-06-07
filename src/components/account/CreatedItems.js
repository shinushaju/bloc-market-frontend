import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Avatar, Card } from 'antd';
import { Link } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';
import { getMyCreatedAssets } from '../../helpers/asset';

const { Meta } = Card;

const CreatedItems = () => {

    const [assets, setAssets] = useState([]);
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadAssets();
    }, [])

    const loadAssets = () => {
        getMyCreatedAssets(user._id)
            .then((res) => {
                setAssets(res.data);
            })
    }


    return (
        <div className="container-fluid py-2">
            <div className="row">
                {assets.length <= 0 && (
                    <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                        <h3>No Items Yet!</h3>
                    </div>
                )}

                {assets.map((asset) =>
                    <div className="col-sm-4">
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
                                        {asset.collectionId &&
                                            <Link to={`/collections/${asset.collectionId.slug}`}>
                                                <div className="row my-2">
                                                    <div className="col-2">
                                                        <Avatar size="default" src={asset.collectionId.cover} />
                                                    </div>
                                                    <div className="col">
                                                        <div style={{ color: "#050D1B", fontWeight: "600", marginTop: "-2px" }}>
                                                            <>{asset.collectionId.name}</>
                                                        </div>
                                                        <div style={{ fontSize: "80%", fontWeight: "500", marginTop: "-2px", color: "#999999" }}>Collection</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        }
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
                )}
            </div>
        </div>
    )
}

export default CreatedItems;