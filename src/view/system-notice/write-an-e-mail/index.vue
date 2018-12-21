<template>
    <page class="ymx-letter-p-index-write">
        <el-row>
            <table class="template">
                <tr>
                    <td>
                        <label class="lables">通知类型：</label>
                    </td>
                    <td>
                        <el-select v-model="sendData.type" placeholder="请选择" class="inline" style="width:100px;">
                            <el-option
                                :key="item.value"
                                v-for="item in typeList"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
            <tr>
                <td> <label class="lables">收件人：</label></td>
                <td>
                    <el-button size="mini"
                               @click.native="addAddressee"
                               type="primary" class="inline mb-mini">{{memData.length>0?'编辑收件人':'添加收件人'}}</el-button>
                    <span v-if="memData.length>0">已添加 {{memData.length}} 个收件人</span>
                </td>
            </tr>
                <tr>
                    <td><label class="lables">标题：</label></td>
                    <td><el-input v-model="sendData.title" :maxlength="120" class="inline inputs"></el-input></td>
                </tr>
                <tr>
                    <td><label class="lables">内容：</label></td>
                    <td>
                        <kindeditor :editor-text="sendData.content"
                                    :show-add-pic-normal="false"
                                    :show-add-pic-local="true"
                                    :width="`100%`"
                                    :height="`403px`"
                                    :id="sendData.id"
                                    :add_img_btn="addImgBtn"
                                    @content-change="editor_content_change"
                                    :editor-id="`sendData_index_id_trueId_channelId_spu`"></kindeditor>
                    </td>
                </tr>
                <tr>
                    <td> <label class="lables">上传附件：</label></td>
                    <td>
                        <file-upload
                            v-show="!hasFile"
                            :thumbnail-mode="true"
                            label="上传附件"
                            class="inline"
                            :multiple="false"
                            :image="{width:'100px',height:'100px'}"
                            @handle-change="image_change"
                            ref="update_file"
                            :init="annex"></file-upload>
                        <div v-show="hasFile" class="inline">
                            <span>{{sendData.file_name}}</span>
                            <span class="operate ml-sm" @click="download">下载附件</span>
                            <span class="operate ml-sm" @click="updateFile">更换附件</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                    </td>
                    <td>
                        <permission
                            tag="ElButton"
                            :route="apis.url_post_internal_letters"
                            size="mini"
                            @click="send"
                            type="primary"
                            class="inline">发送</permission>
                        <permission
                            tag="ElButton"
                            :route="apis.url_post_internal_letters_draftbox"
                            size="mini"
                            @click="save_template"
                            type="primary"
                            class="inline ml-xs">保存到草稿箱</permission>
                    </td>
                </tr>
            </table>
          <el-row class="mt-xs">
          </el-row>
        </el-row>
        <member-management v-model="addresseeVisibility" :mem-data="memData" :send-or-save="sendOrSave" :is-loading="isLoading"></member-management>
    </page>
</template>
<style lang="stylus">
    .ymx-letter-p-index-write{
            .inputs{
                width: 400px;
            }
            .lables{
                width: 80px;
                display: inline-block;
                text-align: right;
            }
            .template{
                tr{
                    td{
                        line-height: 36px;
                    }
                    .spec{
                        text-align: left!important;
                        margin-left: 120px;
                    }
                    td:nth-child(1){
                        width: 80px;
                        text-align: right;
                    }
                    td:nth-child(2){
                        text-align: left;
                    }
                }
            }

    }
