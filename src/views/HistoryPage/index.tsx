import React, { useState, useEffect } from 'react'
import style from './style/index.module.scss'
import { useLocation, useHistory } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import List from './List'

const Index = (props: any) => {
    const [tab, setTab] = useState('')

    const history = useHistory()
    const { search } = useLocation()
    const isHistory = search.match('isHistory')

    const { setLikes, setPlayHistorys, likeSongs, playHistorys, playlist } = props.appStore


    const goBack = () => {
        history.goBack()
    }

    const removeLike = (index, song) => {
        setLikes(song)
    }
    const removeHistory = (index) => {
        setPlayHistorys({
            isAdd: false,
            index
        })
    }

    const h = playlist.length ? 60 : 0
    const height = { height: `calc(100vh - ${44 + h}px` }

    return (
        <div className={style.container}>
            <div className={style.top}>
                <div className={style.back} onClick={goBack}><span className={'iconfont icon-zuojiantou'} style={{ fontSize: 25 }} />
                </div>
                <div className={style.switch}>
                    <div className={tab === 'history' ? '' : style.active} onClick={() => setTab('like')}>我喜欢的
                        </div>
                    <div className={tab === 'history' ? style.active : ''} onClick={() => setTab('history')}>
                        最近听的
                        </div>
                </div>
            </div>
            <div>
                <div style={{ display: tab === 'history' ? 'none' : '' }}>
                    <div style={height}>
                        <List list={likeSongs} remove={removeLike} />
                    </div>
                    <div className={style.empty} style={{ display: likeSongs.length ? 'none' : '' }}>
                        <div className={'iconfont icon-jiarugedan'} />
                        <p>没有收藏的歌曲</p>
                        <p>你可以挑一些喜欢的单曲添加到这里</p>
                    </div>
                </div>
                <div style={{ display: tab === 'history' ? '' : 'none' }}>
                    <div style={height}>
                        <List list={playHistorys} remove={removeHistory} />
                    </div>
                    <div className={style.empty} style={{ display: playHistorys.length ? 'none' : '' }}>
                        <div className={'iconfont icon-yinyue'} />
                        <p>没有播放记录</p>
                        <p>这里会自动记录您最近听过的歌曲</p>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default inject('appStore')(observer(Index))