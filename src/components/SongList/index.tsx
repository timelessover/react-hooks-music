import React, { useState, useEffect, useRef, createRef } from 'react'
import Scroll from '../../components/Scroll'
import style from './style/index.module.scss'

interface SongListProps {
    list?: object[],
    bottomLoadingText?: string,
    loading?: boolean,
    loadingMore?: () => void,
    onSelectSong?: ({ }) => {},
    currentSong?: any,
}

const SongList = (userProps: SongListProps) => {
    const defaultProps = {
        list: [],
        bottomLoadingText: '加载中...',   //底部loading文字
        loading: false,    //是否正在加载
        loadingMore: () => { },
        onSelectSong: () => { },
        currentSong: {},
    }
    const props = {
        ...defaultProps,
        ...userProps
    }

    const [list, setList] = useState([])


    let scroll:any = useRef()

    useEffect(() => {
        setList(props.list)
    }, [props.list])

    // 本来想要切分列表，但是在子组件调用父组件拿不到props？

    // const getSongs = (size = 0) => {
    //     if (list.length >= props.list.length) {
    //         return
    //     }
    //     let list1 = []

    //     list1 = props.list.slice(size, size + 30)
    //     setList(list.concat(list))
    // }

    const loadingMore = () => {
        
        // if (loading) {
        //     return
        // }
        // const size = list.length
        // getSongs(size)
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