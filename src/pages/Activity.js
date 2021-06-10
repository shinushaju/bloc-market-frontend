import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Avatar, Timeline } from 'antd';
import { Link } from 'react-router-dom';
import { ExperimentTwoTone, TagTwoTone, InteractionTwoTone } from '@ant-design/icons';
import { getActivity } from '../helpers/activity';
import moment from 'moment';

const { Title } = Typography;

const Activity = () => {

    moment().format();

    const [acitivities, setActivities] = useState();

    useEffect(() => {
        getActivity()
            .then((res) => {
                setActivities(res.data);
            })
    }, [])

    return (
        <Layout style={{ background: "#ffffff" }}>
            <div className="container-fluid my-5">
                <div className="row p-5 my-2">
                    <div style={{ width: "100%", textAlign: "center" }} className="row px-5 mx-2">
                        <div className="col-12">
                            <Title>Activity</Title>

                        </div>
                    </div>

                    <div className="container mt-5">

                        <Timeline mode="alternate" className="p-3">
                            {acitivities && acitivities.map((activity) =>
                                <Timeline.Item

                                    dot={
                                        activity.event === 'Minted NFT' ? <Avatar size="large" icon={<ExperimentTwoTone twoToneColor="#3F2BE5" style={{ fontSize: "75%" }} />} style={{ backgroundColor: '#ebe9fc' }} />
                                            : activity.event === 'Listed NFT' ? <Avatar size="large" icon={<TagTwoTone twoToneColor="#FF5733" style={{ fontSize: "75%" }} />} style={{ backgroundColor: '#ffeeea' }} />
                                                : <Avatar size="large" icon={<InteractionTwoTone twoToneColor="#04aa49" style={{ fontSize: "75%" }} />} style={{ backgroundColor: '#e6f8ed' }} />
                                    }
                                >
                                    <Card className="mx-3" style={{ border: "1px solid #deebff", background: "#ffffff", borderRadius: "16px" }}>
                                        <div className="row">
                                            <div className="col-2">
                                                <Avatar size={48} shape="square" src={activity.nft.assetFile} />
                                            </div>
                                            <div className="col" style={{ fontSize: "120%" }}>

                                                <div>
                                                    {activity.event === 'Minted NFT' ?
                                                        <p>
                                                            <Link to={`/assets/${activity.nft.slug}`}>
                                                                {activity.nft.name}
                                                            </Link>
                                                                     &ensp;was minted by&ensp;
                                                                    <Link to={`/${activity.from.username}/profile`}>
                                                                {activity.from.name}
                                                            </Link>
                                                            .</p>

                                                        : activity.event === 'Listed NFT' ?
                                                            <p>
                                                                <Link to={`/assets/${activity.nft.slug}`}>
                                                                    {activity.nft.name}
                                                                </Link>
                                                                 &ensp;was listed by&ensp;
                                                                <Link to={`/${activity.from.username}/profile`}>
                                                                    {activity.from.name}
                                                                </Link>
                                                        .</p>
                                                            :
                                                            <p>
                                                                <Link to={`/assets/${activity.nft.slug}`}>
                                                                    {activity.nft.name}
                                                                </Link>
                                                                     &ensp;was transferred to&ensp;
                                                                    <Link to={`/${activity.to.username}/profile`}>
                                                                    {activity.to.name}
                                                                </Link> &ensp;by&ensp;
                                                                <Link to={`/${activity.from.username}/profile`}>
                                                                    {activity.from.name}
                                                                </Link>
                                                            .</p>
                                                    }
                                                </div>

                                                <div style={{ fontSize: "90%", color: "#666666", fontWeight: "400", textTransform: "lowercase" }}>{activity.createdAt && moment.utc(activity.createdAt).local().startOf('seconds').fromNow()}</div>
                                            </div>
                                        </div>
                                    </Card>
                                </Timeline.Item>
                            )}

                        </Timeline>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default Activity;