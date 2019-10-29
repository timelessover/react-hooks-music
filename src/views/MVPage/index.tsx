import React, { useState, useEffect, useRef } from 'react'
import style from './style/index.module.scss'
import { get } from '../../utils/request'
import { withRouter, useParams, useHistory } from 'react-router-dom'
import 'video-react/dist/video-react.css';
import { Player, BigPlayButton } from 'video-react';
import { formatNumber, createMarkup } from '../../utils/util'
import dayjs from 'dayjs'
import Scroll from '../../components/Scroll/index'
import Loading from '../../components/Loading'

const Index = (props: any) => {
    const [mvData, setMvData] = useState(null)
    const [comments, setComments] = useState(null)
    const [hotComments, setHotComments] = useState(null)
    const [total, setTotal] = useState(0)
    const [isLoadMore, setIsLoadMore] = useState(false)
    const [loading, setLoading] = useState(false)

    const { id } = useParams()
    const history = useHistory()

    let scroll:any = useRef();

    useEffect(() => {
        initPage()
    }, [])

    const initPage = () => {
        setLoading(true)

        Promise.all([
            getMvData(id),
            getComments(id)
        ]).then(() => {
            setLoading(false)
        })
    }
    const getMvData = async (id) => {
        const res = await get(`/mv/detail?mvid=${id}`)
        setMvData(res.data || {})
    }
    const goBack = () => {
        history.goBack()
    }
    const getComments = async (id) => {
        const res = await get(`/comment/mv?id=${id}`)
        setComments(res.comments || [])
        setHotComments(res.hotComments || [])
        setTotal(res.total || 0)
    }
    const onLoadMore = async () => {
        if (isLoadMore) {
            return
        }
        setIsLoadMore(true)
        const res = await get(`/comment/mv`, {
            id,
            offset: comments.length || []
        })
        setIsLoadMore(false)
        setComments(comments.concat(res.comments || []))
        scroll && scroll.finishPullUp()
    }
    return (
        <div className={style.container}>
            <div className={style.navbar}>
                <div className={`iconfont icon-zuojiantou ${style.iconfont}`} onClick={goBack} />
                <div className={style.title}>MV</div>
            </div>
            <div>
                <Player src={mvData && mvData.brs && mvData.brs[240]} poster={mvData && mvData.cover}>
                    <BigPlayButton position="center" />
                </Player>
            </div>
            <div style={{ height: 'calc(100vh - 256px)', display: loading ? 'none' : '' }}>
                <Scroll onPullingUp={onLoadMore} ref={scroll}>
                    <div>
                        <div className={style.content}>
                            <div className={style.title}>{mvData && mvData.name}</div>
                            <div style={{ color: '#555' }}>发布：{mvData && mvData.publishTime} &nbsp; | &nbsp; 播放：{formatNumber(mvData &&mvData.playCount)}</div>
                            <div dangerouslySetInnerHTML={createMarkup(mvData && mvData.desc)} className={style.desc} />
                        </div>
                        <div className={style['comment-section']}>
                            <div className={style.title}>精彩评论</div>
                            <ul>
                                {hotComments && hotComments.map(item => <li key={item.commentId}>
                                    <div className={style.left}>
                                        <img src={item.user && item.user.avatarUrl} alt="" />
                                    </div>
                                    <div className={style.right}>
                                        <div className={style['user-box']}>
                                            <div>{item.user && item.user.nickname}</div>
                                            <div>{item.likedCount} <span className={'iconfont icon-zan1'} /></div>
                                        </div>
                                        <div className={style.time}>{dayjs(item.time).format('M[月]D[日]')}</div>
                                        <div className={style.comment}>{item.content}</div>
                                    </div>
                                </li>)}
                            </ul>
                        </div>
                        <div className={style['comment-section']}>
                            <div className={style.title}>最新评论({total})</div>
                            <ul>
                                {comments && comments.map(item => <li key={item.commentId}>
                                    <div className={style.left}>
                                        <img src={item.user && item.user.avatarUrl} alt="" />
                                    </div>
                                    <div className={style.right}>
                                        <div className={style['user-box']}>
                                            <div>{item.user && item.user.nickname}</div>
                                            <div>{item.likedCount ? item.likedCount : null} <span className={'iconfont icon-zan1'} /></div>
                                        </div>
                                        <div className={style.time}>{dayjs(item.time).format('M[月]D[日]')}</div>
                                        <div className={style.comment}>{item.content}</div>
                                    </div>
                                </li>)}
                            </ul>
                            <div className={style.loading} style={{ display: isLoadMore ? '' : 'none' }}>加载中...</div>
                        </div>
                    </div>
                </Scroll>
            </div>
            <Loading loading={loading} style={{ top: '60%' }} />
        </div>
    )

}



export default Index