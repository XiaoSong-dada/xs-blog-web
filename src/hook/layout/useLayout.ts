import { onMounted, ref } from "vue"

export const useTableHeight = () => {
    const tableHeight = ref<number>(500)

    const tableHeightOnMounted = (c_name:string , t_name:string)=>{
        onMounted(() => {
                console.log('执行了');
                
                const root = document.querySelector(`.${c_name}`) as HTMLElement
                const toobar = document.querySelector(`.${c_name} .${t_name}`) as HTMLElement
                const update = () => {
                    const h = root.clientHeight - toobar.offsetHeight - 16
                    tableHeight.value = Math.max(h, 200)
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