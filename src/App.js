import React, { useEffect } from 'react';
import Navbar from './components/navigation/Navbar';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from './helpers/auth'

import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import CompleteSignup from './pages/auth/CompleteSignup';
import ForgotPassword from './pages/auth/ForgotPassword';


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                picture: res.data.picture,
                _id: res.data._id,
                token: idTokenResult.token,
              },
            });
          })
          .catch((error) => console.log(error.message));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Layout style={{ backgroundColor: "#ffffff" }}>
      <Navbar />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/sign-up" component={Signup} />
        <Route exact path="/sign-up/complete" component={CompleteSignup} />
        <Route exact path="/password/reset" component={ForgotPassword} />
      </Switch>
    </Layout>
  );
}

export default App;
