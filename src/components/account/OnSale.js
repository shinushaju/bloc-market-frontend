import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';

const { Meta } = Card;

const OnSale = ({onSaleItems}) => {

    // states
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
       setAssets(onSaleItems);
    }

    return (
        <div className="container-fluid py-2" style={{ overflowY: "auto", overflowX: "hidden", height: "500px" }}>
            <div className="row">
                {assets.length <= 0 && (
                    <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                        <h3>No Items Listed For Sale!</h3>
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
                                title={<div>{asset.name}</div>}
                                description={
                                    <>
                                        <span style={{ fontSize: "75%" }}>List price</span>
                                        <div className="row">
                                            <div className="col">
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

export default OnSale;