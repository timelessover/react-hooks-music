import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react'
import BScroll from 'better-scroll'

interface scrollType {
    onPullingUp?: React.FC
    children?: React.ReactNode
}

const Scroll = (props: any, ref: any) => {
    const wrapper = useRef()
    const [scroll,setScroll] = useState(null) 

    // https://zh-hans.reactjs.org/docs/hooks-reference.html#useref
    // 暴露子子组件方法
    useImperativeHandle(ref, () => ({
        finishPullUp,
        refresh
    }));

    const refresh = () => {
        scroll && scroll.refresh()
    }

    useEffect(() => {
        setScroll(new BScroll(wrapper.current, {
            click: true,
            mouseWheel: true,
            pullUpLoad: true
        }))
        
        return () => {
            destroy()
        }
    }, [])

    useEffect(() => {
        scroll && scroll.on('pullingUp', props.onPullingUp)
        refresh()
        return ()=>{
            scroll && scroll.off('pullingUp', props.onPullingUp)
        }
    }, [refresh])

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
        console.log('4')
        scroll && scroll.destroy()
        setScroll(null)
    }
    return (
        <div style={{ height: '100%', width: '100%', overflow: 'hidden' }} ref={wrapper}>
            {props.children}
        </div>
    )

}

export default forwardRef(Scroll)