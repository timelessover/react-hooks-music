import { Toast } from 'antd-mobile'
import axios from 'axios'


const BASE_URL = process.env.PORT || 'http://localhost:400'

/**
 * 处理url
 * @param url
 * @param param
 * @returns {*}
 */
function handleURL (url, param) {
    let completeUrl = BASE_URL + url
    if (param) {
        if (completeUrl.indexOf('?') === -1) {
            completeUrl = `${completeUrl}?${ObjToURLString(param)}`
        } else {
            completeUrl = `${completeUrl}&${ObjToURLString(param)}`
        }
    }
    return completeUrl
}

/**
 * 将参数对象转化为'test=1&test2=2'这种字符串形式
 * @param param
 * @returns {string}
 */

function ObjToURLString (param) {
    let str = ''
    if (Object.prototype.toString.call(param) === '[object Object]') {
        const list = Object.entries(param).map(item => {
            return `${item[0]}=${item[1]}`
        })
        str = list.join('&')
    }
    return str
}



export async function get (url, parma='') {
    const completeUrl = handleURL(url, parma)
    const response = await axios(completeUrl)
    if (response) {
        return response.data
    } else {
        Toast.offline(response.statusText|| '网络错误')
        return response
    }
}

export async function post (url, parma='') {
    const completeUrl = BASE_URL + url
    const response = await axios(completeUrl)
    if (response) {
        return response.data
    } else {
        Toast.offline(response.statusText as any || '网络错误')
        return response
    }
}
