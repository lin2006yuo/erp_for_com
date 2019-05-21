<template>
    <div class="c-export-dialog">
        <page-dialog v-model="dialog" title="导入添加"
                     @close="close"
                     :close-on-click-modal="false">
            <div class="file-btns">
                请选择要导入的excel文件
                <input type="file" ref="fileResult" multiple @change="file_change">
            </div>
            <div class="file-btns ml-sm" @click="download_file">下载导入文件</div>
            <ul class="mt-sm ml-lg">
                <li class="mt-xs" v-if="filesList&&filesList.length>0" v-for="(item,index) in filesList" key="index">
                    <label>{{item.file.name}}</label>
                    <el-tag :type="item.message"
                            class="ml-sm"
                            :closable="item.message!=='success'"
                            :close-transition="false"
                            @close="handle_close(item,index)">{{item.result}}</el-tag>
                </li>
                <li v-else>请选择要导入的文件！</li>
            </ul>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="export_excel">导入</el-button>
                <el-button size="mini" class="inline" @click.native="close">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .file-btns {
        display: inline-block;
        cursor: pointer;
        height: 26px;
        padding:0 7px;
        text-align: center;
        line-height: 26px;
        background: #008BCE;
        border-radius: 4px;
        position: relative;
        color: #fff;
        input {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 100%;
            opacity: 0;
        }
    }
</style>
<script>
    import {downloadFile} from '../../../lib/http';
    import {isExcel} from '../../../define/validator_reg';
    import {api_virtual_order_import} from '../../../api/scalp-task';
    export default {
        data() {
            return {
                dialog:false,
                filesList:[],
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        methods:{
            close(){
                this.filesList.length = 0;
            },
            handle_close(item,index){
                this.filesList.splice(index,1);
            },
            download_file(){
                let url = config.apiHost+`downfile`;
                let code={
                    code:'virtual_order_apply'
                };
                downloadFile({
                    url:url,
                    get:code,
                    fileName:`虚拟订单导入模板`,
                    suffix:'.xlsx',
                })
            },
            export_excel(){
                this.filesList.forEach(({file},i)=>{
                    let params = {
                        channel_id:this.channelId,
                        name:file.name,
                        content:"",
                    };
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e)=>{
                        params.content = e.target.result;
                        this.submit(params,i);
                    };
                })
            },
            submit(params,i){
                let cur = this.filesList.filter((row,index)=>index===i);
                 this.$http(api_virtual_order_import,params).then(res=>{
                     cur.forEach(row=>{
                         row.result="上传成功！";
                         row.message="success";
                     });
                    this.filesList.filter((row,index)=>index===i)
                        .forEach(row=>{
                            row.result="上传成功！";
                            row.message="success";
                        });
                     this.dialog = false;
                    this.$emit('export-excel',res);
                 }).catch(code=>{
                     cur.forEach(row=>{
                         row.result=`上传失败！原因：${code.message||code}`;
                         row.message=`danger`;
                     })
                     console.log("2222");
                 })
            },
            close(){
                this.dialog = false;
            },

            file_change(){
                const files = this.$refs.fileResult.files;
                Object.keys(files).forEach(key=>{
                    let file = files[key];
                    if(isExcel.test(file.name)) return this.$message({type:"warning",message:"上传文件格式有误，请选择以.xls或.xlsx结尾的文件"});
                    this.filesList.push({file:file,result:'未上传',message:"gray"});
                });
                //手动清掉input value
                this.$refs.fileResult.value = '';
            },
        },
        props:{
            value:{},
            channelId:{
                required:true
            }
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
        }
    }
</script>
