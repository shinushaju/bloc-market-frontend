import React from 'react';
import { Modal } from 'antd';

const UpdateCollectionModal = ({ props, handleSubmit, handleCoverImageUpdate }) => {

    const labelStyle = { cursor: "pointer", border: "2px solid #050D1B", borderRadius: "8px", fontWeight: "400", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff", textAlign: "center" }

    return (
        <Modal
            title={<h3>Update Collection</h3>}
            centered
            visible={props.modal}
            footer={null}
            width={400}
            maskClosable={false}
            onCancel={() => props.setModalVisible(false)}
        >
            <form onSubmit={handleSubmit}>
                <div className="row form-group">
                    <div className="col-3">
                        <img src={props.cover} style={{ borderRadius: "8px" }} alt={props.name} width="100%" />
                    </div>
                    <div className="col-9">
                        Click to Update Logo
                    <br />
                        <label htmlFor="file-upload" className="px-4 py-2 my-2" style={labelStyle}>
                            {props.logoButtonLabel}
                            <input id="file-upload" type="file" accept="image/png,image/jpg,image/jpeg" multiple={false} onChange={handleCoverImageUpdate} />
                        </label>
                    </div>
                </div>
                <div className="form-group my-4">
                    <label>Collection name</label>
                    <input type="text" className="py-3 px-4" placeholder="Example: Arcnet" value={props.name} onChange={(e) => props.setName(e.target.value)} style={props.inputStyle} />
                </div>
                <div className="form-group my-3">
                    <label>Description</label>
                    <textarea rows="5" type="text" className="py-3 px-4" placeholder="Description for your store..." value={props.description} onChange={(e) => props.setDescription(e.target.value)} style={props.inputStyle} ></textarea>
                </div>
                <button type="button" className="px-5 py-3 my-3" style={props.buttonStyle2} onClick={handleSubmit} disabled={!props.name || !props.description}>{props.buttonLabel}</button>
            </form>
        </Modal>
    )
}

export default UpdateCollectionModal;