<template>
    <page class="ymx-letter-p-index-write">
        <el-row>
            <table class="template">
                <tr>
                    <td>
                        <el-select v-model="sendData.order_number_type" placeholder="请选择" class="inline" style="width:100px;">
                        <el-option
                                :key="item.value"
                                v-for="item in option"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    </td>
                    <td>
                        <el-input  v-model="sendData.order_number"  class="inline inputs"></el-input>
                        <permission tag="ElButton" :route="apis.url_amazon_writ_load"size="mini"  @click="load('')" type="primary" class="inline ml-xs" :disabled="!sendData.order_number">加载信息</permission>
                        <permission tag="ElButton" :route="apis.url_amazon_writ_load"size="mini"  @click="clear" type="primary" class="inline ml-xs" :disabled="!sendData.order_number">清空数据</permission>
                    </td>
                </tr>
            <tr>
                <td> <label class="lables">账号：</label></td>
                <td>
                    <span v-if="isLoad">{{sendData.account_code}}</span>
                    <el-select v-model="sendData.account_id" placeholder="请选择" class="inline mr-sm s-width-default" clearable @change="change_account" v-if="!isLoad">
                        <el-option
                                v-for="item in accounts"
                                :key="item.id"
                                :label="item.code"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <label class="lables">客服：</label>
                    <el-select v-model="sendData.customer_id" placeholder="请选择" class="inline s-width-default" :disabled="!sendData.account_id" clearable>
                        <el-option
                                v-for="(item,i) in customers"
                                :key="`${item.customer_id}${i}`"
                                :label="item.realname"
                                :value="item.customer_id">
                        </el-option>
                    </el-select>
                </td>
            </tr>
                <tr>
                    <td> <label class="lables">上传附件：</label></td>
                    <td>&nbsp;
                        <image-upload :thumbnail-mode="true" label="上传附件"  class="inline" :multiple="false" :image="{width:'100px',height:'100px'}" ref="images"   :init="annex" ></image-upload>
                    </td>
                </tr>

                <tr>
                    <td> <label class="lables">主题：</label></td>
                    <td>  <el-input v-model="sendData.subject" class="inline inputs"></el-input></td>
                </tr>
                <tr>
                    <td><label class="lables">客户姓名：</label></td>
                    <td>  <el-input v-model="sendData.buyer_name" class="inline inputs" :disabled="isLoad"></el-input></td>
                </tr>
                <tr>
                    <td>  <label class="lables">邮箱：</label></td>
                    <td> <el-input v-model="sendData.buyer_email" class="inline mr-xs inputs" :disabled="isLoad"></el-input>
                        <span style="color: red">温馨提示：不建议修改客户邮件，一旦对应错了账号，会关联账号被封</span></td>
                </tr>
                <tr>
                    <td>   <label class="lables">选择模板：</label></td>
                    <td>    <el-select v-model="templates" placeholder="请选择" class="inline " @input="change_template">
                        <el-option
                                v-for="item in templateList"
                                :key="item.template_id"
                                :label="item.template_name"
                                :value="item.template_id">
                        </el-option>
                    </el-select>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <html-editor editid="amazonSend" v-model="sendData.content"></html-editor>
                    </td>
                </tr>
                <tr>
                    <td>   <label class="lables">保存为模板：</label></td>
                    <td>
                        <el-input v-model="templateName" class="inline"></el-input>
                        <el-select v-model="templateTeam" placeholder="请选择" class="inline ml-xs" >
                            <el-option
                                    v-for="item in teams"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <permission tag="ElButton" :route="apis.url_add_reply"size="mini" @click="save_template" type="primary" class="inline ml-xs">保存为新模板</permission>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="spec">
                        <permission tag="ElButton" :route="apis.url_amazon_write" size="mini"  @click="send" type="primary" class="inline" style="margin-left:120px">发送</permission>
                    </td>
                </tr>
            </table>
          <el-row class="mt-xs">

          </el-row>

        </el-row>
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
    import {api_amazon_writ_load,api_amazon_write_account,api_amazon_write_customer,api_amazon_write,api_get_email_account,url_amazon_writ_load,url_amazon_write} from "../../../../api/letter-amazon"
    import {api_all_templates,api_templates_content} from "../../../../api/inbox"
    import {api_reply_team,api_add_reply,url_add_reply} from "../../../../api/reply-template"
    export default{
        permission:{
            url_amazon_writ_load,url_add_reply,url_amazon_write
        },
        page: {},
        refresh(){
            this.sendData = {
                order_number_type:'system',
                order_number:'',
                account_id:'',
                customer_id:'',
                buyer_name: '',
                buyer_email:'',
                subject:'',
                content:'',
                account_code:'',
                system_order_id:''
            };
        },
        data(){
            return {
                search_type:'system',
                search_value:'',
                accounts:[],
                customers:[],
                templateList:[],
                templateName:'',
                templateTeam:'',
                option:[{label:"系统单号",value:"system"},
                         {label:"平台单号",value:"channel"},],
                sendData:{
                    order_number_type:'system',
                    order_number:'',
                    account_id:'',
                    customer_id:'',
                    buyer_name:'',
                    buyer_email:'',
                    subject:'',
                    content:'',
                    account_code:'',
                    system_order_id:''
                },
                templates:'',
                isLoad:false,
                annex:[],
                teams:[],
                temp:[],
                }
        },
        created(){
            this.get_all_template();
            this.get_team();
            this.get_account()
        },
        mounted(){
            if(window.objlength(this.param)!==0){
                this.load(this.param.ordersNumber);
            }
        },
        methods: {
            get_team(){
                this.teams=[];
                this.$http(api_reply_team,{template_type:1, channel_id:2}).then(res=>{
                    this.teams=res.data.map(row=>{
                        return {
                            value:row.id,
                            label:row.group_name
                        }
                    })
                }).catch(code=>{
                    console.log(code)
                })
            },
            load(num){
                let number = num || this.sendData.order_number.trim();
                this.$http(api_amazon_writ_load,this.sendData.order_number_type,number).then(res=>{
                    this.isLoad=true;
                    this.sendData.account_code=res.data.account_code;
                    this.sendData.account_id=res.data.account_id;
                    this.sendData.buyer_email=res.data.buyer_email;
                    this.sendData.buyer_name=res.data.buyer_name;
                    this.sendData.system_order_id=res.data.system_order_id;
                    this.customers= res.data.customers;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code});
                    this.isLoad=false;
                    let data={
                        account_id:'',
                        account_code:'',
                        customer_id:'',
                        buyer_name:'',
                        buyer_email:'',
                        subject:'',
                        content:'',
                        system_order_id:''
                    }
                 this.extend(this.sendData,data)

                })
            },
            clear(){
                for(let i in  this.sendData){
                    this.sendData[i]=''
                }
                this.sendData.order_number_type='system'
            },
            extend(o,n){
                    for (var p in n){
                        if(n.hasOwnProperty(p) && (o.hasOwnProperty(p) ))
                            o[p]=n[p];
                    }
            },
            change_account(){
                this.customers = [];
                this.sendData.customer_id = '';
                if(!!this.sendData.account_id) {
                    this.$http(api_amazon_write_customer, {account_id: this.sendData.account_id}).then(res => {
                        this.customers = [{realname: '全部', customer_id: ''}, ...res.data];
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }
            },
            get_all_template(){
                let data={
                    type:1,channel_id:2,template_type:1
                }
                this.templateList=[];
                this.$http(api_all_templates,data).then(res=>{
                    this.templateList=res.data
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            change_template(){
                let data={
                    template_id:this.templates,
                    channel_id:2,
                }
                if(this.isLoad){
                    if(this.sendData.order_number_type==='system'){
                       data.search_type='order';
                       data.search_id=this.sendData.system_order_id;
                    }else {
                        data.search_id=this.sendData.order_number;
                        data.search_type='channel_order';
                    }
                }
                this.$http(api_templates_content,data).then(res=>{
                    this.sendData.content=res.data;
                    this.$forceUpdate()
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            save_template(){
                let data={
                    channel_id:2,
                    template_type:1,remark:'',
                    content:this.sendData.content,
                    group_id:this.templateTeam,
                    template_no:this.templateName,
                    template_name:this.templateName
                }
                return this.$http(api_add_reply,data).then(res=>{
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            send(){
                let param;
                if(this.isLoad){
                    param={
                        order_number_type:this.sendData.order_number_type,
                        order_number:this.sendData.order_number,
                        customer_id:this.sendData.customer_id,
                        subject:this.sendData.subject,
                        content:this.sendData.content
                    }
                    if(this.annex.length>0){
                        param.file_data=this.annex[0].image;
                        param.file_name=this.annex[0].name;
                    }
                }else {
                    param={
                        customer_id:this.sendData.customer_id,
                        account_id:this.sendData.account_id,
                        buyer_name:this.sendData.buyer_name,
                        buyer_email:this.sendData.buyer_email,
                        subject:this.sendData.subject,
                        content:this.sendData.content,
                    }
                    if(this.annex.length>0){
                        param.file_data=this.annex[0].image;
                        param.file_name=this.annex[0].name;
                    }
                }
                return this.$http(api_amazon_write,param).then(res=>{
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            get_account(){
                this.$http(api_get_email_account).then(res => {
                    console.log(res);
                    this.accounts = res.map(row => {
                        return {
                            code: row.code,
                            id: row.id
                        }
                    })
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            }
        },
        filters: {},
        watch: {
            param(val){
                if(val.ordersNumber){
                    this.load(val.ordersNumber);
                }
            }
        },
        props: {},
        components: {
            htmlEditor:require('@/components/html-editor.vue').default,
            imageUpload:require("../../smt/inbox/image-upload.vue").default,
        }
    }
</script>
