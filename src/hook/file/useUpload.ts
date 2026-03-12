import { uploadFile as upload } from "@/api/file/file"
import { message } from "ant-design-vue"



export const useUplaodImgFile = ()=>{
    const uploadFile =async (file:File)=>{
        const res = await upload(file, 'image')
        if(res.code === 200 )message.success('上传成功');
        else message.error('上传失败'+res.message);
        return res
    }
    return {
        uploadFile
    }
}
