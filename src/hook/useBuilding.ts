import type { IPages } from "@/types/http"

export const useBuildQueryParams = <T extends Record<string, unknown>>(raw: IPages<T>): IPages<T> => {
    let page = 1

    if ((raw.offset === undefined && raw.limit === undefined) || (typeof raw.offset === 'number' && raw.offset <= 0)) {
        page = 1
    }
    else {
        page = raw.offset ?? 1
    }

    const limit = raw.limit ?? 10

    const apiOffset = (page - 1) * limit
    return { ...raw, offset: apiOffset, limit }
}

export const useBuildTableIndex = () => ({
    buildIndex: (params: IPages, index: number) => ((params.offset ?? 1) - 1) * (params.limit ?? 10) + index + 1
});
