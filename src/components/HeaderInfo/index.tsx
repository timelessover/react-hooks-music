import React from 'react'
import style from './style/index.module.scss'
import { formatNumber } from '../../utils/util'
import dayjs from 'dayjs'

interface creatorProps {
    nickname?: string
    avatarUrl: string
}

interface HeaderInfoPorops {
    coverImgUrl?: string
    name?: string
    creator?: creatorProps
    updateTime?: number
    playCount?: number
}

const HeaderInfo = (props: any) => {
    
    const { coverImgUrl, name, creator, updateTime, playCount } = props.info
    return (
        <div className={style.container}>
            <img src={coverImgUrl || ''} alt="" className={style['bg-img']} />
            <div className={style['info-wrapper']}>
                <div className={style.left}>
                    <img src={coverImgUrl} alt="" />
                    <p><span className={'iconfont icon-erji1'} style={{ fontSize: 12 }} /> {formatNumber(playCount || 0)}</p>
                </div>
                <div className={style.right}>
                    <div className={style.name}>{name}</div>
                    <div className={style.author}>
                        <img src={creator && creator.avatarUrl} alt="" />
                        <span>{creator && creator.nickname}</span>
                    </div>
                    <div>{dayjs(updateTime).format('YYYY-MM-DD')} 更新</div>
                </div>
            </div>
        </div>
    )
}
export default HeaderInfo