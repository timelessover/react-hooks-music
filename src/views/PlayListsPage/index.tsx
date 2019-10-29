import React, { useState, useEffect, useRef } from 'react'
import style from './style/index.module.scss'
import { get } from '../../utils/request'
import NavBar from '../../components/NavBar'
import CatMenu from './CatMenu'
import Loading from '../../components/Loading/index'
import List from './List'
import Scroll from '../../components/Scroll'

const Index = (props: any) => {
    const [catlist, setCatlist] = useState([]) //分类列表
    const [cat, setCat] = useState(['全部', '全部'])  //选择的分类
    const [isOpen, setIsOpen] = useState(false) //是否展开分类菜单
    const [loading, isLoading] = useState(false) //获取歌单的loading
    const [playlists, setPlaylists] = useState([]) //歌单列表
    const [headerInfo, setHeaderInfo] = useState(null) // 头部信息
    const [isLoadMore, setIsLoadMore] = useState(false) //加载更多
    const [haveMore, setHaveMore] = useState(true) //是否还有更多

    let scroll: any = useRef() || { finishPullUp: {} }

    useEffect(() => {
        getHeaderInfo()
        getCatlist()
        getPlaylists(cat)
    }, [])

    const getHeaderInfo = async () => {
        const res = await get('/top/playlist/highquality')
        setHeaderInfo(res.playlists ? (res.playlists[0] || {}) : {})
    }

    const getCatlist = async () => {
        const res = await get('/playlist/catlist')
        let catlist = []
        if (res.categories) {
            Object.entries(res.categories).forEach(item => {
                catlist.push({
                    value: item[1],
                    label: item[1]
                })
            })

            res.sub.forEach(item => {
                if (catlist[item.category].children) {
                    catlist[item.category].children.push({
                        value: item.name,
                        label: item.name
                    })
                } else {
                    catlist[item.category].children = [{
                        value: item.name,
                        label: item.name
                    }]
                }
            })
        }
        catlist.unshift({
            value: '全部',
            label: '全部',
            children: [
                {
                    value: '全部',
                    label: '全部',
                }
            ]
        })
        setCatlist(catlist)
    }
    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }
    const changeCat = (cat) => {
        setIsOpen(false)
        setCat(cat)
        getPlaylists(cat)
    }
    const getPlaylists = async (cat) => {
        setIsLoadMore(true)
        setPlaylists([])
        setHaveMore(true)
        const res = await get('/playlist')
        setIsLoadMore(false)
        setPlaylists(res.playlists || [])
        setHaveMore(res.more)
    }

    const onLoadMore = async () => {
        if (!haveMore || isLoadMore) {
            return
        }
        setIsLoadMore(true)
        const res = await get('/top/playlist', {
            cat: cat[1],
            limit: 16,
            offset: playlists.length
        })
        //增加两秒的延迟，实际项目中可以不用，这里只是为显示这样一个加载中的过程
        setTimeout(() => {
            setIsLoadMore(false)
            setPlaylists(playlists.concat(res.playlists || []))
            setHaveMore(res.more)
            scroll && scroll.finishPullUp()
        }, 2000)
    }

    return (
        <div className={style.container}>
            <NavBar>歌单</NavBar>
            <div style={{ height: '100vh' }}>
                <Scroll onPullingUp={onLoadMore} ref={el => scroll = el}>
                    <div>
                        <div className={style.header}>
                            <img src={headerInfo && headerInfo.coverImgUrl || ''} alt="" className={style['bg-img']} />
                            <div className={style['info-wrapper']}>
                                <div className={style.left}><img src={headerInfo.coverImgUrl} alt="" /></div>
                                <div className={style.right}>
                                    <p className={style.title}><span className={'iconfont icon-jingpin'} style={{ color: 'orange' }} /> 精品歌单</p>
                                    <p className={style.name}>{headerInfo.name}</p>
                                    <p className={style.other}>{headerInfo.copywriter}</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.navbar}>
                            <div className={style.cat} onClick={toggleOpen}>{cat[1]} <span className={'iconfont' +
                                ' icon-xiangyoujiantou'} style={{ display: 'inline-block', transform: 'rotate(90deg)' }} /></div>
                            <div className={style.list}>
                                <span onClick={() => changeCat(['语种', '华语'])}>华语</span>丨
                                <span onClick={() => changeCat(['风格', '民谣'])}>民谣</span>丨
                                <span onClick={() => changeCat(['风格', '电子'])}>电子</span>
                            </div>
                        </div>
                        <List list={playlists} />
                        <div className={style.loading} style={{ display: isLoadMore ? '' : 'none' }}>加载中...</div>
                    </div>
                </Scroll>
                <Loading loading={loading} style={{ top: '60%' }} />
                <CatMenu data={catlist} isOpen={isOpen} value={cat} onChange={changeCat} closeMenu={toggleOpen} />
            </div>
        </div>
    )

}


export default Index