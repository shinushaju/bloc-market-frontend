import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs, Typography } from 'antd';
import { DropboxOutlined, ClockCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';

// components
import Favourites from '../components/account/Favourites';
import UserProfile from '../components/account/Profile';
import Activity from '../components/account/Activity';
import OwnedItems from '../components/account/OwnedItems';

// api functions
import { getMyAssets } from '../helpers/asset';
import { getFavourites } from '../helpers/users';

const { TabPane } = Tabs;
const { Title } = Typography;

const Account = () => {

    const { user } = useSelector((state) => ({ ...state }));

    // states
    const [assets, setAssets] = useState([]);
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        getMyAssets(user._id)
            .then((res) => {
                setAssets(res.data);
            })

        getFavourites(user._id)
            .then((res) => {
                setFavourites(res.data.favourites);
            })
    }

    return (

        <>
            <Helmet>
                <title>My Account | Bloc | Market</title>
            </Helmet>
            <div className="container-fluid my-5">
                <div className="row px-4 py-4">
                    <div className="col-3">
                        <UserProfile />
                    </div>
                    <div className="col py-4" style={{ width: "100%", margin: "0" }}>
                        <Title>My Account</Title>

                        <Tabs size="large">
                            <TabPane
                                tab={
                                    <span>
                                        <DropboxOutlined />
                                        <span>Owned ({assets.length})</span>
                                    </span>
                                }
                                key="2"
                            >
                                <OwnedItems />
                            </TabPane>
                            <TabPane 
                                disabled
                                tab={
                                    <span>
                                        <ClockCircleOutlined />
                                        <span>Activity</span>
                                    </span>
                                }
                                key="3"
                            >
                                <Activity />
                            </TabPane>
                            <TabPane
                                tab={
                                    <span>
                                        <HeartOutlined />
                                        <span>Favourites ({favourites.length})</span>
                                    </span>
                                }
                                key="5"
                            >
                                <Favourites favourites={favourites} />
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Account;