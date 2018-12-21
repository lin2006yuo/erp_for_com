<template>
    <page class="ymx-setting-p-index">
        <search :searchData="searchData" @reflash="reflash" @clear="clear" :channel="channel"></search>
        <el-row class="mb-xs mt-xs ml-sm">
            <permission tag="ElButton" :route="apis.url_amazon_email_account_add" type="primary" class="inline" @click="add"  size="mini">添加</permission>
        </el-row>
        <el-table
                :data="tableData"
                class="scroll-bar"
                v-resize="{height:10}"
                highlight-current-row
                v-loading="loading" element-loading-text="玩命加载中..."
                @selection-change="table_change"
                style="width: 100%">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    width="55"
                    prop="id"
                    label="ID">
            </el-table-column>
            <el-table-column
                    prop="account_code"
                    label="账号简称">
            </el-table-column>
            <el-table-column
                    inline-template
                    align="center"
                    width="55"
                    label="收取">
                <div >
                    <span v-if="row.allowed_receive===1" class="true"></span>
                    <span v-else  class="falses"></span>
                </div>
            </el-table-column>
            <el-table-column
                    width="55"
                    inline-template
                    align="center"
                    label="发送">
                <div >
                    <span v-if="row.allowed_send===1" class="true"></span>
                    <span v-else  class="falses"></span>
                </div>
            </el-table-column>
            <el-table-column
                    prop="imap_url"
                    label="POP3">
            </el-table-column>
            <el-table-column
                    prop="smtp_url"
                    label="SMTP">
            </el-table-column>
            <el-table-column
                    prop="email_account"
                    label="邮箱账号">
            </el-table-column>
            <el-table-column
                    width="80"
                    inline-template
                    align="center"
                    label="是否启用">
                <div>
                    <permission tag="ElSwitch" :route="apis.url_amazon_email_account_status":key="row.id"
                                v-model="row.is_enabled"
                                on-text="启用"
                                off-text="停用"
                                @change="chang_status(row)"></permission>
                </div>
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="send_qty"
                    label="发送数量">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="receive_qty"
                    label="收取数量">
            </el-table-column>
            <el-table-column
                    inline-template
                    label="添加时间">
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="修改时间">
                <times :time="row.update_time"></times>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="操作"
                    width="300">
                <div>
                    <div v-for="(item,i) in actionss" class="inline"  >
                        <span  class='operate'  @click="operates(item,row)">{{item.label}}</span>
                        <span v-if="i!==(action.length-1)" >  &nbsp;| &nbsp;</span>
                    </div>
                </div>
            </el-table-column>
        </el-table>
        <edit v-model="show" :channel="channel" :form="form" :isAdd="isAdd" :title="title" @edit-update="edit_update" @add-update="add_update"></edit>
        <log v-model="logShow" :logData="logData" :title="logTitle"></log>
    </page>
</template>
<style lang="stylus">
    .ymx-setting-p-index{
        .true{
            display: inline-block;
            width: 26px;
            height: 22px;
            background: url("../../../assets/true.png") no-repeat 0 0;
            background-size: 100% 100%;
        }
        .falses{
            display: inline-block;
            width: 26px;
            height: 22px;
            background: url("../../../assets/false.png") no-repeat 0 0;
            background-size: 100% 100%;
        }
    }