</style>
<script>
    import {downloadFile} from '../../../lib/http';
    import {api_get_internal_letter_get_all_type} from '@/api/system-notice-inbox'
    import {
        url_post_internal_letters,
        api_post_internal_letters,
        url_post_internal_letters_draftbox,
        api_post_internal_letters_draftbox
    } from '@/api/write-e-mail'
    export default{
        permission:{
            url_post_internal_letters,
            url_post_internal_letters_draftbox
        },
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'邓海波',
                createTime:'2018-8-22',
                updateTime:'2018-8-31'
            }
        },
        refresh(){
            this.clear_form();
        },
        data(){
            return {
                accountList:[],
                typeList:[],
                sendData:{
                    type:'',
                    receive_ids:[],
                    title:'',
                    content: ``,
                    file_name:'',
                    attachment:''
                },
                addImgBtn:{
                    'position': 'absolute',
                    'top':'-4px',
                    'left':'572px',
                    'z-index':'1000',
                },
                annex:[],
                memData:[],
                addresseeVisibility:false,
                isLoading:false,
                id:'',
                sendOrSave:false
            }
        },
        mounted(){
            if(window.objlength(this.param)!==0){
                this.sendData = {
                    type:'',
                    receive_ids:[],
                    title:'',
                    content:'',
                    attachment:''
                };
                this.id = '';
                this.annex = [];
                this.memData = [];
                this.sendData = {
                    type:this.param.resData.type,
                    receive_ids:this.param.resData.receive_ids,
                    title:this.param.resData.title,
                    content:this.param.resData.content,
                    attachment:this.param.resData.attachment
                };
                let attachment = this.sendData.attachment;
                if(!!attachment){
                    let file_name = attachment.slice(attachment.lastIndexOf('/')+1);
                    this.$set(this.sendData,'file_name',file_name);
                    this.$set(this.sendData,'imgPath',(/\.(png$|PNG$|jpg$|JPG$|JPEG$)/.test(file_name))?window.config.apiHost+attachment.replace('./',''):'')
                }
                this.id = this.param.resData.id;
                this.memData = this.param.resData.user_data;
                this.sendOrSave = false;
            }
            this.get_mes_type();
        },
        methods: {
            clear_form(){
                this.sendData = {
                    type:'',
                    receive_ids:[],
                    title:'',
                    content:'',
                    file_name:'',
                    attachment:''
                };
                this.id = '';
                this.annex = [];
                this.memData = [];
            },
            addAddressee(){
                this.addresseeVisibility = true;
            },
            get_mes_type(){
                this.$http(api_get_internal_letter_get_all_type).then(res=>{
                    this.typeList = res;
                }).catch(code=>{
                    console.log(code);
                });
            },
            editor_content_change(val){
                this.sendData.content = val;
            },
            init_params(){
                let data = window.clone(this.sendData);
                data.receive_ids = this.memData.map(row=>row.id);
                data.attachment = this.annex;
                if(this.id){
                    data.id = this.id;
                }
                delete data.file_name;
                delete data.imgPath;
                return data;
            },
            verification_send_data(){
                if(this.sendData.type===''){
                    this.$message({type:'warning',message:'请选择通知类型！'});
                    return false
                }
                if(this.sendData.content.trim()===''){
                    this.$message({type:'warning',message:'请填写邮件内容！'});
                    return false
                }
                if(this.memData.length===0){
                    this.$message({type:'warning',message:'请选择收件人！'});
                    return false
                }
                if(this.sendData.title.trim()===''){
                    this.$message({type:'warning',message:'请填写邮件标题！'});
                    return false
                }
                return true
            },
            image_change(images){
                this.sendData.attachment = '';
                this.sendData.file_name = '';
                this.sendData.imgPath = '';
                this.annex = images;
            },
            send(){
                if(!this.verification_send_data()){
                    return
                }
                let params = this.init_params();
                this.$http(api_post_internal_letters,params).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.$refs.update_file.remove(this.annex);
                    this.clear_form();
                    this.sendOrSave = true;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            verification_template_data(){
                if(
                    this.sendData.type===''
                    &&this.sendData.content.trim().length===64
                    &&this.memData.length===0
                    &&this.sendData.title.trim()===''
                    &&this.annex.length===0
                ){
                    this.$message({type:'warning',message:'请至少填写一项内容才能保存！'});
                    return false
                }
                return true
            },
            save_template(){
                if(!this.verification_template_data()){
                    return
                }
                let params = this.init_params();
                this.$http(api_post_internal_letters_draftbox,params).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.$refs.update_file.remove(this.annex);
                    this.clear_form();
                    this.sendOrSave = true;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            download(){
                let url = `${window.config.apiHost}internal-letters/attachment`;
                downloadFile({
                    url:url,
                    get:{full_name:this.sendData.attachment},
                    fileName:this.sendData.file_name,
                    suffix:this.sendData.file_name.slice(this.sendData.file_name.lastIndexOf('.')),
                });
            },
            updateFile(){
                this.$refs.update_file.input_focus();
            }
        },
        watch:{
            param(val){
                if(val.letter_id&&val.resData){
                    this.sendData = {
                        type:'',
                        receive_ids:[],
                        title:'',
                        content:'',
                    };
                    this.id = '';
                    this.annex = [];
                    this.memData = [];
                    this.sendData = {
                        type:val.resData.type,
                        receive_ids:val.resData.receive_ids,
                        title:val.resData.title,
                        content:val.resData.content,
                        attachment:val.resData.attachment
                    };
                    let attachment = this.sendData.attachment;
                    if(!!attachment){
                        let file_name = attachment.slice(attachment.lastIndexOf('/')+1);
                        this.$set(this.sendData,'file_name',file_name);
                        this.$set(this.sendData,'imgPath',(/\.(png$|PNG$|jpg$|JPG$|JPEG$)/.test(file_name))?window.config.apiHost+attachment.replace('./',''):'')
                    }
                    this.id = this.param.resData.id;
                    this.memData = val.resData.user_data;
                    this.sendOrSave = false;
                }
            }
        },
        computed:{
            hasFile(){
                return this.sendData.attachment!==''
            }
        },
        components: {
            kindeditor:require('@/components/kindeditor.vue').default,
            fileUpload:require("./file-upload.vue").default,
            memberManagement:require('./member-management').default,
        }
    }
</script>
