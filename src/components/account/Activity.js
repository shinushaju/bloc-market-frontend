import { Table } from 'antd';
import React from 'react';

const Activity = () => {

    const columns = [
        {
            title: <b>Event</b>,
            dataIndex: 'event',
        },
        {
            title: <b>Item</b>,
            dataIndex: 'item',
            width: 200,
        },
        {
            title: <b>Quantity</b>,
            dataIndex: 'quantity',
        },
        {
            title: <b>From</b>,
            dataIndex: 'from',
        },
        {
            title: <b>To</b>,
            dataIndex: 'to',
        },
        {
            title: <b>Date</b>,
            dataIndex: 'date',
        },
    ];

    const data = [];
    for (let i = 0; i < 100; i++) {
        data.push({
            key: i,
            event: 'Created',
            item: 'orc',
            quantity: 1,
            from: 'Null Address',
            to: 'You',
            date: `${i+3} days ago`
        });
    }

    return (
        <div className="container-fluid py-2">
            <h3>Trading History</h3>
            <Table bordered={false} columns={columns} dataSource={data} pagination={false} scroll={{ y: 400 }} />
        </div>
    )
}

export default Activity;