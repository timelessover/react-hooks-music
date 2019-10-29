import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import BScroll from 'better-scroll'

interface scrollType {
    onPullingUp?: React.FC
    children?: React.ReactNode
}

const Scroll = (props: any, ref: any) => {
    const wrapper = useRef()
    let scroll: any


    useEffect(() => {
        initScroll()
        return () => {
            destroy()
        }
    },[])

    useEffect(() => {
        refresh()
        finishPullUp()
    })
    // https://zh-hans.reactjs.org/docs/hooks-reference.html#useref
    // 暴露子子组件方法
    useImperativeHandle(ref, () => ({
        finishPullUp,
        refresh
    }));

    const initScroll = () => {
        scroll = new BScroll(wrapper.current, {
            click: true,
            mouseWheel: true,
            pullUpLoad: true
        })
        scroll.on('pullingUp', props.onPullingUp)
    }
    const refresh = () => {
        scroll && scroll.refresh()
    }
    const finishPullUp = () => {
        console.log('3')
        scroll && scroll.finishPullUp()
    }
    const scrollToElement = (el, time, offsetX, offsetY, easing) => {
        scroll && scroll.scrollToElement(el, time, offsetX, offsetY, easing)
    }
    const scrollTo = (x, y, time, easing) => {
        scroll && scroll.scrollTo(x, y, time, easing)
    }
    const destroy = () => {
        console.log('555')
        scroll && scroll.destroy()
        scroll = null
    }
    return (
        <div style={{ height: '100%', width: '100%', overflow: 'hidden' }} ref={wrapper}>
            {props.children}
        </div>
    )

}

export default forwardRef(Scroll)