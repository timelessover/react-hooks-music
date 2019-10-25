import React, { useEffect, useRef } from 'react'
import BScroll from 'better-scroll'

interface scrollType {
    onPullingUp?: React.FC
    children?: React.ReactNode

}

const Scroll = (props: any) => {

    const wrapper = useRef() 

    let scroll:any

    useEffect(() => {
        initScroll()
    })

    useEffect(()=>{
        refresh()
        return () => {
            destroy()
        }
    })

    const initScroll = () => {
        scroll = new BScroll(wrapper.current, {
            click: true,
            mouseWheel: true,
            pullUpLoad: true
        })
        scroll.on('pullingUp',props.onPullingUp)
    }
    const refresh = () => {
        scroll && scroll.refresh()
    }
    const finishPullUp = () => {
        scroll && scroll.finishPullUp()
    }
    const scrollToElement = (el, time, offsetX, offsetY, easing) => {
        scroll && scroll.scrollToElement(el, time, offsetX, offsetY, easing)
    }
    const scrollTo = (x, y, time, easing) => {
        scroll && scroll.scrollTo(x, y, time, easing)
    }
    const destroy = () => {
        scroll.destroy()
        scroll = null
    }
    return (
        <div style={{ height: '100%', width: '100%', overflow: 'hidden' }} ref={wrapper}>
            {props.children}
        </div>
    )

}

export default Scroll