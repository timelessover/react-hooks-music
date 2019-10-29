import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd-mobile'
import style from './style/content.module.scss'
import Scroll from '../../components/Scroll'
import SongList from '../../components/SongList'
import { createMarkup } from '../../utils/util'
import Loading from '../../components/Loading'
import { inject, observer } from 'mobx-react'

const Index = (userProps: any) => {
    const defaultProps = {
        info: {}
    }
    const props = {
        ...defaultProps,
        ...userProps
    }
    const { info, appStore } = props
    const { onSelectSong, playlist, currentSong } = appStore


    const [songs, setSongs] = useState(info.tracks ? info.tracks : [])
    const [loading, setLoading] = useState(false)

    let allList = info.tracks ? info.tracks : []

    useEffect(() => {
        setSongs(allList)
    }, [info])

    const tabs = [
        { title: '歌曲' },
        { title: '详情' }
    ]
    const h = playlist.length ? 60 : 0
    const height = { height: `calc(100vh - ${300 + h}px` }
    return (
        <div>
            <Tabs tabs={tabs} swipeable={false}>
                <div style={height}>
                    <SongList list={songs} loading={loading} onSelectSong={onSelectSong} currentSong={currentSong} />
                    <Loading loading={loading} />
                </div>
                <div style={height}>
                    <Scroll>
                        <div className={style.description} dangerouslySetInnerHTML={createMarkup(info.description)} />
                    </Scroll>
                </div>
            </Tabs>
        </div>
    )
}



export default inject('appStore')(observer(Index)) 