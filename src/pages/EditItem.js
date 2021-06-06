import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Resizer from 'react-image-file-resizer';
import { PageHeader, Alert, notification } from 'antd';
import { PaperClipOutlined, LoadingOutlined } from '@ant-design/icons';

// User Profile Component
import UserProfile from '../components/account/Profile';

// api functions
import { getAssetInfo } from '../helpers/asset';


const EditItem = ({ history }) => {

    const { user } = useSelector((state) => ({ ...state }));
    const path = useParams();

    // states
    const [buttonLabel, setButtonLabel] = useState("Edit Your NFT");
    const [item, setItem] = useState("");
    const [asset, setAsset] = useState("");
    const [assetFile, setAssetFile] = useState("");
    const [collection, setCollecton] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // styles
    const buttonStyle = { cursor: "pointer", border: "none", width: "47%", borderRadius: "100px", fontWeight: "400", fontSize: "large", backgroundColor: "#0065FF", color: "#ffffff" }
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "400", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }
    const labelStyle = { cursor: "pointer", width: "100%", border: "2px solid #050D1B", borderRadius: "8px", fontWeight: "400", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff", textAlign: "center" }


    useEffect(() => {
        getAssetInfo(path.asset)
            .then((res) => {
                setItem(res.data.assetFile);
                setName(res.data.name);
                setDescription(res.data.description);
            })
        setCollecton(path.collection);
        setTimeout(() => {
            setLoading(true);
        }, 1500)
    }, [])


    const cancelForm = () => {
        setAssetFile("");
        setAsset("");
        history.goBack();
    }

    const successNotification = type => {
        notification[type]({
            description:
                'Item created successfully!',
        });
    };

    const handleImage = (e) => {
        setAssetFile(e.target.files[0]);
        setAsset(e.target.files[0].name);
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("image").src = e.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        /*
        setButtonLabel(<LoadingOutlined style={{ color: "#ffffff", fontSize: "large" }} />);
            editAsset(user._id, { name, description }, user.token)
                .then((res) => {
                    setButtonLabel("Edit Your NFT");
                    successNotification('success');
                    setTimeout(() => { history.goBack(); }, 3000);

                })
                .catch((error) => {
                    setButtonLabel("Edit Your NFT");
                });
                */
    }

    const addNewItemForm = () => {
        return (
            <div style={{ width: "100%" }} className="my-3">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group ">
                                <label>Upload Your Art</label>
                                <label htmlFor="file-upload" className="px-5 py-3" style={labelStyle}>
                                    Upload New File
                        <input id="file-upload" type="file" accept="image/png,image/jpg,image/jpeg" multiple={false} onChange={handleImage} />
                                </label>
                            </div>
                            <div className="form-group my-4">
                                <label>Name of Your Art</label>
                                <input type="text" className="py-3 px-4" placeholder="Example: Arcnet" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                                <br />
                                {error && <Alert className="my-2" message={error} type="error" showIcon closable onClose={() => setError("")} />}
                            </div>
                            <div className="form-group my-3">
                                <label>Description</label>
                                <textarea rows="5" type="text" className="py-3 px-4" placeholder="Description for your asset..." value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} ></textarea>
                            </div>
                        </div>
                        <div className="col-sm-6 px-5 ">
                            {asset && <div><h6>Selected File:</h6><PaperClipOutlined style={{ color: "#0065FF" }} /> {asset}</div>}
                            {assetFile &&
                                < div className="foil-image my-4">
                                    <img id="image" className="img" src="#" width="100%" style={{ display: "block", margin: "auto", borderRadius: "16px" }} alt="" />
                                </div>
                            }
                            {item && !asset && !assetFile &&
                                < div className="foil-image my-4">
                                    <img className="img" src={item} width="100%" style={{ display: "block", margin: "auto", borderRadius: "16px" }} alt={name} />
                                </div>
                            }
                        </div>
                    </div>
                    <div className="row my-3">
                        <button type="button" className="px-5 py-3 m-3" style={buttonStyle} onClick={handleSubmit} disabled={ !item || !name || !description}>{buttonLabel}</button>
                    </div>
                </form>
            </div >
        )
    }
    return (
        <div className="container-fluid my-5">
            <div className="row px-4 py-4">
                <div className="col-3">
                    <UserProfile />
                </div>
                {loading &&
                    <div className="col py-4">
                        <PageHeader
                            style={{ paddingLeft: 0 }}
                            onBack={cancelForm}
                            title="Edit Item"
                        />
                        <div className="px-3">
                            <div className="row">
                                {addNewItemForm()}
                            </div>
                        </div>
                    </div>
                }
                {!loading &&
                    <div className="container-fluid py-5">
                        <div className="my-5" style={{ position: 'absolute', top: '36%', fontSize: "300%", fontWeight: "bold", left: '55%', msTransform: 'translateY(-50%)', transform: 'transalateY(-50%)' }}>
                            <LoadingOutlined />
                        </div>
                    </div>
                }
            </div>
        </div>

    )
}

export default EditItem;