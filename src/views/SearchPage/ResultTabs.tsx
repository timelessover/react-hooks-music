import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd-mobile'
import { get } from '../../utils/request'
import Loading from '../../components/Loading'
import style from './style/resultTabs.module.scss'
import { formatNumber } from '../../utils/util'
import dayjs from 'dayjs'
import Scroll from '../../components/Scroll'
import { useHistory } from 'react-router-dom'
import { inject, observer } from 'mobx-react'



const ResultTabs = (props: any) => {

    const { keywords } = props

    const [page, setPage] = useState(0) //当前Tab索引
    const [searchLoading, setSeachLoading] = useState(false) //搜索loading
    const [albums, setAlbums] = useState([]) //查询的单曲集合
    const [songs, setSongs] = useState([]) //查询的专辑集合
    const [artists, setArtists] = useState([]) //查询的歌手集合
    const [playlists, setPlaylists] = useState([])//查询的歌单集合

    const history = useHistory()


    useEffect(() => {
        getResult(keywords)
    }, [keywords])

    // componentWillUnmount(){
    //     setState = ()=>{
    //         return;
    //     };
    // }

    const getResult = async (keywords, type = 1) => {
        setSeachLoading(true)
        const res = await get(`/search?keywords=${keywords}&type=${type}`)
        const result = res.result || {}
        switch (type) {
            case 1: {
                setSongs(result.songs || [])
                break;
            }
            case 10: {
                setAlbums(result.albums || [])
                break;
            }
            case 100: {
                setArtists(result.artists || [])
                break;
            }
            case 1000: {
                setPlaylists(result.playlists || [])
                break;
            }
            default: {
                setSongs(result.songs || [])
                break;
            }

        }
        setSeachLoading(false)
    }
    const handleTabClick = (tab, page) => {
        setPage(page)
        getResult(keywords, tab.type)
    }
    const goTo = (page, id) => {
        history.push(`/${page}/${id}`)
    }
    const addSong = (item) => {

        let obj = {
            ...item,
            ar: item.artists,
            al: {
                picUrl: ''
            }
        }
        props.appStore.addSong(obj)
    }


    const { playlist } = props.appStore

    const h = playlist.length ? 60 : 0
    const height = { height: `calc(100vh - ${180 + h}px` }

    const tabs = [
        { title: '单曲', type: 1 },
        { title: '专辑', type: 10 },
        { title: '歌手', type: 100 },
        { title: '歌单', type: 1000 },
    ]

    const NoResult = () => (<div className={style['no-result']} >
        <div className={'iconfont icon-wukong'} style={{ fontSize: 28, marginBottom: 10 }
        } />
        < p > 暂无搜索结果...</p>
    </div>)

    return (
        <div>
            <Tabs tabs={tabs} onTabClick={handleTabClick} page={page} swipeable={false} animated={false}>
                {/*单曲*/}
                <div className={`${style['tab-item']} ${style.songs}`} style={height}>
                    <Scroll>
                        <ul>
                            {songs && songs.map(item => <li key={item.id} onClick={() => addSong(item)}>
                                <div className={style.left}>
                                    <p className={style.title}>{item.name}</p>
                                    <p className={style.info}>
                                        {item.artists && item.artists.reduce((init, current, index) => {
                                            if (index < item.artists.length - 1) {
                                                init += current.name + ' / '
                                            } else {
                                                init += current.name + ' - '
                                            }
                                            return init
                                        }, '')}
                                        {item.album && item.album.name}
                                    </p>
                                </div>
                                <div className={'iconfont icon-erji1'} />
                            </li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{ position: 'absolute', top: '40%' }} />
                        {!searchLoading && !songs.length && <NoResult />}
                    </Scroll>
                </div>
                {/*专辑*/}
                <div className={`${style['tab-item']} ${style.albums}`} style={height}>
                    <Scroll>
                        <ul>
                            {albums && albums.map(item => <li key={item.id} onClick={() => goTo('album', item.id)}>
                                <div>
                                    <img src={item.picUrl} alt="" />
                                </div>
                                <div className={style.info}>
                                    <div>{item.name}</div>
                                    <div className={style['sub-info']}>
                                        {item.artists && item.artists.reduce((init, current, index) => {
                                            if (index < item.artists.length - 1) {
                                                init += current.name + '/'
                                            } else {
                                                init += current.name + '  '
                                            }
                                            return init
                                        }, '')}
                                        {item.size}首&nbsp;
                                        {dayjs(item.publishTime).format('YYYY-MM-DD')}
                                    </div>
                                </div>
                            </li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{ position: 'absolute', top: '40%' }} />
                        {!searchLoading && !albums.length && <NoResult />}
                    </Scroll>
                </div>
                {/*歌手*/}
                <div className={`${style['tab-item']} ${style.artists}`} style={height}>
                    <Scroll>
                        <ul>
                            {artists && artists.map(item => <li key={item.id} onClick={() => goTo('singer', item.id)}>
                                <div>
                                    <img src={item.img1v1Url} alt="" style={{ borderRadius: '50%' }} />
                                </div>
                                <div className={style.info}>
                                    <div>{item.name}</div>
                                    <div className={style['sub-info']}>
                                        <span style={{ display: item.albumSize ? '' : 'none' }}>专辑:{item.albumSize}</span>&emsp;
                                        <span style={{ display: item.mvSize ? '' : 'none' }}>MV:{item.mvSize}</span>
                                    </div>
                                </div>
                            </li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{ position: 'absolute', top: '40%' }} />
                        {!searchLoading && !artists.length && <NoResult />}
                    </Scroll>
                </div>
                {/*歌单*/}
                <div className={`${style['tab-item']} ${style.playlists}`} style={height}>
                    <Scroll>
                        <ul>
                            {playlists && playlists.map(item => <li key={item.id} onClick={() => goTo('sheet', item.id)}>
                                <div>
                                    <img src={item.coverImgUrl} alt="" />
                                </div>
                                <div className={style.info}>
                                    <div>{item.name}</div>
                                    <div className={style['sub-info']}>
                                        {item.trackCount}首 - {item.creator.nickname}  播放{formatNumber(item.playCount)}次
                                    </div>
                                </div>
                            </li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{ position: 'absolute', top: '40%' }} />
                        {!searchLoading && !playlists.length && <NoResult />}
                    </Scroll>
                </div>
            </Tabs>
        </div>
    )
}

export default inject('appStore')(observer(ResultTabs))