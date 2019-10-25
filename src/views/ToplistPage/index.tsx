import React, { useState, useEffect } from 'react'
import { get } from '../../utils/request'
import Loading from '../../components/Loading/index'
import style from './style/index.module.scss'
import { useHistory } from 'react-router-dom'
import Scroll from '../../components/Scroll'


const Index = (props:any)=>{

    const history = useHistory()

    const [topList,setTopList] = useState([])
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        getTopList()
    },[topList.length])
    
    const getTopList = async () => {
        setLoading(true)
        const res = await get('/toplist/detail')
        const list = res.list || []
        setLoading(false)
        setTopList(list)
    }
    const goDetail = (id) => {
        history.push(`/sheet/${id}?isTop=1`)
    }

    return (
        <div className={style.container}>
            <Scroll>
                <div>
                    <ul>
                        {topList && topList.map((item) => {
                            return (
                                <li key={item.id} className={style['top-item']} onClick={() => goDetail(item.id)}>
                                    <div>
                                        <img src={item.coverImgUrl} alt=""/>
                                    </div>
                                    <div className={style['top-info']}>
                                        <div className={style.name}>{item.name}</div>
                                        <div>
                                            {item.tracks && item.tracks.map((song, index) => <p key={index}>{index + 1}.{song.first}- {song.second}</p>)}
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <Loading loading={loading}/>
                </div>
            </Scroll>
        </div>
    )

}

export default Index