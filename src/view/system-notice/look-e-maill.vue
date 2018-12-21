<template>
    <page-dialog :title="lookTitle" v-model="show" size="large" :close-on-click-modal="true">
        <el-row style="text-align: center;">
                <div style="font-size: 20px;font-weight: bold;">{{lookData.title}}</div>
        </el-row>
        <el-row style="text-align: center;">
            <template v-if="isDraft">
                <label class="inline">创建时间：</label>
                <div class="inline">{{lookData.create_time|filterDate}}</div>
            </template>
            <template v-else>
                <label class="inline">发送时间：</label>
                <div class="inline">{{lookData.send_time?lookData.send_time:lookData.sent_time|filterDate}}</div>
            </template>
            <template v-if="isInboxOpen">
                <label class="inline ml-md">发送者：</label>
                <div class="inline">{{lookData.send_name?lookData.send_name:lookData.create_name}}</div>
            </template>
            <template v-else>
                <label class="inline ml-md">收件人：</label>
                <div class="inline">{{receiver}}</div>
            </template>
            <label class="inline ml-md">类型：</label>
            <div class="inline">{{filterType}}</div>
            <template v-if="isInboxOpen">
                <label class="inline ml-md">状态：</label>
                <div class="inline" :style="lookData.read!==1?'color: red;':''">{{lookData.read|filterRead}}</div>
                <permission class="ml-md inline"
                            v-if="lookData.read!==1"
                            tag="request-button"
                            req-key="url_put_internal_letters_read"
                            :mintime="200"
                            type="primary"
                            size="mini"
                            :route="apis.url_put_internal_letters_read"
                            @click="mark_read">标记为已读
                </permission>
            </template>
        </el-row>
        <hr>
        <el-row style="min-height: 200px;">
            <div v-html="lookData.content"></div>
        </el-row>
        <el-row v-if="lookData.attachment">
            <span>附件：</span>
            <span>{{lookData.file_name}}</span>
            <span class="operate ml-sm" @click="download">下载附件</span>
        </el-row>
        <hr>
        <el-row>
            <el-col :span="12">
                <div style="text-align: center;">
                    上一条：<span class="operate" v-if="lookPrev.title" @click="look(lookPrev)">{{lookPrev.title}}</span>
                    <span class="disabled" v-else>已经是第一条</span>
                </div>
            </el-col>
            <el-col :span="12">
                <div style="text-align: center;">
                    下一条：<span class="operate" v-if="lookNext.title" @click="look(lookNext)">{{lookNext.title}}</span>
                    <span class="disabled" v-else>已经是最后一条</span>
                </div>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <!--<el-button size="mini" @click.native="keep" type="primary">确定</el-button>-->
            <el-button size="mini" @click.native="close">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {downloadFile} from '../../lib/http';
    import {
        api_put_internal_letters_read,
        url_put_internal_letters_read
    } from '@/api/system-notice-inbox'

    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'邓海波',
                createTime:'2018-8-22',
                updateTime:'2018-8-31'
            }
        },
        permission:{
            url_put_internal_letters_read
        },
        data() {
            return {
                show: this.value,
            }
        },
        methods: {
            close() {
                this.show = false;
            },
            mark_read(){
                this.$http(api_put_internal_letters_read,{letter_ids:[this.lookData.letter_text_id]}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.$emit('mark_read',this.lookData.letter_text_id);
                    this.lookData.read = 1;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_put_internal_letters_read',false);
                    },200);
                });
            },
            look(data){
                this.$emit('look',data);
            },
            download(){
                let url = `${window.config.apiHost}internal-letters/attachment`;
                downloadFile({
                    url:url,
                    get:{full_name:this.lookData.attachment},
                    fileName:this.lookData.file_name,
                    suffix:this.lookData.file_name.slice(this.lookData.file_name.lastIndexOf('.')),
                });
            }
        },
        computed:{
            filterType(){
                return this.typeList.find(row=>row.value===this.lookData.type)?this.typeList.find(row=>row.value===this.lookData.type).label:this.lookData.type
            },
            receiver(){
                return Array.isArray(this.lookData.receive_name)?this.lookData.receive_name.join(','):'';
            }
        },
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd HH:mm:ss',val):'-- --';
            },
            filterRead(val){
                return val===1?'已读':'未读';
            },
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            lookTitle: {
                type: String
            },
            lookData:{
                required:true,
                type:Object
            },
            lookPrev:{
                required:true,
                type:Object
            },
            lookNext:{
                required:true,
                type:Object
            },
            typeList:{
                required:true,
                type:Array
            },
            isInboxOpen:{
                type:Boolean,
                default(){
                    return false
                }
            },
            isDraft:{
                type:Boolean,
                default(){
                    return false
                }
            },
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>
