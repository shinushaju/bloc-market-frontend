import React, { useState, useEffect } from 'react';
import { Empty, Card, Avatar, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Resizer from 'react-image-file-resizer';
import { createCollection, getMyCollections } from '../../helpers/collection';
import CreateCollectionModal from '../modals/CreateCollectionModal';


const Collections = ({history}) => {

    const [buttonLabel, setButtonLabel] = useState("Create Collection");
    const [modal, setModalVisible] = useState(false);
    const [coverFile, setCoverFile] = useState("");
    const [cover, setCover] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [description, setDescription] = useState("");
    const [collections, setCollections] = useState([]);
    const buttonStyle = { display: "block", margin: "auto", cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "400", fontSize: "medium", backgroundColor: "#0065ff", color: "#ffffff" }
    const buttonStyle2 = { display: "block", margin: "auto", cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "400", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff" }
    const buttonStyle3 = { display: "block", margin: "auto", cursor: "pointer", width: "100%", border: "none", borderRadius: "100px", fontWeight: "400", fontSize: "medium", backgroundColor: "#0065ff", color: "#ffffff" }
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "400", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }

    const modalProps = {
        modal,
        setModalVisible,
        cover,
        error,
        setError,
        name,
        setName,
        description,
        setDescription,
        inputStyle,
        buttonStyle3,
        coverFile,
        buttonLabel
    }

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadMyCollections();
    }, []);

    const loadMyCollections = () => {
        getMyCollections(user._id)
            .then((collections) => {
                setCollections(collections.data);
            })
    }

    const modalVisible = (val) => {
        setCover("");
        setCoverFile("");
        setDescription("");
        setName("");
        setError("");
        setModalVisible({ val });
    }
    const successNotification = type => {
        notification[type]({
            description:
                'Collection created successfully!',
        });
    };

    const handleImage = (e) => {
        setCoverFile(e.target.files[0]);
        setCover(e.target.files[0].name);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setButtonLabel(<LoadingOutlined style={{ color: "#ffffff", fontSize: "large" }} />);

        Resizer.imageFileResizer(coverFile, 300, 300, 'JPEG', 100, 0, (uri) => {
            createCollection(user._id, { name, description, coverImage: uri, owner: user._id }, user.token)
                .then((res) => {
                    setModalVisible(false);
                    setName('');
                    setCoverFile('');
                    setDescription('');
                    setCover('');
                    setButtonLabel("Create Collection");
                    successNotification('success');
                    loadMyCollections();
                })
                .catch((error) => {
                    setError("Category already exists!");
                    setButtonLabel("Create Collection");
                });
        }, "base64", 300, 300);

    }

    return (
        <>
            <div>
                <h4>Collections</h4>
                <p>Create your own storefronts, upload digital creations, configure your royalty, and sell NFTs.</p>
                <div className="row my-4">
                    <div className="col-sm-4 my-3">
                        <Card style={{ width: "100%" }}
                            cover={
                                <Empty
                                    style={{ display: "block", margin: "auto" }}
                                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                    imageStyle={{
                                        height: 96,
                                        marginTop: "56px"
                                    }}
                                    description={
                                        <h4 className="py-4">Create New Collection</h4>
                                    }
                                >
                                    <button className="px-5 py-2 my-3" style={buttonStyle} onClick={() => modalVisible(true)}>Create</button>
                                </Empty>
                            }
                        />
                    </div>
                    {collections.map((collection) => (
                        <div className="col-sm-4 my-3">
                        <Card style={{ width: "100%" }}
                            cover={
                                <Empty
                                    style={{ display: "block", margin: "auto" }}
                                    image={
                                        <Avatar src={collection.cover} size={120} />
                                    }
                                    imageStyle={{
                                        marginTop: "56px"
                                    }}
                                    description={
                                        <h4 className="py-4">{collection.name}</h4>
                                    }
                                >
                                    <Link to={`/store/${collection.slug}/assets`}>
                                    <button className="px-5 py-2 my-3" style={buttonStyle2}>View</button>
                                    </Link>
                                </Empty>
                            }
                        />
                        </div>
                    ))}
                </div>
            </div>

            <CreateCollectionModal props={modalProps} handleSubmit={handleSubmit} handleImage={handleImage} />
        </>
    )
}

export default Collections;