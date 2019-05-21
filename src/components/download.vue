<template>
    <el-button :type="type" size="mini" @click.native="download">
        <slot></slot>
    </el-button>
</template>
<style lang="stylus" scoped>

</style>
<script>

    import {downloadFile} from '../lib/http';
    export default{
        data(){
            return{

            }
        },
        methods:{
            download(){
                if(this.userDefine){
                    this.$prompt('请输入导出文件名', '文件下载', {
                        confirmButtonText: '下载',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        this.downloadfile(value);
                    }).catch(() => {
                    });
                }else{
                    this.downloadfile()
                }

            },
            downloadfile(value){
                this.$emit('download-file');
                if(!this.isFulfil)return;
                downloadFile({
                    url:this.request.url,
                    get:this.request.get,
                    fileName:value || this.request.name || '未取名',
                    suffix:this.request.suffix || '.xls',
                })
            }
        },
        props:{
            request:{
                required:true,
                type:Object
            },
            userDefine:{
                required:false,
                default(){
                    return true;
                }
            },
            type:{
                default(){
                    return 'primary'
                }
            },
            isFulfil:{
                type:Boolean,
                default(){
                    return true
                }
            },
        },
        components:{

        }
    }
</script>