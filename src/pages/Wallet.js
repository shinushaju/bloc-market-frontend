import React, { useState } from 'react';
import { Button, Typography, Modal, Divider } from 'antd';
import UserProfile from '../components/account/Profile';
import { Helmet } from 'react-helmet';

const { Title } = Typography;

const Store = () => {

    const [balance, setBalance] = useState(120.95);
    const [modalVisible, setModalVisible] = useState(false);
    const [deposit, setDeposit] = useState(null);

    const inputStyle = { border: "none", borderRadius: "8px", width: "100%", fontWeight: "500", fontSize: "larger", backgroundColor: "#F4F5F7", color: "#666666" }
    const modalButtonStyle = { display: "block", width: "100%", margin: "auto", cursor: "pointer", border: "none", borderRadius: "100px", fontWeight: "500", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff" }

    const depositTokens = () => {
        setModalVisible(true);
    }

    const handleDeposit = () => {
        setModalVisible(false);
        setDeposit(null);
    }

    const closeModal = () => {
        setModalVisible(false);
        setDeposit(null);
    }

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
                        <div className="row my-4">
                            <div className="col-6">
                                <div className="py-5 m-2" style={{ textAlign: "center", borderRadius: "36px", background: "#0065ff", color: "#ffffff" }}>
                                    Your Wallet Balance
                                <div style={{ fontSize: "200%", color: "#ffffff" }} className="mt-3">
                                        <h1 style={{ color: "#ffffff" }}>{balance} BLC</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div style={{ textAlign: "center", color: "#666666", width: "75%", display: "block", margin: "auto" }}>
                                    Deposit Tokens In Wallet
                                <br />
                                    <Button size="large" block type="primary" className="mt-2" onClick={depositTokens}>Deposit Tokens</Button>
                                </div>
                                <div className="mt-4" style={{ textAlign: "center", color: "#666666", width: "75%", display: "block", margin: "auto" }}>
                                    Withdraw From Wallet
                                <br />
                                    <Button disabled size="large" block className="mt-2">Withdraw Tokens</Button>
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
                width={360}
                onCancel={closeModal}
            >
                <div className="">
                    <div className="my-1" style={{ fontSize: "large" }}>
                        <small>Your Balance</small>
                        <h2>{balance} BLC</h2>
                    </div>
                </div>
                <Divider />
                <form onSubmit={e => { e.preventDefault(); }}>
                    <div className="form-group my-3">
                        <label>Deposit Amount (BLC)</label>
                        <input type="number" min="0" className="py-3 px-4 my-3" placeholder="Enter deposit amount here..." value={deposit} onChange={(e) => setDeposit(e.target.value)} style={inputStyle} />
                    </div>
                    <button type="button" className="px-5 py-3 my-2" style={modalButtonStyle} onClick={handleDeposit} disabled={!deposit}>Deposit Amount</button>
                </form>
            </Modal>
        </>
    )
}

export default Store;