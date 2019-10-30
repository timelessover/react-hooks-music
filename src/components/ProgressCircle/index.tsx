import React from 'react'
import style from './style/index.module.scss'

interface ProgressCircleProps {
    redius: number
    percent: number
    children: any
}

const ProgressCircle = (userProps: ProgressCircleProps) => {
    const defaultProps = {
        radius: 100,
        percent: 0
    }

    const props = {
        ...defaultProps,
        ...userProps
    }

    const { radius, percent } = props
    const dashArray = Math.PI * 100
    const dashOffset = (1 - percent) * dashArray

    return (
        <div className={style['progress-circle']} style={{ width: radius, height: radius }}>
            <svg width={radius} height={radius} viewBox="0 0 100 100" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <circle className={style['progress-background']} r="50" cx="50" cy="50" fill="transparent" />
                <circle className={style['progress-bar']} r="50" cx="50" cy="50" fill="transparent"
                    strokeDasharray={dashArray} strokeDashoffset={dashOffset} />
            </svg>
            {props.children}
        </div>
    )
}



export default ProgressCircle