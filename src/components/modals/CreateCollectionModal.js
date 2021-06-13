import React from 'react';
import { Modal, Alert } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';

//import CollectionNameValidation from '../../hooks/CollectionNameValidation';

const CreateCollectionModal = ({ props, handleSubmit, handleImage }) => {

    // const name = props.name;

   // const [isAvailable] = CollectionNameValidation({ name });

    const labelStyle = { cursor: "pointer", width: "100%", border: "2px solid #050D1B", borderRadius: "8px", fontWeight: "400", fontSize: "medium", backgroundColor: "#050D1B", color: "#ffffff", textAlign: "center" }

    // collection name validation
    // var nameAvailable;

    // if (!isAvailable) {
       // nameAvailable = <div style={{ color: "red" }}>Collection name taken.</div>;
    // }

    return (
        <Modal
            title={<h5><b>Create New Collection</b></h5>}
            visible={props.modal}
            footer={null}
            centered
            width={400}
            maskClosable={false}
            onCancel={() => props.setModalVisible(false)}
        >
            <form onSubmit={e => { e.preventDefault(); }}>
                <div className="form-group ">
                    <label htmlFor="file-upload" className="px-4 py-3" style={labelStyle}>
                        {!props.coverFile ? 'Upload a Logo' : 'Change Logo'}
                        <input id="file-upload" type="file" accept="image/png,image/jpg,image/jpeg" multiple={false} onChange={handleImage}/>
                    </label>
                    {props.coverFile && <span> <PaperClipOutlined style={{ color: "#0065FF" }} /> {props.cover}</span>}
                </div>
                <div className="form-group my-3">
                    <label>Collection name</label>
                    <input type="text" className="py-3 px-4" placeholder="Example: Arcnet" value={props.name} onChange={(e) => props.setName(e.target.value)} style={props.inputStyle} />
                    {/*props.name && <div className="my-2">{nameAvailable}</div>*/}
                    {props.error && <Alert className="my-2" message={props.error} type="error" showIcon closable onClose={() => props.setError("")} />}
                </div>
                <div className="form-group my-3">
                    <label>Description</label>
                    <textarea rows="5" type="text" className="py-3 px-4" placeholder="Description for your store...(max. 200 characters)" value={props.description} onChange={(e) => props.setDescription(e.target.value)} style={props.inputStyle} ></textarea>
                </div>
                <button type="button" className="px-5 py-3 my-3" style={props.buttonStyle3} onClick={handleSubmit} disabled={!props.name || !props.description || !props.cover || !props.coverFile }>{props.buttonLabel}</button>
            </form>
        </Modal>
    )
}

export default CreateCollectionModal;