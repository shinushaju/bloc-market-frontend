import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Layout, Tag, Card, Breadcrumb, notification, message, Modal, Typography, Tabs, Avatar, Divider } from 'antd';
import { LoadingOutlined, ExperimentTwoTone, TagTwoTone, InteractionTwoTone } from '@ant-design/icons';
import moment from 'moment';
import { Helmet } from 'react-helmet';

// components [FavButton, MakeOfferModal]
import FavButton from '../components/micro-components/FavButton';
import MakeOfferModal from '../components/modals/MakeOfferModal';

// api functions
import { getAssetInfo, transferAsset } from '../helpers/asset';
import { fetchWalletBalance } from '../helpers/wallet';
import { getAllOffers, getOffer, updateMyOffer, rejectOffer, acceptOffer, withdrawOffer, cancelTxn } from '../helpers/offer';
import { makeOfferNotification, rejectOfferNotification, acceptOfferNotification, assetTransferNotification } from '../helpers/notification';
import { getAssetHistory, transferredNFT } from '../helpers/activity';

const { Title } = Typography;
const { TabPane } = Tabs;

const AssetDetails = ({ history, match }) => {

    moment().format();
    const dispatch = useDispatch();
    const { user, wallet } = useSelector((state) => ({ ...state }));

    // states
    const [dataFetched, setDataFetched] = useState(false);
    const [asset, setAsset] = useState("");
    const [creator, setCreator] = useState("");
    const [owner, setOwner] = useState("");
    const [collection, setCollection] = useState([]);
    const [offers, setOffers] = useState([]);
    const [offerers, setOfferers] = useState("");
    const [highestOffer, setHighestOffer] = useState(null);
    const [modal, setModalVisible] = useState(false);
    const [updateModal, setUpdateModalVisible] = useState(false);
    const [myOffer, setMyOffer] = useState("");
    const [buttonLabel, setButtonLabel] = useState("Make Offer");
    const [buttonUpdateLabel, setButtonUpdateLabel] = useState("Update Offer");
    const [myOfferPrice, setMyOfferPrice] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [balance, setBalance] = useState('');
    const [minPriceValidity, setMinPriceValidity] = useState('');
    const [minBalanceValidity, setBalanceValidity] = useState('');
    const [assetHistory, setAssetHistory] = useState([]);

    // styles
    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }
    const modalButtonStyle = { display: "block", width: "100%", margin: "auto", cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff" }
    const sellButtonStyle = { cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#0065ff", color: "#ffffff" }
    const buttonStyle = { cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff" }
    const buttonStyle1 = { cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#0065ff", color: "#ffffff" }
    const buttonStyle2 = { cursor: "pointer", border: "1px solid #050D1B", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#FFFFFF", color: "#050D1B" }

    useEffect(() => {
        loadAssetInfo();
        if (user && user.token) {
            fetchWalletBalance(user.address, user.token).then((res) => {
                setBalance(parseInt(res.data));
                dispatch({
                    type: "UPDATE_WALLET_BALANCE",
                    payload: res.data
                });
            });
        }
    }, []);

    const loadAssetInfo = () => {
        getAssetInfo(match.params.item)
            .then((res) => {
                setAsset(res.data);
                if (user && user.token) {
                    setTimeout(() => {
                        getOffer(user._id, res.data._id, user.token)
                            .then((res) => {
                                setMyOffer(res.data[0]);
                                if (res.data[0] !== undefined) {
                                    setMyOfferPrice(res.data[0].offer);
                                }
                                setDataFetched(true);
                            });
                    }, 1500);
                }
                else {
                    setTimeout(() => {
                        setDataFetched(true);
                    }, 1500);
                }
                setCreator(res.data.creator);
                setOwner(res.data.owner);
                setCollection(res.data.collectionId);
                getAllOffers(res.data._id)
                    .then((res) => {
                        setOffers(res.data);
                        setOfferers(res.data.map(offer => offer.offerer._id));
                        if (res.data.length > 0) {
                            //console.log("DATA1",res.data);
                            setHighestOffer((Math.max(...res.data.map(offer => offer.offer))))
                        }
                        else {
                            //console.log("DATA2",res.data);
                            setHighestOffer("No Offers Yet!")
                        }
                    });
                getAssetHistory(res.data._id)
                    .then((res) => {
                        setAssetHistory(res.data);
                        console.log("DATA", res.data)
                    })
                dispatch({
                    type: "LOADED_ASSET_DETAILS",
                    payload: res.data
                });
            })
            .catch(() => {
                history.goBack();
            })

    }

    const checkOfferer = () => {
        var buttonLabel;
        if (user && offerers.includes(user._id)) {
            if (myOffer && myOffer.status !== 'Withdrawn') {
                buttonLabel = "Withdraw Offer";
            }
            else {
                buttonLabel = "Make an Offer";
            }
        }
        else {
            buttonLabel = "Make an Offer";
        }
        return buttonLabel;
    }

    const updateOffer = () => {
        if (user && offerers.includes(user._id)) {
            if (myOffer && myOffer.status === 'Pending') {
                return true;
            }
            else {
                return false;
            }
        }
    }

    const checkoutOffer = () => {
        if (user && offerers.includes(user._id)) {
            if (myOffer && myOffer.status === 'Accepted') {
                return true;
            }
            else {
                return false;
            }
        }
    }

    const offerStatus = (offer) => {
        if (offer.status === 'Pending') {
            return (
                <Tag color="purple" style={{ float: "right", marginTop: "8px" }}>{offer.status}</Tag>
            )
        }
        if (offer.status === 'Accepted') {
            return (
                <Tag color="green" style={{ float: "right", marginTop: "8px" }}>{offer.status}</Tag>
            )
        }
        if (offer.status === 'Rejected') {
            return (
                <Tag color="red" style={{ float: "right", marginTop: "8px" }}>{offer.status}</Tag>
            )
        }
        if (offer.status === 'Withdrawn') {
            return (
                <Tag color="volcano" style={{ float: "right", marginTop: "8px" }}>{offer.status}</Tag>
            )
        }
    }

    const handleOffer = () => {
        if (user && user.token) {
            if (offerers.includes(user._id) && myOffer.status) {
                if (myOffer.status === 'Pending' || myOffer.status === 'Accepted') {
                    confirmOfferWithdrawal();
                }
            }
            else {
                setModalVisible(true);
            }
        }
        else {
            history.push('/login');
        }
    }

    const confirmOfferWithdrawal = () => {
        Modal.confirm({
            centered: true,
            title: <h5>Withdraw Offer</h5>,
            content: 'Are you sure you want to permanently withdraw this offer?',
            width: 360,
            icon: '',
            okText: 'Yes, Withdraw!',
            cancelText: 'Nevermind',
            onOk() {
                return new Promise((resolve, reject) => {
                    var status = '';
                    withdrawOffer(user._id, myOffer._id, user.token)
                        .then((res) => {
                            status = res.data;
                            setTimeout(() => {
                                loadAssetInfo();
                                message.success("Offer Withdrawn", 5);
                            }, 3000);
                        })
                    setTimeout(status === 'Withdrawn' ? resolve : reject, 3000);
                }).catch(() => console.log('Error'));
            },
        });
    }

    const handleRejectOffer = (offer) => {
        Modal.confirm({
            centered: true,
            title: <h5>Reject Offer</h5>,
            content: 'Are you sure you want to reject this offer?',
            width: 360,
            icon: '',
            okText: 'Yes, Reject!',
            cancelText: 'Nevermind',
            onOk() {
                return new Promise((resolve, reject) => {
                    var status = '';
                    rejectOffer(user._id, offer._id, user.token)
                        .then((res) => {
                            rejectOfferNotification({ sender: user._id, sender_name: user.name, sender_picture: user.picture, receiver: offer.offerer._id, offer: offer.offer, asset: offer.asset.name, event: 'Offer Rejected', asset_slug: offer.asset.slug }, user.token)
                            status = res.data;
                            setTimeout(() => {
                                loadAssetInfo();
                                message.success("Offer Rejected", 5);
                            }, 3000)
                        })
                    setTimeout(status === 'Rejected' ? resolve : reject, 3000);
                }).catch(() => console.log('Error'));
            },
        });
    }

    const handleConfirmTxn = () => {
        Modal.confirm({
            centered: true,
            title: <h5>Complete Payment</h5>,
            content: <>
                <p>Complete the payment by transferring the amount from your wallet to owner wallet.</p>
                <div className="p-3 mb-3" style={{ textAlign: "center", background: "#ffffff", border: "1px dashed #cccccc", borderRadius: "16px" }}>
                    Amount
                            <div style={{ fontSize: "3rem", fontWeight: "500" }}>{myOffer.offer}</div>
                    <b>BLC</b>
                </div>
                <p>Once the transaction is successfull the NFT ownership will be transferred to your address.</p>
                        Click "Complete Payment" button to complete the transaction.
            </>,
            width: 350,
            icon: '',
            okText: 'Complete Payment',
            cancelText: 'Cancel',
            okButtonProps: { size: "large" },
            cancelButtonProps: { size: "large" },
            onOk() {
                return new Promise((resolve, reject) => {
                    var status = '';
                    transferAsset(asset._id, { address: user.address, privateKey: user.privateKey, newOwnerId: user._id, toAddress: owner.address, toPrivateKey: owner.privateKey, amount: myOffer.offer, tokenId: asset.tokenId }, user.token)
                        .then((res) => {
                            console.log(res.data);
                            status = res.data;
                            assetTransferNotification({ sender: user._id, sender_name: user.name, sender_picture: user.picture, receiver: owner._id, offer: myOffer.offer, asset: asset.name, event: 'Ownership Transferred', asset_slug: asset.slug }, user.token)
                            // logs activity
                            transferredNFT({ event: "Transferred NFT", from: owner._id, to: user._id, nft: asset._id }, user.token);
                            setTimeout(() => {
                                history.push('/wallet');
                                message.success("Payment Success!", 5);
                            }, 3000);
                        })
                    setTimeout(status ? resolve : reject, 10000);
                }).catch(() => console.log('Error'));
            },
        });
    }

    const handleCancelTxn = () => {
        Modal.confirm({
            centered: true,
            title: <h5>Withdraw Offer</h5>,
            content: 'Are you sure you want to permanently withdraw your offer?',
            width: 360,
            icon: '',
            okText: 'Yes, Withdraw!',
            cancelText: 'Nevermind',
            onOk() {
                return new Promise((resolve, reject) => {
                    var status = '';
                    cancelTxn(user._id, asset._id, myOffer._id, user.token)
                        .then((res) => {
                            status = res.data;
                            setTimeout(() => {
                                loadAssetInfo();
                                message.success("Offer Withdrawn", 5);
                            }, 3000);
                        })
                    setTimeout(status === 'Withdrawn' ? resolve : reject, 3000);
                }).catch(() => console.log('Error'));
            },
        });
    }


    const handleAcceptOffer = (offer) => {
        Modal.confirm({
            centered: true,
            title: <h5>Accept Offer</h5>,
            content: <>
                Are you sure you want to accept this offer? New users cannot make new offers on this item after this.
                <div className="my-3 p-3" style={{ backgroundColor: "#FFFAE6", border: "1px dashed #FFE380", borderRadius: "8px" }}>
                    {`Once ${offer.offerer.name} confirms transaction, ownership of your asset will be transferred to ${offer.offerer.name}.`}
                    <Divider />
                    {`You will be receiving ${offer.offer} BLC in your wallet.`}
                </div>
            </>,
            width: 360,
            icon: '',
            okText: 'Accept Offer',
            cancelText: 'Nevermind',
            onOk() {
                return new Promise((resolve, reject) => {
                    var status = '';
                    acceptOffer(user._id, asset._id, offer._id, user.token)
                        .then((res) => {
                            acceptOfferNotification({ sender: user._id, sender_name: user.name, sender_picture: user.picture, receiver: offer.offerer._id, offer: offer.offer, asset: offer.asset.name, event: 'Offer Accepted', asset_slug: offer.asset.slug }, user.token)
                            status = res.data;
                            setTimeout(() => {
                                loadAssetInfo();
                                message.success("Offer Accepted", 5);
                            }, 3000)
                        })

                    setTimeout(status === 'Accepted' ? resolve : reject, 3000);
                }).catch(() => console.log('Error'));
            },
        });
    }

    const sellItem = () => {
        if (user && user.token) {
            history.push(`/assets/${asset.slug}/sell`);
        }
    }

    const inputOffer = (e) => {
        e.preventDefault();

        if (e.target.value > balance) {
            setBalanceValidity(<p style={{ color: "red" }}>No sufficient balance.</p>);
            setMyOfferPrice(e.target.value);
            setDisabled(true);
        }
        else if (e.target.value < asset.minPrice) {
            setMinPriceValidity(<p style={{ color: "red" }}>Please enter an offer greater than or equal to minimum offer price.</p>);
            setMyOfferPrice(e.target.value);
            setDisabled(true);
        }
        else {
            setMinPriceValidity('');
            setBalanceValidity('');
            setMyOfferPrice(e.target.value);
            setDisabled(false);
        }
    }

    const updateOfferModal = () => {
        setButtonUpdateLabel(<LoadingOutlined style={{ color: "#ffffff", fontSize: "larger" }} />);

        updateMyOffer(user._id, myOffer._id, { myOfferPrice }, user.token)
            .then(() => {
                setTimeout(() => {
                    // create notification
                    makeOfferNotification({ sender: user._id, sender_name: user.name, sender_picture: user.picture, receiver: owner._id, offer: myOfferPrice, asset: asset.name, event: 'Offer Made', asset_slug: asset.slug }, user.token);
                    loadAssetInfo();
                    setButtonUpdateLabel('Update Offer');
                    setUpdateModalVisible(false);
                    updateOfferNotification('success', 5);
                    setMinPriceValidity('');
                    setBalanceValidity('');
                }, 3000)
            })
            .catch((err) => {
                setButtonUpdateLabel('Update Offer');
                setMinPriceValidity('');
                setBalanceValidity('');
                console.error(err)
            })
    }

    const updateOfferNotification = type => {
        notification[type]({
            description:
                `Your offer was updated to ${myOfferPrice} BLC!`,
        });
    };

    const closeModal = () => {
        setUpdateModalVisible(false);
        setMinPriceValidity('');
        setBalanceValidity('');
        setButtonUpdateLabel('Update Offer');
    }

    const assetDetails = () => {
        return (
            <>

                <div className="row">
                    <div className="col-sm-4">
                        <img className="my-5" style={{ borderRadius: "16px" }} src={asset.assetFile} width="100%" alt={asset.name} />
                    </div>
                    <div className="col-sm-8 px-5">
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="row px-3">
                                    <Breadcrumb>
                                        <Breadcrumb.Item>
                                            <Link to="/assets">Assets</Link>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item>{asset.name}</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                <Title className="my-4">{asset.name}</Title>
                                <div className="row">
                                    <div className="col">
                                        {asset.isListed &&
                                            <>
                                                <div style={{ fontSize: "75%" }}>
                                                    <Tag color="geekblue">List price</Tag>
                                                </div>
                                                <div style={{ fontSize: "300%", fontWeight: "800", color: "#050D1B" }}>
                                                    {asset.price} <span style={{ fontSize: "50%", fontWeight: "400" }}>BLC</span>
                                                </div>
                                            </>
                                        }
                                        {!asset.isListed &&
                                            <div style={{ fontSize: "75%" }}>
                                                <Tag color="gold">Not Listed For Sale</Tag>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="my-3" style={{ color: "#505F79" }}>{asset.description}</div>
                                {user &&
                                    (owner._id === user._id ?
                                        (!asset.price ?
                                            (<button className="my-4 px-5 py-3" style={sellButtonStyle} onClick={sellItem}>Sell Item</button>)
                                            :
                                            (asset.auction_status === 'auction_in_progress' || asset.auction_status === 'not_on_auction' ?
                                                <button className="my-4 px-5 py-3" style={sellButtonStyle} onClick={sellItem}>Change Price</button> :
                                                <div className="my-4">
                                                    <Tag className="p-3" style={{ width: "100%" }} color="purple">
                                                        Transaction in progress... <br /><br />
                                                        Once the buyer confirms transaction and makes payment, ownership of<br /> your asset will be transferred to the buyer.
                                                        <br /><br />
                                                        You will be receiving the offer amount in your wallet.
                                                    </Tag>
                                                </div>
                                            )
                                        ) :
                                        (asset.isListed &&
                                            <>
                                                {checkoutOffer() &&
                                                    <>
                                                        <button className="my-4 px-5 py-3" style={buttonStyle1} onClick={handleConfirmTxn}>Buy Now</button>
                                                        <button className="my-4 px-5 py-3 mx-2" style={buttonStyle} onClick={handleCancelTxn}>Withdraw Offer</button>
                                                    </>
                                                }

                                                {asset && asset.auction_status !== 'auction_ended' &&
                                                    <button className="my-4 px-5 py-3" style={buttonStyle} onClick={handleOffer} dangerouslySetInnerHTML={{ __html: checkOfferer() }}></button>
                                                }

                                                {asset && asset.auction_status === 'auction_ended' &&
                                                    <div className="my-2"><Tag className="p-2" color="green">Auction Ended</Tag></div>
                                                }

                                                {updateOffer() &&
                                                    <button className="my-4 px-5 py-3 mx-2" style={buttonStyle2} onClick={() => setUpdateModalVisible(true)}>Update Offer</button>
                                                }

                                            </>
                                        )
                                    )
                                }

                                {!user && asset.isListed && (
                                    <button className="my-4 px-5 py-3" style={buttonStyle} onClick={handleOffer}>SIGN IN TO COLLECT</button>
                                )}

                            </div>
                            <div className="col-sm-4 px-5">
                                <Link to={`/${creator.username}/profile`}>
                                    <div className="row my-4">
                                        <div className="col-3">
                                            <Avatar size="large" src={creator.picture} />
                                        </div>
                                        <div className="col-9">
                                            <div className="mx-3">
                                                {user && (
                                                    <div style={{ color: "#000000", fontSize: "120%", fontWeight: "500", marginLeft: "2px", marginTop: "-4px", marginBottom: 0 }}>
                                                        { creator._id === user._id ? "You" : creator.username}
                                                    </div>
                                                )}
                                                {!user && (
                                                    <div style={{ color: "#000000", fontSize: "120%", fontWeight: "500", marginLeft: "2px", marginTop: "-4px", marginBottom: 0 }}>
                                                        {creator.username}
                                                    </div>
                                                )}
                                                <span style={{ color: "#666666", fontSize: "90%", }}>Creator</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Link to={`/${owner.username}/profile`}>
                                    <div className="row my-5">
                                        <div className="col-3">
                                            <Avatar size="large" src={owner.picture} />
                                        </div>
                                        <div className="col-9">
                                            <div className="mx-3">
                                                {user && (
                                                    <div style={{ color: "#000000", fontSize: "120%", fontWeight: "500", marginLeft: "2px", marginTop: "-4px", marginBottom: 0 }}>
                                                        { owner._id === user._id ? "You" : owner.username}
                                                    </div>
                                                )}
                                                {!user && (
                                                    <div style={{ color: "#000000", fontSize: "120%", fontWeight: "500", marginLeft: "2px", marginTop: "-4px", marginBottom: 0 }}>
                                                        {owner.username}
                                                    </div>
                                                )}
                                                <span style={{ color: "#666666", fontSize: "90%", }}>Owner</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                {collection &&
                                    <Link to={`/collections/${collection.slug}`}>
                                        <div className="row my-5">
                                            <div className="col-3">
                                                <Avatar size="large" src={collection.cover} />
                                            </div>
                                            <div className="col-9">
                                                <div className="mx-3">
                                                    <div style={{ color: "#000000", fontSize: "120%", fontWeight: "500", marginLeft: "2px", marginTop: "-4px", marginBottom: 0 }}>
                                                        {collection.name}
                                                    </div>
                                                    <span style={{ color: "#666666", fontSize: "90%", }}>Collection</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                }
                                <div className="row my-5">
                                    <FavButton />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="container-fluid">
                                <div className="row my-3">
                                    <div className="col" style={{ width: "100%", margin: "0" }}>
                                        <Tabs size="large" type="card" tabBarGutter={8}>
                                            <TabPane tab={<div className="px-5 py-2">All Offers</div>} key="1">

                                                {offers.length <= 0 &&
                                                    <div className="py-5" style={{ display: "block", margin: "auto", textAlign: "center" }}>
                                                        <h4>No Offers Yet!</h4>
                                                    </div>
                                                }

                                                {offers.length > 0 && offers.map((offer) =>
                                                    <div className="my-2">
                                                        <Card key={offer._id} className="my-2 align-items-center" style={{ width: "100%", border: "1px solid #deebff", background: "#ffffff", borderRadius: "16px" }}>
                                                            <div className="row">
                                                                <div className="col-1 px-3">
                                                                    <Avatar size="large" src={offer.offerer.picture} />
                                                                </div>
                                                                <div className="col" style={{ fontSize: "120%" }}>
                                                                    {user && (offerers.includes(user._id) && owner._id !== user._id &&
                                                                        offerStatus(offer)
                                                                    )}
                                                                    {user && (owner._id === user._id &&
                                                                        offerStatus(offer)
                                                                    )}
                                                                    <Link to={`/${offer.offerer.username}/profile`}>
                                                                        {user &&
                                                                            (offer.offerer._id === user._id ? "You" : offer.offerer.username)
                                                                        }
                                                                        {!user &&
                                                                            (offer.offerer.username)
                                                                        }
                                                                    </Link>

                                                                         &ensp;made an offer of <b>{offer.offer} BLC</b>.
                                                                        <div style={{ fontSize: "60%", color: "#666666", textTransform: "uppercase" }}>
                                                                        {moment.utc(offer.updatedAt).local().startOf('seconds').fromNow()}
                                                                        {offer && offer.offer === highestOffer &&
                                                                            <>&emsp;<Tag size="small" color="orange" style={{ textTransform: "none" }}>Highest Offer</Tag></>
                                                                        }
                                                                    </div>
                                                                    {user && (
                                                                        user._id === owner._id && offer.status === 'Pending' && (
                                                                            <div className="my-3">
                                                                                <button type="button" className="px-5 py-2" style={{ cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff" }} onClick={() => { handleAcceptOffer(offer) }}>Accept</button>
                                                                                <button type="button" className="px-5 py-2 mx-2" style={{ cursor: "pointer", border: "1px solid #505F79", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#ffffff", color: "#505F79" }} onClick={() => { handleRejectOffer(offer) }}>Reject</button>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                )}
                                            </TabPane>

                                            <TabPane tab={<div className="px-5 py-2">History</div>} key="2">
                                                <div className="my-2">
                                                    {assetHistory && assetHistory.map((event) =>

                                                        <Card className="my-2 align-items-center" style={{ width: "100%", border: "1px solid #deebff", background: "#ffffff", borderRadius: "16px" }}>
                                                            <div className="row">
                                                                <div className="col-1 px-3">
                                                                    {
                                                                        event.event === 'Minted NFT' ? <Avatar size="large" icon={<ExperimentTwoTone twoToneColor="#3F2BE5" style={{ fontSize: "75%" }} />} style={{ backgroundColor: '#ebe9fc' }} />
                                                                            : event.event === 'Listed NFT' ? <Avatar size="large" icon={<TagTwoTone twoToneColor="#FF5733" style={{ fontSize: "75%" }} />} style={{ backgroundColor: '#ffeeea' }} />
                                                                                : <Avatar size="large" icon={<InteractionTwoTone twoToneColor="#04aa49" style={{ fontSize: "75%" }} />} style={{ backgroundColor: '#e6f8ed' }} />
                                                                    }
                                                                </div>
                                                                <div className="col" style={{ fontSize: "120%" }}>
                                                                    {user && (
                                                                        <>
                                                                            <span>
                                                                                {event.event === 'Minted NFT' ? "Minted by "
                                                                                    : event.event === 'Listed NFT' ? "Listed by "
                                                                                        : "Transferred to "}
                                                                            </span>

                                                                            {event.event === 'Transferred NFT' ?
                                                                                <Link to={`/${event.to.username}/profile`}>
                                                                                    {event.to._id === user._id ? "You" : event.to.name}
                                                                                </Link>
                                                                                :
                                                                                <Link to={`/${event.from.username}/profile`}>
                                                                                    {event.from._id === user._id ? "You" : event.from.name}
                                                                                </Link>
                                                                            }.
                                                                        </>
                                                                    )}
                                                                    {!user && (
                                                                        <>
                                                                            <span>
                                                                                {event.event === 'Minted NFT' ? "Minted by"
                                                                                    : event.event === 'Listed NFT' ? "Listed by"
                                                                                        : "Transferred to"}
                                                                            </span>

                                                                            {event.event === 'Transferred NFT' ?
                                                                                <Link to={`/${event.to.username}/profile`}>
                                                                                    {event.to.name}
                                                                                </Link>
                                                                                :
                                                                                <Link to={`/${event.from.username}/profile`}>
                                                                                    {event.from.name}
                                                                                </Link>
                                                                            }.
                                                                    </>
                                                                    )}
                                                                    <div style={{ fontSize: "75%", color: "#666666", fontWeight: "400", textTransform: "lowercase" }}>{event.createdAt && moment.utc(event.createdAt).local().startOf('seconds').fromNow()}</div>
                                                                </div>
                                                            </div>
                                                        </Card>

                                                    )}
                                                </div>
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        )
    }

    return (
        <Layout style={{ background: "#ffffff" }}>
            { dataFetched ?
                <>
                    <Helmet>
                        <title>{asset.name} | Bloc | Market</title>
                    </Helmet>
                    <div className="container-fluid my-5">
                        <div className="row p-5 my-2">
                            <div className="container my-3">
                                {assetDetails()}
                            </div>
                        </div>
                    </div>

                    <MakeOfferModal assetData={asset} highestOffer={highestOffer} ownerId={owner._id} reload={loadAssetInfo} modal={modal} setModalVisible={setModalVisible} inputStyle={inputStyle} modalButtonStyle={modalButtonStyle} buttonLabel={buttonLabel} setButtonLabel={setButtonLabel} />

                    <Modal
                        title={<h5><b>Update Offer</b></h5>}
                        visible={updateModal}
                        centered
                        destroyOnClose={true}
                        footer={null}
                        maskClosable={false}
                        width={360}
                        onCancel={closeModal}
                    >
                        <div className="">
                            <div className="my-1" style={{ fontSize: "large" }}>
                                Price: <b>{asset.price} BLC</b><br />
                                Minimum Offer Price: <b>{asset.minPrice} BLC</b><br />
                                Highest Offer: <b>{highestOffer} BLC</b>
                                <Divider />
                                Your Balance: <b>{balance}</b>
                            </div>
                        </div>
                        <Divider />
                        <form onSubmit={e => { e.preventDefault(); }}>
                            <div className="form-group my-3">
                                <label>Your Offer (BLC)</label>
                                <input type="number" min="0" className="py-3 px-4 my-3" placeholder="Enter offer price here..." value={myOfferPrice} onChange={inputOffer} style={inputStyle} />
                                <br />
                                {minPriceValidity}
                                {minBalanceValidity}
                            </div>
                            <button type="button" className="px-5 py-3 my-2" onClick={updateOfferModal} style={modalButtonStyle} disabled={disabled}>{buttonUpdateLabel}</button>
                        </form>
                    </Modal>

                </>
                :
                <div className="container-fluid py-5">
                    <div className="my-5" style={{ position: 'absolute', top: '36%', fontSize: "300%", fontWeight: "bold", left: '48%', msTransform: 'translateY(-50%)', transform: 'transalateY(-50%)' }}>
                        <LoadingOutlined />
                    </div>
                </div>
            }
        </Layout>
    )
}

export default AssetDetails;
