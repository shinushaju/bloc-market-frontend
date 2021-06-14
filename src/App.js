import React, { useEffect } from 'react';
import { BrowserView, isMobile } from 'react-device-detect';

import Navbar from './components/navigation/Navbar';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from './helpers/auth'
import { Helmet } from 'react-helmet';

// pages
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import CompleteSignup from './pages/auth/CompleteSignup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Activity from './pages/Activity';
import Notifications from './pages/Notifications';
import Account from './pages/Account';
import Store from './pages/Store';
import Collection from './pages/Collection';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import AssetDetails from './pages/AssetDetails';
import EditProfile from './pages/EditProfile';
import AccountSettings from './pages/AccountSettings';
import PublicProfile from './pages/PublicProfile';
import CollectionProfile from './pages/CollectionProfile';
import ChangePassword from './pages/ChangePassword';
import SellItem from './pages/SellItem';

//  user route component
import UserRoute from "./components/routes/UserRoute";
//import PageNotFound from './pages/PageNotFound';
import Wallet from './pages/Wallet';
import { fetchWalletBalance } from './helpers/wallet';


const App = () => {

  const dispatch = useDispatch();
  const mobile = isMobile;
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "CURRENT_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                username: res.data.username,
                picture: res.data.picture,
                _id: res.data._id,
                address: res.data.address,
                privateKey: res.data.privateKey,
                token: idTokenResult.token,
              }
            });
            fetchWalletBalance(res.data.address, idTokenResult.token)
              .then((res) => {
                dispatch({
                  type: "WALLET_BALANCE",
                  payload: {
                    balance: res.data
                  }
                });
              })
          })
          .catch((error) => console.log(error.message));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);


  if (mobile) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F5F6FA", display: "flex", color: "#050D1B", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", fontSize: "150%" }}>
          <h4>We're coming soon to mobile!</h4>
          <p>&#128075; See you on a desktop!</p>
          <span style={{ color: "#666666" }}>- Bloc Team</span>
        </div>
      </div>)
  }
  else {
    return (
      <BrowserView>
        <Helmet>
          <title>Bloc | Market - Buy & Sell NFTs</title>
        </Helmet>
        <Layout style={{ backgroundColor: "#ffffff" }}>
          <Navbar />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/sign-up" component={Signup} />
            <Route exact path="/sign-up/complete" component={CompleteSignup} />
            <Route exact path="/password/reset" component={ForgotPassword} />
            <Route exact path="/" component={Home} />
            <Route exact path="/assets" component={Explore} />
            <Route exact path="/assets/:item" component={AssetDetails} />
            <Route exact path="/activity" component={Activity} />
            <Route exact path="/:username/profile" component={PublicProfile} />
            <Route exact path="/collections/:collection" component={CollectionProfile} />
            {/*
          <Route path="/404" component={PageNotFound} />
          <Redirect to="/404" />
          */}

            {/* authorized user routes*/}
            <UserRoute exact path="/notifications" component={Notifications} />
            <UserRoute exact path="/store" component={Store} />
            <UserRoute exact path="/account" component={Account} />
            <UserRoute exact path="/wallet" component={Wallet} />
            <UserRoute exact path="/store/:collection/assets" component={Collection} />
            <UserRoute exact path="/store/:collection/assets/mint" component={AddItem} />
            <UserRoute exact path="/store/:collection/assets/:asset/edit" component={EditItem} />
            <UserRoute exact path="/settings/account/profile/edit" component={EditProfile} />
            <UserRoute exact path="/settings/account" component={AccountSettings} />
            <UserRoute exact path="/password/change" component={ChangePassword} />
            <UserRoute exact path="/assets/:item/sell" component={SellItem} />
          </Switch>
        </Layout>
      </BrowserView>
    );
  }
}

export default App;
