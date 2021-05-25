import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Divider, Button, Avatar, Typography, notification, message } from 'antd';
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import { Helmet } from 'react-helmet';

// components
import UserProfile from '../components/account/Profile';
import UpdateCollectionModal from '../components/modals/UpdateCollectionModal';

// api functions
import { getCollection, updateCollection } from '../helpers/collection';
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
        name,
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
            pathname: 'assets/new',
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
                        />
                        <div className="py-2">
                            <div className="row">
                                <div className="col-sm-3">
                                    <Avatar size={150} src={collectionInfo.cover} alt={collectionInfo.name} />
                                </div>
                                <div className="col">
                                    <Title>{collectionInfo.name}</Title>
                                    <p>{collectionInfo.description}</p>
                                    <div>
                                        <Button style={{ background: "#050D1B", color: "#ffffff" }} onClick={() => modalVisible(true)}>Edit</Button>
                                    &emsp;
                                    <Button onClick={() => (history.push(`/collections/${collectionInfo.slug}`))}>View</Button>
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div className="py-2">
                                <div className="row">
                                    <div className="col-1">
                                        <span><h3>Items</h3></span>
                                    </div>
                                    <div className="col">
                                        <button className="px-3 mx-3 py-2" onClick={mintNewNFT} style={buttonStyle1}>Mint New NFT</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row py-4">
                                {collectionAssetsInfo.map((asset) => (
                                    <div className="col-sm-4">
                                        <Card key={asset._id} hoverable style={{ width: "100%", margin: "auto" }}
                                            cover={
                                                <Link to={`/assets/${asset.slug}`}>
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
                                            <Meta title={
                                                <>
                                                    <b>{asset.name}</b>
                                                    <Link to={`edit/${asset.slug}`}>
                                                        <EditOutlined style={{ float: "right" }} />
                                                    </Link>
                                                </>
                                            } />
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