</style>
<script>
    import {api_amazon_email_account_list,api_amazon_email_account_del,api_amazon_email_account_log,api_amazon_email_account_status,url_amazon_email_account_add,url_amazon_email_account_status,url_amazon_email_account_mdf,url_amazon_email_account_log,url_amazon_email_account_del,api_amazon_email_account_look} from "../../../api/letter-amazon"
    import {api_get_channel} from "@/api/order-local"
    export default{
        permission:{
            url_amazon_email_account_add,url_amazon_email_account_status,url_amazon_email_account_mdf,url_amazon_email_account_log,url_amazon_email_account_del
        },
        page:{},
        refresh(){
            this.init();
        },
        data(){
            return {
                firstLoading:true,
                channel:[],
                searchData:{
                    page:1,
                    pageSize:50,
                    account_id:'',
                    email_account:"",
                    channel_id:1,
                    site:""
                },
                logData:[],
                logShow:false,
                selected:[],
                tableData:[],
                loading:false,
                show:false,
                isAdd:true,
                form:{
                    channel_id:'',
                    site:'',
                    account_id:'',
                    email_account:'',
                    email_password:'',
                    imap_url:'',
                    imap_ssl_port:'',
                    smtp_url:'',
                    smtp_ssl_port:'',
                    is_enabled:1,
                    allow_receive:1,
                    allow_send:1,
                },
                title:'',
                logTitle:'',
                action:[
                    {label:'修改',api:url_amazon_email_account_mdf,action(row){
                            this.$http(api_amazon_email_account_look,row.id).then(res=>{
                                this.title=`修改账号: ${row.account_code} 的邮件设置`;
                                this.show=true;
                                this.isAdd=0;
                                this.form=res.data;
                            }).catch(code=>{
                                this.$message({type: "success", message: res.message || res})
                            })
                        }},
                    {label:'复制添加',api:url_amazon_email_account_add,action(row){
                            this.$http(api_amazon_email_account_look,row.id).then(res=>{
                                this.title=`复制添加账号: ${row.account_code} 的邮件设置`;
                                this.show=true;
                                this.isAdd=2;
                                this.form=res.data;
                            }).catch(code=>{
                                this.$message({type: "success", message: res.message || res})
                            })
                        }},
                    {label:'查看日志',api:url_amazon_email_account_log,action(row){
                            this.$http(api_amazon_email_account_log,row.id).then(res=>{
                                this.logData=res;
                                this.logTitle = row.account_code;
                                this.logShow=true;
                            }).catch(code=>{
                                this.$message({type: "error", message: code.message || code})
                            })
                        }},
                    {label:'删除',api:url_amazon_email_account_del,action(row){
                            this.$confirm(`您将删除账号为${row.account_code}的邮件，确认此操作吗？`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.$http(api_amazon_email_account_del,{ids:row.id}).then(res=>{
                                    this.$message({type: "success", message: res.message || res})
                                    let i = this.tableData.indexOfFun(row,function (old,row) {
                                        return old.id===row.id
                                    });
                                    this.tableData.splice(i,1)
                                }).catch(code=>{
                                    this.$message({type: "error", message: code.message || code})
                                })
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '取消操作'
                                });
                            });
                        }},

                ]
            }
        },
        created(){
            this.init();
            this.get_channel();
        },
        mounted(){
        },
        computed: {
            actionss(){
                return this.action.filter(row=>{
                    return  this.$hasPermission(row.api)
                })
            },
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        methods: {
            get_channel(){
                this.$http(api_get_channel).then(res=>{
                    this.channel=res;
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });

            },
            reflash(){
                this.init();
            },
            init(){
                this.loading=true;
                this.$http(api_amazon_email_account_list,this.searchData).then(res=>{
                    this.loading=false;
                    this.firstLoading = false;
                    this.tableData=res.data.map(row=>{
                        row.is_enabled=row.is_enabled===1?true:false
                        return row
                    })
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            table_change(val){
                this.selected=val;
            },
            add(){
                this.form={
                    channel_id:'',
                    site:'',
                    account_id:'',
                    email_account:'',
                    email_password:'',
                    imap_url:'',
                    imap_ssl_port:'',
                    smtp_url:'',
                    smtp_ssl_port:'',
                    is_enabled:1,
                    allow_receive:1,
                    allow_send:1,
                };
                this.show=true;
                this.isAdd=1;
                this.title='添加邮件设置管理';
            },
            clear(){
                this.searchData={
                    page:1,
                    pageSize:50,
                    account_id:'',
                    email_account:""
                };
                this.init();
            },
            add_update(id,val){
                val.id=parseInt(id);
                val.create_time = Date.parse(new Date)/1000;
                val.is_enabled=!!val.is_enabled;
                val.receive_qty=0;
                this.tableData.unshift(val);
            },
            edit_update(id,val){
                let update_time = Date.parse(new Date);
                val.update_time = update_time/1000;
                val.is_enabled=!!val.is_enabled;
                let find = this.tableData.find(row=>{
                    return row.id === id;
                });
                if(!!find){
                    Object.assign(find,val);
                }
            },
            chang_status(row){
                let statusTitle = row.is_enabled ? '停用' : '启用';
                this.$confirm('您将' + statusTitle + row.account_code + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    this.$http(api_amazon_email_account_status,row.id,{ is_enabled:row.is_enabled ? 1 : 0,}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code,
                        });
                        row.is_enabled = !row.is_enabled
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + statusTitle
                    });
                    row.is_enabled = !row.is_enabled
                });
            },
            operates(item,row){
                item.action.call(this,row)
            }
        },
        filters: {},
        watch: {},
        props: {},
        components: {
            search:require('./search.vue').default,
            edit:require("./edit.vue").default,
            log:require("./log.vue").default,
            paramAccount:require('../../../api-components/param-account.vue').default
        }
    }
</script>
