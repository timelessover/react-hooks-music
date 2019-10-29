import React, { useState, useEffect } from 'react'
import { withRouter, useParams } from 'react-router-dom'
import style from './style/index.module.scss'
import { get } from '../../utils/request'
import NavBar from '../../components/NavBar'
import { Tabs } from 'antd-mobile'
import HeaderInfo from '../../components/HeaderInfo'
import Loading from '../../components/Loading/index'
import SongList from '../../components/SongList'
import Scroll from '../../components/Scroll'
import { createMarkup } from '../../utils/util'
import { inject, observer } from 'mobx-react'


const Index = (props: any) => {
    const [info, setInfo] = useState({description:''})
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(false)

    const { id } = useParams()

    useEffect(() => {
        getDetail(id)
    }, [id])

    const getDetail = async (id) => {
        setLoading(true)

        const res = await get(`/album?id=${id}`)
        const album = res.album || {}
        const info = {
            coverImgUrl: album.blurPicUrl,
            description: album.description,
            name: album.name,
            updateTime: album.publishTime,
            creator: {
                nickname: album.artist && album.artist.name,
                avatarUrl: album.artist && album.artist.picUrl,
            }
        }
        setInfo(info)
        setSongs(res.songs || [])
        setLoading(false)
    }


    const { currentSong, playlist, onSelectSong } = props.appStore

    const tabs = [
        { title: '歌曲' },
        { title: '专辑简介' },
    ]

    const h = playlist.length ? 60 : 0
    const height = { height: `calc(100vh - ${300 + h}px` }

    return (
        <div className={style.container}>
            <NavBar>专辑</NavBar>
            <HeaderInfo info={info} />
            <div>
                <Tabs tabs={tabs} swipeable={false}>
                    <div style={height}>
                        <SongList list={songs} onSelectSong={onSelectSong} currentSong={currentSong} />
                        <Loading loading={loading} />
                    </div>
                    <div style={height}>
                        <Scroll>
                            <div className={style.description} dangerouslySetInnerHTML={createMarkup(info.description)} />
                        </Scroll>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}



export default inject('appStore')(observer(Index))