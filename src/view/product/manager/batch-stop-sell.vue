<template>
    <page-dialog title="批量设置停售SKU" v-model="dialog"
                 height="500px" class='c-batch-stop-sell'
                 :close-on-click-modal="false"
                 @open="open_dialog" size="small">
        <div class="t-right mt-xs mb-xs mr-lg">
            <el-button type="primary" size="mini" @click.native="cur_handle">{{isImport?'输入':'导入'}}</el-button>
        </div>
        <el-row :gutter="8">
            <el-col :span="12">
                <el-input
                    v-if="!isImport"
                    type="textarea"
                    :autosize="{ minRows: 20, maxRows: 24}"
                    placeholder="支持批量，请使用空格或换行分割"
                    v-model="skuList">
                </el-input>
                <div v-else class="import-box" style="padding:15px">
                    <div :class="[isDisabled?'file-disabled-btn':'default-file-btn','import-file-btn']">选取文件
                        <input ref="file" type="file" :disabled='isDisabled' :multiple="false" @change="file_change">
                    </div>
                    <div class="import-file-btn default-file-btn" @click="downLoad_file">
                        下载模板
                    </div>
                    <div>只能上传Excel文件</div>
                    <!--上传文件提示部分-->
                    <div v-for="(file,index) in files"
                         :key="`${file.file.name}-${index}`">
                        <span>{{file.file.name}}</span>
                        <el-tag :class="{'error-color':file.errors.length, 'success-color':!file.errors.length && file.result}">
                            {{file.result ? file.result : '未上传'}}
                        </el-tag>
                        <i class="el-icon-circle-cross" @click="remove(file)"></i>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="channel-box">
                    <div class="channel-box-title">设置同时下架的平台</div>
                    <div class="channel-box-content">
                        <el-checkbox v-model="checkAll" class="mb-sm">全部</el-checkbox>
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox v-for='(item,index) in channelList'
                                         class="channel-check"
                                         :label="item.value"
                                         :key="`${index}-${item.value}`">{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div slot="footer">
            <request-button reqKey="batchStopSell" :mintime="300" :timeout="180000"
                            @click="submit">确定</request-button>
            <el-button size="mini" @click.native="cancel">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-batch-stop-sell{
        .channel-box,.import-box{
            box-sizing:border-box;
            height:371px;
            width:100%;
            border:1px solid #ddd;
            border-radius:3px;
            .channel-check{
                display: block;
                margin-bottom:10px;
            }
            .el-checkbox + .el-checkbox{
                margin-left:0 !important;
            }
            .channel-box-title{
                border-bottom:1px solid #ddd;
                padding:5px;
            }
            .channel-box-content{
                margin:15px;
                max-height:326px;
                overflow-y:auto;

            }
        }
    }
</style>
<script>
    import {api_get_channelList,api_batch_stopped_sku} from '@/api/product-library';
    import {downloadFile} from '@/lib/http';
    export default {
        data() {
            return {
                dialog:this.value,
                isImport:false,
                skuList:'',
                checkList:[],
                channelList:[],
                files:[],
            }
        },
        methods:{
            remove(file){
                const index = this.files.indexOf(file);
                this.files.splice(index,1);
            },
            file_change(){
                const files = this.$refs.file.files;
                Object.keys(files).forEach(key=>{
                    let file = files[key];
                    if (file.name.lastIndexOf('.xlsx')<0&&file.name.lastIndexOf('.xls')<0) {
                        this.$message({
                            type: "error",
                            message: '文件类型错误，请选择excel文件上传！'
                        });
                    }else{
                        this.files.push({file:file,result:'', errors:[]});
                    }
                });
                //手动清掉input value
                this.$refs.file.value = '';
            },
            downLoad_file(){
                let url = config.apiHost+'downfile';
                let code={
                    code:'sku_stopped'
                };
                downloadFile({
                    url:url,
                    get:code,
                    fileName:'批量设置停售SKU',
                    suffix:'.xls',
                })
            },
            open_dialog(){
                this.get_channelList();
                this.checkList = [];
                this.skuList = '';
                this.files = [];
                this.isImport = false;
            },
            get_channelList(){
                this.$http(api_get_channelList).then(res=>{
                    this.channelList = res;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            cur_handle(){
                this.isImport = !this.isImport;
            },
            /*读取文件流
            * */
            read_file(){

            },
            /*整理参数
            * */
            arrangement_params(){
                let data = clone(this.skuList).replace(new RegExp(' ', 'gm'),'\n')
                    .split('\n').filter(row=>!!row).map(row=>row.trim());
                if(data.length<=0)return false;
                return {
                    channel_ids:this.checkList,
                    skus:data,
                }
            },
            submit(){
                if(this.isImport){
                    if(this.files.length<=0){
                        this.$reqKey('batchStopSell',false);
                        return this.$message({type:'warning',message:'请添加或导入需要批量停售的SKU！'});
                    }
                    this.files.forEach(({file}) =>{
                        let data = {
                            extension: file.name.substring(file.name.lastIndexOf('.') + 1),
                            content: '',
                            channel_ids:this.checkList
                        };
                        let reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = (e) => {
                            this.$set(data,'content',e.target.result);
                            this.submit_api(data);
                        };
                    });
                }else{
                    let data = this.arrangement_params();
                    if(!data){
                        console.log('CESHI');
                        this.$reqKey('batchStopSell',false);
                        return this.$message({type:'warning',message:'请添加或导入需要批量停售的SKU！'});
                    }
                    this.submit_api(data);
                }
            },
            /*提交API
            * */
            submit_api(data){
                this.$http(api_batch_stopped_sku,data).then(res=>{
                    this.dialog = false;
                    this.$message({type:'success',message:res.message||res})
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('batchStopSell',false);
                });
            },
            cancel(){
                this.dialog = false;
            },
        },
        computed:{
            checkAll:{
                get(){
                    return !!(this.checkList.length === this.channelList.length);
                },
                set(val){
                    this.checkList = val?this.channelList.map(row=>row.value):[];
                },
            },
            isDisabled(){
                return !!this.files.length>=1;
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },

        },
        props:{
            value:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog').default,
        }
    }
</script>
