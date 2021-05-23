import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Divider, Layout, Avatar, Switch, notification } from 'antd';
import { LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { getAssetInfo, updateAssetPrice } from '../helpers/asset';

const SellItem = ({ history, match }) => {

    const { user } = useSelector((state) => ({ ...state }));

    // states
    const [buttonLabel, setButtonLabel] = useState("Sell Item Now");
    const [asset, setAsset] = useState("");
    const [price, setPrice] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [isListed, setIsListed] = useState(true);

console.log(isListed)
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }
    const modalButtonStyle = { display: "block", width: "100%", margin: "auto", cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff" }

    useEffect(() => {
        loadAssetInfo();
    }, []);

    const loadAssetInfo = () => {
        getAssetInfo(match.params.item)
            .then((res) => {
                setAsset(res.data);
                if (res.data.price && res.data.minPrice) {
                    setButtonLabel("Update")
                    setPrice(res.data.price);
                    setMinPrice(res.data.minPrice);
                    setIsListed(res.data.isListed);
                }
            })
    }

    const handleSwitch = () => {
        if(!isListed) {
            setIsListed(true);
        }
        else {
            setIsListed(false);
        }
    }

    const sellItem = () => {
        setButtonLabel(<LoadingOutlined style={{ color: "#ffffff", fontSize: "large" }} />);
        updateAssetPrice(user._id, asset.slug, { price, minPrice, isListed }, user.token)
            .then((res) => {
                notificationMessage('success', 15);
                setTimeout(() => {
                    setButtonLabel("Sell Item Now");
                    history.goBack();
                }, 3000)
            })
    }

    const notificationMessage = type => {
        notification[type]({
            description:
                `${asset.name} is up for sale at a price ${price} BLC.`,
        });
    };


    const sellItemForm = () => {
        return (
            <form>
                <div className="form-group my-2">
                    <label>Set Price (BLC)</label>
                    <input type="number" min="0" className="py-3 px-4" placeholder="Enter amount here..." value={price} onChange={(e) => { e.preventDefault(); setPrice(e.target.value) }} style={inputStyle} />
                </div>
                <div className="form-group my-4">
                    <label>Set Minimum Price (BLC)</label>
                    <input type="number" min="0" className="py-3 px-4" placeholder="Enter amount here..." value={minPrice} onChange={(e) => { e.preventDefault(); setMinPrice(e.target.value) }} style={inputStyle} />
                </div>
                <div className="form-group my-4">
                    <label>List Item For Sale</label> <Switch size="large" style={{float: "right"}} onChange={handleSwitch} checked={isListed}/>
                </div>
                <button type="button" className="px-5 py-3 my-5" style={modalButtonStyle} onClick={sellItem} disabled={!price || !minPrice}>{buttonLabel}</button>
            </form>
        )
    }

    return (
        <Layout style={{ background: "#FFFFFF" }}>
            <div className="container py-5 my-5" style={{ maxWidth: 400 }}>
                <div className="">
                    <div className="my-1">
                        <LeftOutlined onClick={() => { history.goBack() }} />
                        &emsp;
                        <Avatar size="large" src={asset.assetFile} />
                        &ensp;
                        <span style={{ fontSize: "120%" }}>{asset.name}</span>
                        <Divider />
                    </div>
                    <div className="my-4">
                        {!price && <h3>Sell Item</h3>}
                        {price && <h3>Change Item Price</h3>}
                        <label>
                            This item will be on sale until you transfer this item or cancel it.
                        </label>
                        <div className="my-4">
                            {sellItemForm()}
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default SellItem;