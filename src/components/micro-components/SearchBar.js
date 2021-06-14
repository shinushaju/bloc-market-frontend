import { useState, useEffect } from 'react';
import { Input, AutoComplete, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getAllAssets } from '../../helpers/asset';
import { getAllCollections } from '../../helpers/collection';
import { getOwners } from '../../helpers/users';

const SearchBar = () => {

    const [keyword, setKeyword] = useState("");
    const [assets, setAssets] = useState([]);
    const [collections, setCollections] = useState([]);
    const [artists, setArtists] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setInterval(() => {
            getAllAssets()
                .then((res) => {
                    setAssets(res.data);
                });

            getAllCollections()
                .then((res) => {
                    setCollections(res.data);
                })

            getOwners()
                .then((res) => {
                    setArtists(res.data);
                })
        }, 3000);
    }, [])

    // searched keyword
    const searched = (keyword) => (item) => item.name.toLowerCase().includes(keyword);

    // Search filter
    const handleSearchChange = (e) => {
        e.preventDefault();
        setKeyword(e.target.value.toLowerCase());
    }

    const renderTitle = (title) => (
        <span>
            {title}
        </span>

    );

    const renderAssets = (asset) => ({
        value: asset.name,
        label: (
            <a href={`/assets/${asset.slug}`}>
                <div
                    className="row"
                    style={{
                        color: "#050D1B",
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <div className="col-1">
                        <Avatar size="large" shape="square" src={asset.assetFile} />
                    </div>
                    <div className="ml-3 col">
                        {asset.name}
                        <div style={{ color: "#999999", fontSize: "95%" }}>
                            By <Avatar size={14} src={asset.owner.picture}></Avatar> {asset.owner.name} • Liked by {asset.favourites} Users
                        </div>
                    </div>
                </div>
            </a>
        ),
    });

    const renderCollections = (collection) => ({
        value: collection.name,
        label: (
            <a href={`/collections/${collection.slug}`}>
                <div
                    className="row"
                    style={{
                        color: "#050D1B",
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <div className="col-1">
                        <Avatar size="large" shape="square" src={collection.cover} />
                    </div>
                    <div className="ml-3 col">
                        {collection.name}
                        <div style={{ color: "#999999", fontSize: "95%" }}>
                            By <Avatar size={14} src={collection.owner.picture}></Avatar> {collection.owner.name}
                        </div>
                    </div>
                </div>
            </a>
        ),
    });

    const renderArtists = (artist) => ({
        value: artist.name,
        label: (
            <a href={`/${artist.username}/profile`}>
                <div
                    className="row"
                    style={{
                        color: "#050D1B",
                        display: 'flex',
                    }}
                >
                    <div className="col-1">
                        <Avatar size="large" shape="circle" src={artist.picture} />
                    </div>
                    <div className="ml-3 col">
                        {artist.name}
                        <div style={{ color: "#999999", fontSize: "95%" }}>{artist.followers.length} followers • {artist.following.length} following</div>
                    </div>
                </div>
            </a>
        ),
    });

    const handleSearch = (value) => {
        setOptions(
            !value
                ? []
                : [
                    {
                        label: renderTitle('NFTs'),
                        options:
                            assets.filter(searched(keyword)).map((asset) =>
                                renderAssets(asset)
                            ),
                    },
                    {
                        label: renderTitle('Collections'),
                        options:
                            collections.filter(searched(keyword)).map((collection) =>
                                renderCollections(collection)
                            ),
                    },
                    {
                        label: renderTitle('Artists'),
                        options:
                            artists.filter(searched(keyword)).map((artist) =>
                                renderArtists(artist)
                            ),
                    },
                ],
        );
    };

    return (
        <AutoComplete
            notFoundContent="No Results Found"
            options={options}
            backfill={true}
            filterOption={keyword, options}
            dropdownClassName="certain-category-search-dropdown"
            defaultActiveFirstOption={false}
            dropdownMatchSelectWidth={500}
            onSearch={handleSearch}
            style={{
                width: 500,
            }}

        >
            <Input
                maxLength={36}
                prefix={<SearchOutlined rotate="90" style={{ color: "#999999", fontSize: "120%" }} />}
                allowClear
                size="large"
                value={keyword}
                onChange={handleSearchChange}
                placeholder="Search NFTs, Collections, Artists..."
                bordered={false}
            />
        </AutoComplete>
    )

}

export default SearchBar;