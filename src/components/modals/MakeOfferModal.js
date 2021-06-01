import React, { useState } from 'react';
import { Divider, Modal, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { makeOffer } from '../../helpers/offer';
import { makeOfferNotification } from '../../helpers/notification';

const MakeOfferModal = ({ assetData, highestOffer, ownerId, user, reload, modal, setModalVisible, inputStyle, modalButtonStyle, buttonLabel, setButtonLabel }) => {

    var owner = ownerId;
    var balance = 100;

    const [offer, setOffer] = useState();
    const [disabled, setDisabled] = useState(false);
    const [minPriceValidity, setMinPriceValidity] = useState('');
    const [minBalanceValidity, setBalanceValidity] = useState('');

    const inputOffer = (e) => {
        e.preventDefault();
        if (e.target.value < assetData.minPrice) {
            setMinPriceValidity(<p style={{ color: "red" }}>Please enter an offer greater than or equal to minimum offer price.</p>);
            setOffer(e.target.value);
            setDisabled(true);
        }
        else if (e.target.value > balance) {
            setBalanceValidity(<p style={{ color: "red" }}>No sufficient balance.</p>);
            setOffer(e.target.value);
            setDisabled(true);
        }
        else {
            setMinPriceValidity('');
            setBalanceValidity('');
            setOffer(e.target.value);
            setDisabled(false);
        }
    }

    const makeOfferHandle = () => {
        setButtonLabel(<LoadingOutlined style={{ color: "#ffffff", fontSize: "larger" }} />);
        makeOffer(user._id, assetData._id, { offer, owner }, user.token)
            .then((res) => {
                setTimeout(() => {
                    // create notification
                    makeOfferNotification({ sender: user._id, sender_name: user.name, sender_picture: user.picture, receiver: owner, offer, asset: assetData.name, event: 'Offer Made', asset_slug: assetData.slug }, user.token);
                    reload();
                    setButtonLabel('Make Offer');
                    setModalVisible(false);
                    notificationMessage('success', 5);
                    setOffer('');
                    setMinPriceValidity('');
                    setBalanceValidity('');
                }, 3000)
            })
            .catch((err) => {
                setButtonLabel('Make Offer');
                setMinPriceValidity('');
                setBalanceValidity('');
                console.log(err)
            })
    }

    const notificationMessage = type => {
        notification[type]({
            description:
                `You made an offer of ${offer} BLC`,
        });
    };

    const closeModal = () => {
        setModalVisible(false);
        setOffer('');
        setMinPriceValidity('');
        setBalanceValidity('');
    }

    return (
        <Modal
            title={<h5><b>Make an Offer</b></h5>}
            visible={modal}
            centered
            destroyOnClose={true}
            footer={null}
            maskClosable={false}
            width={360}
            onCancel={closeModal}
        >
            <div className="">
                <div className="my-1" style={{ fontSize: "large" }}>
                    Price: <b>{assetData.price} BLC</b><br />
                Minimum Offer Price: <b>{assetData.minPrice} BLC</b><br />
                Highest Offer: <b>{highestOffer}</b>
                    {highestOffer !== 'No Offers Yet!' && <> <b>BLC</b></>}
                    <Divider />
                Your Balance: <b>{balance} BLC</b>
                </div>
            </div>
            <Divider />
            <form>
                <div className="form-group my-3">
                    <label>Your Offer (BLC)</label>
                    <input type="number" min="0" className="py-3 px-4 my-3" placeholder="Enter offer price here..." value={offer} onChange={inputOffer} style={inputStyle} />
                    <br />
                    {minPriceValidity}
                    {minBalanceValidity}
                </div>
                <button type="button" className="px-5 py-3 my-2" style={modalButtonStyle} onClick={makeOfferHandle} disabled={disabled}>{buttonLabel}</button>
            </form>
        </Modal>
    )
}

export default MakeOfferModal;