import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Typography, Avatar } from 'antd';
import illustration from '../images/buddy.png';

// api functions
import { getAllAssets } from '../helpers/asset';

const { Title } = Typography;


const Home = ({ history }) => {

    // states
    const [asset, setAsset] = useState("");
    const [owner, setOwner] = useState("");
    const { user } = useSelector((state) => ({ ...state }));

    // styles
    const buttonStyle1 = { cursor: "pointer", border: "1px solid #050D1B", borderRadius: "12px", width: "100%", fontWeight: "500", fontSize: "large", backgroundColor: "#050D1B", color: "#ffffff" }
    const buttonStyle2 = { cursor: "pointer", border: "none", borderRadius: "12px", width: "100%", fontWeight: "500", fontSize: "large", backgroundColor: "#FFFFFF", color: "#050D1B" }

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        getAllAssets()
            .then((res) => {
                if (res.data.length > 0) {
                    setAsset(res.data[0]);
                    setOwner(res.data[0].owner);
                }
            });
    }

    const createButton = () => {
        if (!user) {
            history.push('/sign-up');
        }
        else {
            history.push('/store')
        }
    }

    return (
        <div className="main-container">
            <div className="blur-effect"></div>
            <div className="row main-container-child">
                <div className="col-sm-6" >
                    <div style={{ fontSize: "1.3em", marginBottom: "8px" }}>Create, sell and discover rare digital arts.</div>
                    <Title style={{ fontSize: "5em", letterSpacing: "-2px" }}>the new creative economy.</Title>
                    <div className="btn-group btn-group-lg" role="group" >
                        <Link to="/assets">
                            <button type="button" className="py-3 px-5" style={buttonStyle1}>
                                Explore
                            </button>
                        </Link>
                        <button type="button" className="py-3 px-5 mx-3" style={buttonStyle2} onClick={createButton}>
                            Create
                        </button>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="main-box">
                        <div className="main-box-child">               
                                <>
                                    <div className="blurred-box">
                                        <Link to={`/assets/${asset.slug}`}>
                                            <img style={{height: "336px", width: "100%", objectFit: "cover", backgroundSize: "cover", borderRadius: "16px" }} src={asset.assetFile} alt={asset.name}/>
                                        </Link>
                                    </div>
                                    <div className="blurred-box my-1">
                                        <div style={{ fontWeight: "600", fontSize: "120%" }}>{asset.name}</div>
                                        <span>by&ensp;</span>
                                        <span>
                                            <Avatar size="small" src={owner.picture} />
                                        </span>
                                        <span style={{ fontWeight: "bold" }}>
                                            <Link to={`${owner.username}/profile`}>
                                                &ensp;{owner.name}
                                            </Link>
                                        </span>
                                    </div>
                                </>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;