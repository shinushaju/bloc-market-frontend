import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs, Typography } from 'antd';
import { AppstoreAddOutlined, TagsOutlined, GiftOutlined } from '@ant-design/icons';
import OnSale from '../components/account/OnSale';
import UserProfile from '../components/account/Profile';
import Collections from '../components/account/Collections';
import Offers from '../components/account/Offers';
import { getMyAssetsOnSale } from '../helpers/asset';
import { getOffersReceived, getOffersSent } from '../helpers/offer';
import { Helmet } from 'react-helmet';

const { Title } = Typography;
const { TabPane } = Tabs;

const Store = () => {

    const { user } = useSelector((state) => ({ ...state }));

    // states
    const [assets, setAssets] = useState([]);
    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        getMyAssetsOnSale(user._id, user.token)
            .then((res) => {
                setAssets(res.data);
            });

        getOffersSent(user._id, user.token)
            .then((res) => {
                setSent(res.data);
            });

        getOffersReceived(user._id, user.token)
            .then((res) => {
                setReceived(res.data);
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
                    <div className="col py-4" style={{ width: "100%", margin: "0" }}>
                        <Title>My Store</Title>
                        <Tabs size="large">
                            <TabPane
                                tab={
                                    <span>
                                        <AppstoreAddOutlined />
                                        <span>Collections</span>
                                    </span>
                                }
                                key="1"
                            >
                                <Collections />
                            </TabPane>
                            <TabPane
                                tab={
                                    <span>
                                        <TagsOutlined />
                                        <span>On Sale ({assets.length})</span>
                                    </span>
                                }
                                key="2"
                            >
                                <OnSale onSaleItems={assets} />
                            </TabPane>
                            <TabPane
                                tab={
                                    <span>
                                        <GiftOutlined />
                                        <span>Offers</span>
                                    </span>
                                }
                                key="3"
                            >
                                <Offers user={user} offersSent={sent} offersReceived={received} />
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Store;