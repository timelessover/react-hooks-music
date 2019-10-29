import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd-mobile'
import style from './style/content.module.scss'
import { useParams, useHistory } from 'react-router-dom'
import { get } from '../../utils/request'
import SongList from '../../components/SongList'
import Loading from '../../components/Loading'
import { createMarkup } from '../../utils/util'
import Scroll from '../../components/Scroll'
import dayjs from 'dayjs'
import { formatNumber } from '../../utils/util'
import { inject, observer } from 'mobx-react'

const Content = (props: any) => {
    const [songs, setSongs] = useState([])
    const [songsLoading, setSongLoading] = useState(false)
    const [albums, setAlbums] = useState([]) //歌手专辑
    const [albumsLoading, setAlbumsLoading] = useState(false)  //获取专辑的loading
    const [mvs, setMvs] = useState([]) //歌手mv
    const [mvsLoading, setMvsLoading] = useState(false)//获取mv的loading
    const [info, setInfo] = useState({briefDesc:'',introduction:[]})  //歌手信息
    const [infoLoading, setInfoLoading] = useState(false) //获取信息的loading

    const history = useHistory()
    const {id} = useParams()

    useEffect(() => {
        getSongs(id)
    }, [id])

    const getSongs = async (id) => {
        // 有数据就不再去请求
        if (songs.length) {
            return
        }
        setSongLoading(true)
        const res = await get(`/artists?id=${id}`)

        setSongLoading(false)
        setSongs(res.hotSongs || [])
    }
    const getAlbums = async (id) => {
        if (albums.length) {
            return
        }
        setAlbumsLoading(true)
        const res = await get(`/artist/album?id=${id}`)

        setAlbumsLoading(false)
        setAlbums(res.hotAlbums || [])
    }
    const getMvs = async (id) => {
        if (mvs.length) {
            return
        }
        setMvsLoading(true)
        const res = await get(`/artist/mv?id=${id}`)

        setMvsLoading(false)
        setMvs(res.mvs || [])
    }
    const getInfo = async (id) => {
        if (info && info.briefDesc) {
            return
        }
        setInfoLoading(true)
        const res = await get(`/artist/desc?id=${id}`)

        setInfoLoading(false)
        setInfo(res)
    }
    const handleChange = (tab, index) => {
        switch (index) {
            case 0: {
                getSongs(id)
                break;
            }
            case 1: {
                getAlbums(id)
                break;
            }
            case 2: {
                getMvs(id)
                break;
            }
            case 3: {
                getInfo(id)
                break;
            }
            default: {
                getSongs(id)
            }
        }
    }

    const goTo = (url) => {
        history.push(url)
    }

    const { currentSong, playlist, onSelectSong } = props.appStore
    const tabs = [
        { title: '单曲' },
        { title: '专辑' },
        { title: 'MV' },
        { title: '简介' },
    ]
    const h = playlist.length ? 60 : 0
    const height = { height: `calc(100vh - ${88 + h}px` }

    return (
        <div className={style.wrapper}>
            <Tabs tabs={tabs} swipeable={false} onChange={handleChange} initialPage={0}>
                {/*单曲*/}
                <div className={style['tab-item']} style={height}>
                    <SongList list={songs} onSelectSong={onSelectSong} currentSong={currentSong} />
                    <Loading loading={songsLoading} style={{ position: 'absolute', top: '30%' }} />
                </div>
                {/*专辑*/}
                <div className={style['tab-item']} style={height}>
                    <Scroll>
                        <ul className={style.albums}>
                            {
                                albums && albums.map(item => <li key={item.id} onClick={() => goTo(`/album/${item.id}`)}>
                                    <div className={style.left}>
                                        <img src={item.picUrl} alt="" />
                                    </div>
                                    <div className={style.right}>
                                        <div className={style.title}>{item.name}</div>
                                        <div>{dayjs(item.publishTime).format('YYYY-MM-DD')} 歌曲{item.size}</div>
                                    </div>
                                </li>)
                            }
                        </ul>
                    </Scroll>
                    <Loading loading={albumsLoading} style={{ position: 'absolute', top: '30%' }} />
                </div>
                {/*MV*/}
                <div className={style['tab-item']} style={height}>
                    <Scroll>
                        <ul className={style.mvs}>
                            {
                                mvs && mvs.map(item => <li key={item.id} onClick={() => goTo(`/mv/${item.id}`)}>
                                    <div className={style.left}>
                                        <img src={item.imgurl16v9} alt="" style={{ width: 120 }} />
                                        <p className={style.playCount}><span className={'iconfont icon-bofang1'} style={{ fontSize: 12 }} /> {formatNumber(item.playCount)}</p>
                                    </div>
                                    <div className={style.right}>
                                        <div className={style.title}>{item.name}</div>
                                        <div>{dayjs(item.publishTime).format('YYYY-MM-DD')}</div>
                                    </div>
                                </li>)
                            }
                        </ul>
                    </Scroll>
                    <Loading loading={mvsLoading} style={{ position: 'absolute', top: '30%' }} />
                </div>
                {/*简介*/}
                <div className={style['tab-item']} style={height}>
                    <Scroll>
                        <div className={style['info-box']}>
                            <div style={{ display: info.briefDesc ? '' : 'none' }}>
                                <div className={style.title}>简介</div>
                                <div className={style.text} dangerouslySetInnerHTML={createMarkup(info.briefDesc)} />
                            </div>
                            {
                                info.introduction && info.introduction.map(item => <div key={item.ti}>
                                    <div className={style.title}>{item.ti}</div>
                                    <div className={style.text} dangerouslySetInnerHTML={createMarkup(item.txt)} />
                                </div>)
                            }

                        </div>
                    </Scroll>
                    <Loading loading={infoLoading} style={{ position: 'absolute', top: '30%' }} />
                </div>
            </Tabs>
        </div>
    )
}




export default inject('appStore')(observer(Content))