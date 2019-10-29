import React, { useState, useEffect, useRef } from 'react'
import style from './style/index.module.scss'
import {get} from '../../utils/request'
import {Link, useHistory} from 'react-router-dom'
import Scroll from '../../components/Scroll/index'
import Loading from '../../components/Loading'
import {inject,observer} from 'mobx-react'

const Index = (props:any) => {
    const [artists,setArtists] = useState(null)
    const [loading,setLoading] = useState(false)
    const [isLoadMore,setIsLoadMore] = useState(false)
    const [haveMore,setHaveMore] = useState(true)
    const [currentPage,setCurrentPage] = useState(0)

    const history = useHistory()

    let scroll:any = useRef()
    useEffect(()=>{
        getArtists()
    },[])

    const getArtists = async ()=>{
        setLoading(true)
        const res = await get('/artist/top',{
            page: currentPage
        })
        if(res.data.length < 30) {
            setHaveMore(false)
        }else{
            let addpage = currentPage + 1
            setHaveMore(true)
            setCurrentPage(addpage)
        }
        setLoading(false)
        setArtists(res.data || [])
    }

    const  goBack = ()=>{
        history.goBack()
    }
    const onLoadMore = async ()=>{
        if(!haveMore || isLoadMore){
            return
        }
        setIsLoadMore(true)

        const res = await get('/artist/top',{
            page:currentPage,
        })
        //增加两秒的延迟，实际项目中可以不用，这里只是为显示这样一个加载中的过程
        setTimeout(()=>{
            if (res.data.length < 30) {
                setHaveMore(false)
            } else {
                let addpage = currentPage + 1
                setHaveMore(true)
                setCurrentPage(addpage)
            }
            setArtists(artists.concat(res.data || []))
            setIsLoadMore(false)
            scroll && scroll.finishPullUp()
        },1000)
    }

    const {playlist} = props.appStore

    const h = playlist.length ? 60 : 0
    const height = {height:`calc(100vh - ${ 44 + h}px`}

    return (
        <div className={style.container}>
            <div className={style.navbar}>
                <div className={`iconfont icon-zuojiantou ${style.iconfont}`} onClick={goBack}/>
                <div className={style.title}>热门歌手</div>
            </div>
            <div style={height}>
                <Scroll onPullingUp={onLoadMore} ref={scroll}>
                    <div>
                        <ul>
                            {artists && artists.map((item, index) => <li key={index}>
                                <Link to={`/singer/${item.id}`}>
                                    <div className={style['singer-item']}>
                                        <div className={style.avatar}>
                                            <img src={item.img1v1Url} alt=""/>
                                        </div>
                                        <div>
                                            <div className={style.name}>{item.name}</div>
                                            <div>
                                                <span style={{display:item.albumSize?'':'none'}}>专辑:{item.albumSize}</span>&emsp;
                                                <span style={{display:item.musicSize?'':'none'}}>单曲:{item.musicSize}</span>
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            </li>)}
                        </ul>
                        <div className={style.loading} style={{display:isLoadMore?'':'none'}}>加载中...</div>
                        <div className={style.loading} style={{display:haveMore?'none':''}}>加载完毕</div>
                    </div>
                </Scroll>
            </div>
            <Loading loading={loading}/>
        </div>
    )

}


export default inject('appStore')(observer(Index))