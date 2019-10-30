import React, { useState, useEffect, useRef } from 'react'
import style from './style/index.module.scss'


interface ProgressBarProps {
    percent: number
    percentChange: (_percent) => {}
}


const ProgressBar = (userProps: ProgressBarProps) => {

    
    const progressBtnWidth = 16
    let touch = null

    const defaultProps = {
        percent: 0,
        percentChange: () => { }
    }

    const props = {
        ...defaultProps,
        ...userProps
    }

    const [_percent, set_percent] = useState(0)
    let setBar: any = useRef()
    let setProgress: any = useRef
    let bar: any = setBar.current
    let progress: any = setProgress.current

    useEffect(() => {
        set_percent(_percent)
    }, [_percent])

    const progressClick = (e) => {
        const rect = bar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        const percent = offsetWidth / (bar.clientWidth - progressBtnWidth)
        props.percentChange(percent)
    }
    const onTouchStart = (e) => {
        touch = {
            startX: e.touches[0].pageX,
            left: progress.clientWidth
        }
    }
    const onTouchMove = (e) => {
        if (!touch) {
            return
        }
        const touchMoveX = e.touches[0].pageX - touch.startX
        const width = bar.clientWidth - progressBtnWidth
        const offsetWidth = Math.min(width, Math.max(0, touch.left + touchMoveX))
        set_percent(offsetWidth / width)
    }
    const onTouchEnd = () => {
        touch = null
        props.percentChange(_percent)
    }

    let barWidth = 0
    if (bar) {
        barWidth = bar.clientWidth - progressBtnWidth
    }
    const offsetWidth = _percent * barWidth

    return (
        <div className={style['progress-bar']} ref={bar} onClick={progressClick}>
            <div className={style['bar-inner']}>
                <div className={style.progress} style={{ width: `${offsetWidth}px` }}
                    ref={progress}>
                </div>
                <div
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    className={style['progress-btn-wrapper']}
                    style={{ transform: `translateX(${offsetWidth}px)` }}>
                    <div className={style['progress-btn']} />
                </div>
            </div>
        </div>
    )

}


export default ProgressBar