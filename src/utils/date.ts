import { format } from "date-fns";

/**

* 基础日期格式化函数

* @param date 日期对象或字符串

* @param fmt 格式模板，支持 yyyy/MM/dd/HH/mm/ss

* @returns 格式化后的字符串

*/

export const formatDate = (date: Date | string = new Date(), fmt = 'yyyy-MM-dd HH:mm:ss'): string => {
    return format(date, fmt)
};


export const formatDateByNomall = (date: Date): string => {
    return format(date, 'yyyy-MM-dd')
}

export const formatDateTimeByNomall = (date: Date): string => {
    return format(date, 'yyyy-MM-dd HH:mm:ss')
}