import React, { useEffect, useState } from 'react'
import { get } from '../../utils/request'
import style from './style/index.module.scss'
import { Carousel } from 'antd-mobile'
import { Link ,useHistory } from 'react-router-dom'
import Scroll from '../../components/Scroll'
import { formatNumber } from '../../utils/util'
import { inject,observer } from 'mobx-react'



const Index = (props: any) => {
    const [banners, setBanners] = useState([])
    const [hotSingerList, setHotSingerList] = useState([])
    const [recommendList, setRecommendList] = useState([])
    const [highqualityList, setHighqualityList] = useState([])


    const history = useHistory();


    const initPage = () => {
        Promise.all([
            getBanners(),
            getHotSingers(),
            getRecommends(),
            getHighqualitys()
        ])
    }
    
    useEffect(() => {
        initPage()
    }, [])

    const getBanners = async () => {
        const res = await get('/banner')
        setBanners(res.banners || [])
    }
    const getHotSingers = async () => {
        const res = await get('/top/artists?offset=0&limit=8')
        setHotSingerList(res.artists.slice(0, 8) || [])
    }
    const getRecommends = async () => {
        const res = await get('/personalized')
        const list = res.result || []
        setRecommendList(list.slice(0, 6))
    }
    const getHighqualitys = async () => {
        const res = await get('/top/playlist/highquality?limit=6')
        const list = res.playlists || []
        setHighqualityList(list.slice(0, 6) || [])
    }

    const menu = [
        {
            title: '热门歌手',
            icon: 'icon-remen1',
            url: '/artists',
            color: '#dd4330'
        },
        {
            title: '每日推荐',
            icon: 'icon-PCbofangye_paihangbang',
            url: '/playlists',
            color: 'orange'
        },
        {
            title: '歌单',
            icon: 'icon-liebiao1',
            url: '/playlists',
            color: '#16c2c2',
        },
    ]

    return(
        <div className={style.container}>
            <Scroll>
                <div>
                    <div className={style['banners-box']}>
                        <Carousel infinite autoplay>
                            {banners && banners.map(item => <img key={item.imageUrl} src={item.imageUrl} alt=""/>)}
                        </Carousel>
                    </div>
                    <div className={style.menu}>
                        {menu.map(item=><div key={item.title}>
                            <Link to={item.url}>
                                <div className={`iconfont ${style.icon} ${item.icon}`} style={{color:item.color}}/>
                                <div>{item.title}</div>
                            </Link>
                        </div>)}
                    </div>
                    <div className={style['hot-singer-box']}>
                        <div className={style['title-box']}>
                            <div>热门歌手</div>
                            <Link to={'/artists'}>查看全部</Link>
                        </div>
                        <ul>
                            {hotSingerList && hotSingerList.map(singer=><li key={singer.id}>
                                <Link to={`/singer/${singer.id}`} className={style['singer-box']}>
                                    <img src={singer.img1v1Url} alt=""/>
                                    <div>{singer.name}</div>
                                </Link>
                            </li>)}
                        </ul>
                    </div>
                    <div className={style['recommend-box']}>
                        <div onClick={()=>history.push('/playlists')}>每日推荐 <span className={'iconfont' +
                        ' icon-iconfontjiantou5'} style={{fontSize:12}}/></div>
                        <ul>
                            {recommendList && recommendList.map(sheet=><li key={sheet.id}>
                                <Link to={`/sheet/${sheet.id}`} className={style['sheet-box']}>
                                    <img src={sheet.picUrl} alt=""/>
                                    <div>{sheet.name}</div>
                                    <p className={style.playCount}><span className={'iconfont icon-erji1'} style={{fontSize:12}}/> {formatNumber(sheet.playCount)}</p>
                                </Link>
                            </li>)}
                        </ul>
                    </div>
                    <div className={style['recommend-box']}>
                        <div onClick={()=>history.push('/playlists')}>精品歌单 <span className={'iconfont icon-iconfontjiantou5'} style={{fontSize:12}}/></div>
                        <ul>
                            {highqualityList && highqualityList.map(sheet=><li key={sheet.id}>
                                <Link to={`/sheet/${sheet.id}`} className={style['sheet-box']}>
                                    <img src={sheet.coverImgUrl} alt=""/>
                                    <div>{sheet.name}</div>
                                    <p className={style.playCount}><span className={'iconfont icon-erji1'} style={{fontSize:12}}/> {formatNumber(sheet.playCount)}</p>
                                </Link>
                            </li>)}
                        </ul>
                    </div>
                </div>
            </Scroll>
        </div>
    )

}


export default inject('appStore')(observer(Index))