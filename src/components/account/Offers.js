import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Card, Tag, Avatar, Modal, message } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';
import moment from 'moment';
import { getOffersSent, withdrawOffer } from '../../helpers/offer';
const { TabPane } = Tabs;

const Offers = ({ user, offersSent, offersReceived }) => {

    moment().format();

    // states
    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        setSent(offersSent);
        setReceived(offersReceived);
    }

    const offerStatus = (offer) => {
        if (offer.status === 'Pending') {
            return (
                <Tag color="purple" style={{ float: "right" }}>{offer.status}</Tag>
            )
        }
        if (offer.status === 'Accepted') {
            return (
                <Tag color="green" style={{ float: "right" }}>{offer.status}</Tag>
            )
        }
        if (offer.status === 'Rejected') {
            return (
                <Tag color="red" style={{ float: "right" }}>{offer.status}</Tag>
            )
        }
        if (offer.status === 'Withdrawn') {
            return (
                <Tag color="volcano" style={{ float: "right" }}>{offer.status}</Tag>
            )
        }
    }


    const confirmOfferWithdrawal = (offer) => {
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
                    withdrawOffer(user._id, offer._id, user.token)
                        .then((res) => {
                            status = res.data;
                            setTimeout(() => {
                                getOffersSent(user._id, user.token)
                                    .then((res) => {
                                        setSent(res.data);
                                        message.success("Offer Withdrawn", 5);
                                    });
                            }, 1500)
                        })

                    setTimeout(status === 'Withdrawn' ? resolve : reject, 1800);
                }).catch(() => console.log('Error'));
            },
        });
    }

    const deleteOffer = (offer) => {
        withdrawOffer(user._id, offer._id, user.token)
            .then(() => {
                getOffersSent(user._id, user.token)
                    .then((res) => {
                        setSent(res.data);
                    });
            })

    }

    return (
        <div className="col my-2" style={{ width: "100%", margin: "0" }}>
            <Tabs size="large" type="card" tabBarGutter={8}>
                <TabPane tab={<div className="px-5 py-2">Offers Received ({received.length})</div>} key="1">
                    {received.length <= 0 &&
                        <div className="py-5" style={{ display: "block", margin: "auto", textAlign: "center" }}>
                            <h4>You haven't received any new offers yet!</h4>
                        </div>
                    }
                    {received.length > 0 && received.map((offer) =>
                        <div key={offer._id} className="my-2">
                            <Card className="my-2 align-items-center" style={{ width: "100%", border: "1px solid #deebff", background: "#ffffff", borderRadius: "16px" }}>
                                <div className="row">
                                    <div className="col-1 px-3">
                                        <Avatar size="large" src={offer.offerer.picture} />
                                    </div>
                                    <div className="col" style={{ fontSize: "120%" }}>
                                        {offerStatus(offer)}
                                        <Link to={`${offer.offerer.username}/profile`}>{offer.offerer.username}</Link> made an offer of <b>{offer.offer} BLC</b> on <Link to={`/assets/${offer.asset.slug}`}>{offer.asset.name}</Link>.
                                        <div style={{ fontSize: "60%", color: "#666666", textTransform: "uppercase" }}>
                                            {moment.utc(offer.updatedAt).local().startOf('seconds').fromNow()}
                                        </div>
                                        {offer.status === 'Pending' &&
                                            <div className="my-3">
                                                <Link to={`/assets/${offer.asset.slug}`}>
                                                    <button type="button" className="px-5 py-2" style={{ cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff" }}>View</button>
                                                </Link>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </TabPane>

                <TabPane tab={<div className="px-5 py-2">Offers Sent ({sent.length})</div>} key="2">
                    {sent.length <= 0 &&
                        <div className="py-5" style={{ display: "block", margin: "auto", textAlign: "center" }}>
                            <h4>You haven't made any new offers yet!</h4>
                        </div>
                    }
                    {sent.length > 0 && sent.map((offer) =>
                        <div key={offer._id} className="my-2">
                            <Card className="my-2 align-items-center" style={{ width: "100%", border: "1px solid #deebff", background: "#ffffff", borderRadius: "16px" }}>
                                <div className="row">
                                    <div className="col-1 px-3">
                                        <Avatar size="large" shape="square" src={offer.asset.assetFile} />
                                    </div>
                                    <div className="col" style={{ fontSize: "120%" }}>
                                        {offer.status === 'Rejected' &&
                                            <CloseCircleTwoTone style={{ float: "right" }} onClick={() => { deleteOffer(offer) }} />
                                        }
                                        {offerStatus(offer)}
                                        You made an offer of <b>{offer.offer} BLC</b> on <Link to={`/assets/${offer.asset.slug}`}>{offer.asset.name}</Link>.
                                                            <div style={{ fontSize: "60%", color: "#666666", textTransform: "uppercase" }}>
                                            {moment.utc(offer.updatedAt).local().startOf('seconds').fromNow()}
                                        </div>
                                        {offer.status === 'Pending' &&
                                            <div className="my-3">
                                                <button type="button" className="px-5 py-2" style={{ cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff" }} onClick={() => { confirmOfferWithdrawal(offer) }}>Withdraw</button>
                                                <Link to={`/assets/${offer.asset.slug}`}>
                                                    <button type="button" className="px-5 py-2 mx-2" style={{ cursor: "pointer", border: "1px solid #050D1B", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#FFFFFF", color: "#050D1B" }}>View</button>
                                                </Link>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </TabPane>
            </Tabs>
        </div>
    )
}

export default Offers;