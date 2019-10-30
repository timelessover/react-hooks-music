import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import style from './style/index.module.scss'
import {get} from '../../utils/request'
import NavBar from '../../components/NavBar'
import HeaderInfo from '../../components/HeaderInfo'
import Content from './Content'
import {inject,observer} from 'mobx-react'

const Index = (props:any)=>{
    const [detail,setDetail] = useState({name:'',coverImgUrl:''})
    const [loading,setLoading] = useState(false)
    const { setSheetSongs } = props.appStore

    const { id } = useParams()

    useEffect(()=>{
        getDetail(id)
    },[id])

    const getDetail = async (id)=>{
        setLoading(true)
        const res = await get(`/playlist/detail?id=${id}`)
        setSheetSongs(res.playlist.tracks || [])
        setDetail(res.playlist || {})
        setLoading(false)
    }

    return (
        <div className={style.container}>
            <div>
                <NavBar>{detail}</NavBar>
                <HeaderInfo info={detail}/>
                <Content info={detail} loading={loading}/>
            </div>
        </div>
    )
} 

export default inject('appStore')(observer(Index)) 