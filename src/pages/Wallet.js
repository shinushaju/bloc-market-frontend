import React, { useState, useEffect } from "react";
import { Typography, Modal, Divider, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import UserProfile from "../components/account/Profile";
import { LoadingOutlined } from "@ant-design/icons";

import { Helmet } from "react-helmet";
import { depositBlocCoins, fetchWalletBalance } from "../helpers/wallet";
import { tokenDepositNotification } from "../helpers/notification";

const { Title } = Typography;

const Store = () => {

  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));

  const [balance, setBalance] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Deposit");
  const [fetchingBalance, setFetchingBalance] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const inputStyle = {
    border: "none",
    borderRadius: "8px",
    width: "100%",
    fontWeight: "500",
    fontSize: "larger",
    backgroundColor: "#F4F5F7",
    color: "#666666",
  };
  const modalButtonStyle = {
    display: "block",
    width: "100%",
    margin: "auto",
    cursor: "pointer",
    border: "none",
    borderRadius: "100px",
    fontWeight: "500",
    fontSize: "medium",
    backgroundColor: "#050D1B",
    color: "#ffffff",
  };

  const depositTokens = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    fetchWalletBalance(user.address, user.token).then((res) => {
      setBalance(parseFloat(res.data));
      setFetchingBalance(false);
      dispatch({
        type: "UPDATE_WALLET_BALANCE",
        payload: res.data
      });
    });
  }, [user.address, user.token, dispatch]);

  const handleDeposit = () => {
    setDisabled(true);
    setButtonLabel(
      <LoadingOutlined style={{ color: "#ffffff", fontSize: "large" }} />
    );
    depositBlocCoins(user.address, { amount }, user.token)
      .then((res) => {
        fetchWalletBalance(user.address, user.token).then((res) => {
          setBalance(parseFloat(res.data));
          dispatch({
            type: "UPDATE_WALLET_BALANCE",
            payload: {
              balance: res.data,
            },
          });
        });
        tokenDepositNotification({ receiver: user._id, amount, event: "Token Deposited" }, user.token);
        setModalVisible(false);
        setDisabled(false);
        setButtonLabel("Deposit");
        setAmount("");
      })
      .catch((error) => {
        console.log(error);
        setDisabled(false);
        setButtonLabel("Deposit");
      });
  };

  const closeModal = () => {
    setModalVisible(false);
    setAmount("");
    setButtonLabel("Deposit");
  };

  return (
    <>
      <Helmet>
        <title>My Wallet | Bloc | Market</title>
      </Helmet>
      <div className="container-fluid my-5">
        <div className="row px-4 py-4">
          <div className="col-3">
            <UserProfile />
          </div>
          <div className="col py-4" style={{ width: "100%", margin: "0" }}>
            <Title>My Wallet</Title>
            <div className="row mt-5" style={{ height: "360px" }}>
              <div className="col-sm-4">
                <div
                  className="m-2"
                  style={{
                    height: "345px",
                    textAlign: "center",
                    borderRadius: "36px",
                    border: "1px solid #F4F5F7",
                    background: "#ffffff",
                    color: "#000000",
                    boxShadow: "rgba(0, 0, 0, 0.1) 3px 5px 25px -6px"
                  }}
                >
                  <div
                    style={{ position: "relative", top: "30%", textAlign: "center", color: "#666666" }}
                  >
                    Balance
                    <div style={{ color: "#000000" }}>

                      {fetchingBalance && <div style={{ lineHeight: "96px" }}><LoadingOutlined style={{ color: "#000000", fontSize: "200%", fontWeight: "700" }} /></div>}
                      {!fetchingBalance &&
                        <div
                          style={{
                            color: "#000000",
                            fontWeight: "500",
                            fontSize: "300%",
                          }}
                        >
                          <Tooltip title={balance+ " BLC"} color="#0065ff">
                            {balance.toString().split('.')[0]}{balance.toString().split('.')[1] && "." + balance.toString().split('.')[1].substring(0, 3)}
                          </Tooltip>
                        </div>
                      }

                      <div style={{ fontSize: "150%" }}>BLC</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div
                  className="m-2"
                  style={{
                    height: "345px",
                    textAlign: "center",
                    color: "#666666",
                    borderRadius: "36px",
                    border: "1px dashed #cccccc",
                    background: "#FFFFFF",
                  }}
                >
                  <div style={{ position: "relative", top: "30%" }}>
                    <div
                      className="px-4"
                      style={{ display: "block", margin: "auto" }}
                    >
                      Deposit Tokens
                    <button
                        size="large"
                        type="primary"
                        className="mt-4 px-5 py-3"
                        style={modalButtonStyle}
                        onClick={depositTokens}
                      >
                        Deposit Tokens
                    </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div
                  className="m-2"
                  style={{
                    height: "345px",
                    textAlign: "center",
                    color: "#666666",
                    borderRadius: "36px",
                    background: "#F4F5F7",
                  }}
                >
                  <div style={{ position: "relative", top: "30%" }}>
                    <div
                      className="px-4"
                      style={{ display: "block", margin: "auto" }}
                    >
                      Withdraw Tokens
                    <button
                        disabled
                        size="large"
                        className="mt-4 px-5 py-3"
                        style={modalButtonStyle}
                      >
                        Withdraw Tokens
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={<h5>Deposit Tokens</h5>}
        visible={modalVisible}
        centered
        destroyOnClose={true}
        footer={null}
        maskClosable={false}
        width={300}
        onCancel={closeModal}
      >
        <div className="">
          <div className="my-1" style={{ fontSize: "large" }}>
            <small>Your Balance:</small>
            {balance &&
              <h1>
                <Tooltip title={balance+ " BLC"} color="#0065ff" placement="bottom">
                  {balance.toString().split('.')[0]}{balance.toString().split('.')[1] && "." + balance.toString().split('.')[1].substring(0, 3)}
                </Tooltip>
                <span style={{ color: "#666666", fontSize: "75%" }}> BLC</span>
              </h1>
            }
          </div>
        </div>
        <Divider />
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="form-group my-3">
            <label>Deposit Amount (BLC)</label>
            <input
              type="number"
              min="0"
              className="py-3 px-4 my-3"
              placeholder="Enter deposit amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button
            type="button"
            className="px-5 py-3 my-2"
            style={modalButtonStyle}
            onClick={handleDeposit}
            disabled={!amount || disabled}
          >
            {buttonLabel}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Store;
