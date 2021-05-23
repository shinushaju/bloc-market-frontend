import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';
import { getMyAssets } from '../../helpers/asset';

const { Meta } = Card;

const OwnedItems = () => {

    const [assets, setAssets] = useState([]);
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadAssets();
    }, [])

    const loadAssets = () => {
        getMyAssets(user._id)
            .then((res) => {
                setAssets(res.data);
            })
    }


    return (
        <div className="container-fluid py-2" style={{ overflowY: "auto", overflowX: "hidden", height: "500px" }}>
            <div className="row">
                {assets.length <= 0 && (
                    <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                        <h3>No Items Yet!</h3>
                    </div>
                )}

                {assets.map((asset) =>
                    <div className="col-sm-4 my-3">
                        <Card
                            key={asset._id}
                            bordered
                            style={{ width: "100%" }}
                            cover={
                                <Link to={`assets/${asset.slug}`}>
                                    <img
                                        width="100%"
                                        style={{ height: "250px", width: "100%", objectFit: "cover", backgroundSize: "cover" }}                                        height="auto"
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
                )}
            </div>
        </div>
    )
}

export default OwnedItems;