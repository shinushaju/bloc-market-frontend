import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Divider, Button, Avatar, Modal, Typography, Dropdown, Menu, notification, message } from 'antd';
import { EditOutlined, LoadingOutlined, DeleteOutlined, SettingOutlined, HeartOutlined } from '@ant-design/icons';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import { Helmet } from 'react-helmet';

// components
import UserProfile from '../components/account/Profile';
import UpdateCollectionModal from '../components/modals/UpdateCollectionModal';

// api functions
import { deleteCollection, getCollection, updateCollection } from '../helpers/collection';
import { getMyAssetsByCollection } from '../helpers/asset';

const { Title } = Typography;
const { Meta } = Card;

const Collection = ({ history, match }) => {

    const { user } = useSelector((state) => ({ ...state }));

    // states
    const [buttonLabel, setButtonLabel] = useState("Update Collection");
    const [logoButtonLabel, setLogoButtonLabel] = useState("Add New Logo");
    const [collectionInfo, setCollectionInfo] = useState("");
    const [collectionAssetsInfo, setCollectionAssetsInfo] = useState([]);
    const [modal, setModalVisible] = useState(false);
    const [cover, setCover] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [coverId, setCoverId] = useState("");

    // styles
    const buttonStyle1 = { cursor: "pointer", border: "none", borderRadius: "8px", fontWeight: "500", fontSize: "medium", backgroundColor: "#0065FF", color: "#ffffff" }
    const buttonStyle2 = { display: "block", width: "100%", margin: "auto", cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "400", fontSize: "medium", backgroundColor: "#0065FF", color: "#ffffff" }
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "400", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }

    const modalProps = {
        modal,
        setModalVisible,
        cover,
        name,
        buttonLabel,
        logoButtonLabel,
        description,
        setName,
        setDescription,
        inputStyle,
        buttonStyle2
    }

    useEffect(() => {
        loadCollectionInfo();
    }, []);

    const loadCollectionInfo = () => {
        getCollection(match.params.collection)
            .then((res) => {
                setCollectionInfo(res.data);
                setName(res.data.name);
                setDescription(res.data.description);
                setCover(res.data.cover);
                setCoverId(res.data.coverId);
                loadCollectionAssetsInfo(res.data._id);
            })
    }

    const loadCollectionAssetsInfo = (collectionId) => {
        getMyAssetsByCollection(user._id, collectionId)
            .then((res) => {
                setCollectionAssetsInfo(res.data);
            })
    }

    const modalVisible = (val) => {
        setModalVisible({ val });
        loadCollectionInfo();
    }

    const mintNewNFT = () => {
        history.push({
            pathname: 'assets/mint',
            state: {
                collection_id: collectionInfo._id
            }
        }
        );
    }

    const successNotification = type => {
        notification[type]({
            description:
                'Collection updated successfully!',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setButtonLabel(<LoadingOutlined style={{ color: "#ffffff", fontSize: "large" }} />);
        try {
            updateCollection(user._id, match.params.collection, { name, description }, user.token)
                .then((res) => {
                    setModalVisible(false);
                    setName(res.data.name);
                    setDescription(res.data.description);
                    history.push('/store');
                    setButtonLabel("Update Collection");
                    successNotification('success');
                })
                .catch((error) => {
                    console.log(error.message);
                    setButtonLabel("Update Collection");
                });
        } catch (error) {
            console.log(error.message);
            setButtonLabel("Update Collection");
        }
    }

    const handleCoverImageUpdate = (e) => {
        let coverFile = e.target.files[0];
        setLogoButtonLabel(<LoadingOutlined style={{ color: "#ffffff", fontSize: "medium" }} />);

        if (coverFile) {
            Resizer.imageFileResizer(coverFile, 720, 720, 'JPEG', 100, 0, (uri) => {
                axios.post(`${process.env.REACT_APP_API}/user/${user._id}/collection/update/${match.params.collection}/cover`, { coverImage: uri, coverId: coverId }, {
                    headers: {
                        authtoken: user ? user.token : '',
                    }
                })
                    .then(() => {
                        loadCollectionInfo();
                        setLogoButtonLabel('Add New Logo');
                        message.success(<span>Logo updated successfully! &#127881;</span>, 5);
                    })
                    .catch((error) => {
                        console.log(error.message)
                        setLogoButtonLabel('Add New Logo');
                    })
            }, "base64");
        }
    }

    const confirmCollectionDelete = () => {
        Modal.confirm({
            centered: true,
            title: <h5>Delete Collection</h5>,
            content: 'Are you sure you want to permanently delete this collection?',
            width: 360,
            icon: '',
            okText: 'Delete Collection',
            cancelText: 'Nevermind',

            onOk() {
                return new Promise((resolve, reject) => {
                    var status = '';
                    deleteCollection(user._id, collectionInfo._id, user.token)
                        .then((res) => {
                            status = res.data;
                            setTimeout(() => {
                                history.push("/store");
                                message.success("Collection Deleted!", 5);
                            }, 3000);
                        })
                    setTimeout(status === 'Collection Deleted' ? resolve : reject, 3000);
                }).catch(() => console.log('Error'));
            },
        });
    }


    return (
        <>
            <Helmet>
                <title>My Store | Bloc | Market</title>
            </Helmet>
            <div className="container-fluid my-5">
                <div className="row px-4 py-4">
                    <div className="col-3">
                        <UserProfile />
                    </div>
                    <div className="col py-4">
                        <PageHeader
                            style={{ paddingLeft: 0 }}
                            onBack={() => (history.goBack())}
                            title={`Collection / ${collectionInfo.name}`}
                            extra={[
                                <Button key="view" size="large" onClick={() => (history.push(`/collections/${collectionInfo.slug}`))}>Preview Collection</Button>,
                                <Button key="mint" size="large" type="primary" onClick={mintNewNFT}>
                                    Mint New NFT
                                </Button>,
                                <Dropdown
                                    trigger={['click']}
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="1" onClick={() => modalVisible(true)}>
                                                <EditOutlined /> Edit Collection
                                    </Menu.Item>
                                            <Menu.Item key="2" danger onClick={confirmCollectionDelete}>
                                                <DeleteOutlined /> Delete Collection
                                    </Menu.Item>
                                        </Menu>
                                    }
                                >
                                    <Button size="large">
                                        <SettingOutlined />
                                    </Button>
                                </Dropdown>
                            ]}
                        />
                        <div className="py-2">
                            <div className="row">
                                <div className="col-sm-3">
                                    <Avatar size={150} src={collectionInfo.cover} alt={collectionInfo.name} />
                                </div>
                                <div className="col">
                                    <Title>{collectionInfo.name}</Title>
                                    <p>{collectionInfo.description}</p>
                                </div>
                            </div>
                            <Divider />
                            <div className="my-2">
                                <span><h3> Collection Items</h3></span>
                            </div>
                            <div className="row">
                                {collectionAssetsInfo.length <= 0 && (
                                    <div className="py-5" style={{ display: "flex", margin: "auto" }}>
                                        <h3>No Items Yet!</h3>
                                    </div>
                                )}
                                {collectionAssetsInfo.map((asset) => (
                                    <div className="col-sm-4 my-3">
                                        <Card
                                            key={asset._id}
                                            size="small"
                                            bordered
                                            style={{ width: "100%" }}
                                            className="px-2"
                                            headStyle={{ border: "none" }}
                                            title={<div className="py-2" style={{ fontSize: "130%" }}>{asset.name}</div>}
                                            extra={
                                                <Dropdown
                                                    trigger={['click']}
                                                    overlay={
                                                        <Menu>
                                                            <Menu.Item key="1">
                                                                <Link to={`/store/${collectionInfo.slug}/assets/${asset.slug}/edit`}>
                                                                    <EditOutlined /> Edit Item
                                                                </Link>
                                                            </Menu.Item>
                                                            <Menu.Item key="2" danger>
                                                                <DeleteOutlined /> Delete Item
                                                            </Menu.Item>
                                                        </Menu>
                                                    }
                                                >
                                                    <Button style={{ fontSize: "110%", cursor: "pointer", fontWeight: "800" }}>
                                                        &#8942;
                                                    </Button>
                                                </Dropdown>
                                            }
                                            cover={
                                                <Link to={`/assets/${asset.slug}`}>
                                                    <img
                                                        className="p-3"
                                                        width="100%"
                                                        style={{ height: "250px", width: "100%", objectFit: "cover", backgroundSize: "cover", borderRadius: "24px" }} height="auto"
                                                        alt={asset.name}
                                                        src={asset.assetFile}
                                                    />
                                                </Link>
                                            }
                                        >
                                            <Meta
                                                className="py-2"
                                                style={{ marginTop: "-24px" }}
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
            </div>
            <UpdateCollectionModal props={modalProps} handleSubmit={handleSubmit} handleCoverImageUpdate={handleCoverImageUpdate} />
        </>
    )
}

export default Collection;