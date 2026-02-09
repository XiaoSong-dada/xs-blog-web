import { onMounted, ref } from "vue"

export const useTableHeight = () => {
    const tableHeight = ref<number>(500)

    const tableHeightOnMounted = (padding:number=80,c_name:string="main-content" , t_name:string = 'toobar' , ts_name:string='tools')=>{
        onMounted(() => {
                // 获取视图高度
                const tools = document.querySelector(`.${ts_name}`) as HTMLElement;
                const root = document.querySelector(`.${c_name}`) as HTMLElement
                const toobar = document.querySelector(`.${c_name} .${t_name}`) as HTMLElement

                const update = () => {
                    tableHeight.value =root.clientHeight - (toobar?.offsetHeight || 0)-(tools?.offsetHeight || 0)-padding - 32; // 32 是一些额外的间距
                }
                update()
                window.addEventListener('resize', update)
            })

    } 
    return {
        tableHeight,
        tableHeightOnMounted
    }
}