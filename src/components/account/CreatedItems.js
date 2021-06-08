import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Avatar, Card, Modal, Radio, Space } from 'antd';
import { Link } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';
import { getMyCreatedAssets, addAssetToCollection } from '../../helpers/asset';
import { getMyCollections } from '../../helpers/collection';

const { Meta } = Card;

const CreatedItems = ({history}) => {

    const { user } = useSelector((state) => ({ ...state }));

    const [assets, setAssets] = useState([]);
    const [collections, setCollections] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState("");
    const [currentAsset, setCurrentAsset] = useState("");

    const radioStyle = { border: "1px solid #F4F5F7", borderRadius: "8px", minWidth: "100%" }

    useEffect(() => {
        loadAssets();
    }, [])

    const loadAssets = () => {
        getMyCreatedAssets(user._id)
            .then((res) => {
                setAssets(res.data);
            })

        getMyCollections(user._id)
            .then((res) => {
                setCollections(res.data);
            })
    }

    // add to a collection functions
    const addToCollection = (asset) => {
        setCurrentAsset(asset._id);
        setModalVisible(true);
    }

    const handleAddToCollection = () => {
        {
            user && user.token &&
                addAssetToCollection(user._id, currentAsset, { collection_id: selectedCollection }, user.token)
                    .then(() => {
                        loadAssets();
                    })
        }
        setModalVisible(false);
        setCurrentAsset('');
        setSelectedCollection('');
    }

    const closeModal = () => {
        setModalVisible(false);
        setCurrentAsset('');
        setSelectedCollection('');
    }

    // handle collection selection
    const handleSelectCollection = (e) => {
        setSelectedCollection(e.target.value);
    }


    return (
        <>
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
                                            {!asset.collectionId &&
                                                <div className="row my-2">
                                                    <Button type="primary" style={{ marginLeft: "16px" }} onClick={() => addToCollection(asset)}>Add to a Collection</Button>
                                                </div>
                                            }

                                            {asset.collectionId &&
                                                <Link to={`/store/${asset.collectionId.slug}/assets`}>
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

            <Modal
                title={<h5>Add to Collection</h5>}
                visible={modalVisible}
                closable
                destroyOnClose={true}
                onOk={handleAddToCollection}
                okText="Add to Collection"
                maskClosable={false}
                width={300}
                onCancel={closeModal}
            >
                <h6 className="row my-2 px-3">Select a Collection</h6>
                <div className="row p-3">
                    <Radio.Group size="large" style={{ width: "100%" }} onChange={handleSelectCollection} value={selectedCollection}>
                        <Space direction="vertical" style={{ minWidth: "100%" }}>
                            {collections.map((collection) =>
                                <Radio key={collection._id} style={radioStyle} className="p-3" value={collection._id}>
                                    <Avatar size="large" src={collection.cover} /> &ensp;
                    <span style={{ fontSize: "120%", fontWeight: "500" }}>{collection.name}</span>
                                </Radio>
                            )}
                        </Space>
                    </Radio.Group>
                </div>
            </Modal>
        </>
    )
}

export default CreatedItems;