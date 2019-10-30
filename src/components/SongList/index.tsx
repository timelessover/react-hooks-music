import React, { useState, useEffect, useRef, createRef, useCallback } from 'react'
import Scroll from '../../components/Scroll'
import style from './style/index.module.scss'

interface SongListProps {
    list?: object[],
    bottomLoadingText?: string,
    loading?: boolean,
    loadingMore?: any
    onSelectSong?: ({ }) => {},
    currentSong?: any,
}

const SongList = (userProps: SongListProps) => {
    const defaultProps = {
        list: [],
        bottomLoadingText: '加载中...',   //底部loading文字
        loading: false,    //是否正在加载
        loadingMore: (song) => { },
        onSelectSong: () => { },
        currentSong: {},
    }
    const props = {
        ...defaultProps,
        ...userProps
    }

    const [list, setList] = useState([])


    let scroll:any = useRef()

   

    const updateList = useCallback(()=>{
        setList(props.list)
    },[props.list])
    
    useEffect(() => {
        updateList()
    }, [updateList])


    const loadingMore = async()=>{
        await props.loadingMore()
        scroll && scroll.current.finishPullUp()
    }

    const onSelectSong = (item, index = 0) => {
        props.onSelectSong({
            songlist: list,
            song: item,
            index
        })
    }
    const { bottomLoadingText, loading, currentSong } = props

    return (
        <div className={style['song-list-box']}>
            <Scroll ref={scroll} onPullingUp={loadingMore}>
                <div>
                    <ul>
                        {
                            list && list.map((item, index) => <li key={index} onClick={() => onSelectSong(item, index)} className={currentSong.id === item.id ? style.active : ''}>
                                <div className={`${style.num} ${index < 3 ? style.red : ''}`}>{index + 1}</div>
                                <div className={style.pic}>
                                    <img src={item.al ? item.al.picUrl : item.album.picUrl} alt="" />
                                </div>
                                <div className={style.text}>
                                    <h3>{item.name}</h3>
                                    <div>
                                        {item.ar && item.ar.reduce((init, current, index) => {
                                            if (index < item.ar.length - 1) {
                                                init += current.name + ' / '
                                            } else {
                                                init += current.name + ' - '
                                            }
                                            return init
                                        }, '')}
                                        {item.al && item.al.name}
                                    </div>
                                </div>
                                <p className={`iconfont ${currentSong.id === item.id ? 'icon-bofang2' : 'icon-bofang'}`} style={{ fontSize: 20 }} />
                            </li>)
                        }
                    </ul>
                    {
                        loading && list.length ? <div className={style.loading}>{bottomLoadingText}</div> : null
                    }
                </div>
            </Scroll>
        </div>
    )
}


export default SongList