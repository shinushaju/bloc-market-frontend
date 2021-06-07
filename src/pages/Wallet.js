import React, { useState } from 'react';
import { Typography, Modal, Divider } from 'antd';
import UserProfile from '../components/account/Profile';
import { Helmet } from 'react-helmet';

const { Title } = Typography;

const Store = () => {

    const [balance, setBalance] = useState(0);
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
                        <div className="row mt-5" style={{ height: "360px" }}>
                            <div className="col-sm-4">
                                <div className="m-2" style={{ height: "345px", textAlign: "center", borderRadius: "36px", background: "#0065ff", color: "#ffffff" }}>
                                    <div style={{ position: "absolute", top: "30%", left: "30%" }}>
                                        Your Wallet Balance
                                <div style={{ fontSize: "200%", color: "#ffffff" }} className="mt-3">
                                            <h1 style={{ color: "#ffffff" }}>{balance}</h1>
                                            <div>BLC</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="m-2" style={{ height: "345px", textAlign: "center", color: "#666666", borderRadius: "36px", background: "#F4F5F7", color: "#666666" }}>
                                    <div style={{ position: "absolute", top: "36%", left: "19%" }}>
                                        Deposit Tokens
                                        <button size="large" block type="primary" className="mt-4 px-5 py-3" style={modalButtonStyle} onClick={depositTokens}>Deposit Tokens</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="m-2" style={{ height: "345px", textAlign: "center", color: "#666666", borderRadius: "36px", background: "#F4F5F7", color: "#666666" }}>
                                    <div style={{ position: "absolute", top: "36%", left: "17%" }}>
                                        Withdraw Tokens
                                        <button disabled size="large" block className="mt-4 px-5 py-3" style={modalButtonStyle} >Withdraw Tokens</button>
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
                        <h1>{balance} <small>BLC</small></h1>
                    </div>
                </div>
                <Divider />
                <form onSubmit={e => { e.preventDefault(); }}>
                    <div className="form-group my-3">
                        <label>Deposit Amount (BLC)</label>
                        <input type="number" min="0" className="py-3 px-4 my-3" placeholder="Enter deposit amount..." value={deposit} onChange={(e) => setDeposit(e.target.value)} style={inputStyle} />
                    </div>
                    <button type="button" className="px-5 py-3 my-2" style={modalButtonStyle} onClick={handleDeposit} disabled={!deposit}>Deposit Amount</button>
                </form>
            </Modal>
        </>
    )
}

export default Store;