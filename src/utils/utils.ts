export const omitString = (str: string, auto_size: number = 20): string => {
    return str.length >= auto_size ? `${str.slice(0, auto_size + 1)}...` : str
}