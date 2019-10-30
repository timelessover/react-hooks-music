import React, { useState, useEffect, useRef, useCallback } from 'react'
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
    const { onSelectSong, playlist, currentSong, sheetSongs, setSheetSongs } = appStore

    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(false)


    const setInfo = useCallback(() => {
        setSongs(()=>sheetSongs? sheetSongs.slice(0, 30) : [])
    },[sheetSongs])


    useEffect(() => {
        setInfo()
    }, [setInfo])
    // 本来想要切分列表，但是在子组件调用父组件拿不到props？

    const getSongs = (size = 0) => {
        const allList = sheetSongs
        
        if (songs.length >= allList.length) {
            return
        }
        setLoading(true)

        let list = []
        //增加两秒的延迟，实际项目中可以不用，这里只是为显示这样一个加载中的过程
        setTimeout(() => {
            list = allList.slice(size, size + 30)
            setSongs(songs.concat(list))
            setLoading(false)
        }, 2000)
    }

    const loadingMore = () => {
        if (loading) {
            return
        }
        const size = songs.length
        getSongs(size)
    }

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
                    <SongList list={songs} loading={loading} loadingMore={loadingMore} onSelectSong={onSelectSong} currentSong={currentSong} />
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