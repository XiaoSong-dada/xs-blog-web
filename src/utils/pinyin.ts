import { pinyin, } from 'pinyin-pro';

export const convertToPinyin = (
    chinese_text: string,
    toneType: "symbol" | "num" | "none" | undefined = 'none',
    separator: string = '-'): string => {
    return pinyin(chinese_text, { toneType, separator })
} 