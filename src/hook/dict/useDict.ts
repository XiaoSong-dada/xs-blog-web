import type { SelectProps } from "ant-design-vue";
import { ref } from 'vue';


export const useCommonDict = () => {

    const common_dict = ref<SelectProps['options']>([
        {value:'',label:"全部"},
        {value:'1',label:"是"},
        {value:'0',label:"否"}
    ]);

    return {
        common_dict
    }
}