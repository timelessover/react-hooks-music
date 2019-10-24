/**
 * 将1000转换为'1万'
 * @param num
 * @returns {*}
 */
export function formatNumber (num:number):string|number {
    if (num < 10000) {
        return num
    }
    if (num >= 10000) {
        num = num / 10000
        return num.toFixed(1) + '万'
    }
}

/**
 * 实现类似vue的v-html功能
 * @param description
 * @returns {{__html: *}}
 */


export function createMarkup (description:string):any {
    if (description) {
        description = description.replace(/(\r\n|\n|\r)/gm, '<br />')
        return {__html: description}
    }
}

/**
 * 获取[min,max]区间的随机值
 * @param min
 * @param max
 * @returns {number}
 */

export function getRandom (min:number, max:number):number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 对时间秒格式化，将 128 -> 2:08
 * @param interval
 * @returns {string}
 */

export function formatTime (interval:number):string {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = pad(interval % 60)
    return `${minute}:${second}`
}

/**
 * 将数字前面填充0
 * @param num
 * @param n  填充多少个0，默认填充两个
 * @returns {*}
 */
export function pad (num:number|string, n = 2):number|string {
    let len = num.toString().length
    while (len < n) {
        num = '0' + num
        len++
    }
    return num
}