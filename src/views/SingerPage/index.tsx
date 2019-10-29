import React, { useState, useEffect } from 'react'
import style from './style/index.module.scss'
import { get } from '../../utils/request'
import NavBar from '../../components/NavBar'
import Content from './Content'
import {useParams} from 'react-router-dom'


const Index = (props:any)=>{

    const [info,setInfo] = useState({name:'',img1v1Url:''})
    const {id} = useParams()

    useEffect(()=>{
        getInfo(id)
    },[id])

    const getInfo = async (id) => {
        const res = await get(`/artists?id=${id}`)
        setInfo(res.artist || {})
    }
    return (
        <div className={style.container}>
            <div  className={style.wrapper}>
                <NavBar>{info}</NavBar>
                <div className={style['singer-img']} style={{backgroundImage: `url(${info.img1v1Url})`}}/>
                <div className={style['content-box']}>
                    <Content/>
                </div>
            </div>
        </div>
    )
}

export default Index