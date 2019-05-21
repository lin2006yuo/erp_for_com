<template>
    <page-dialog class="p-dialog-import-order" title="导入手工订单" @open="open" v-model="dialog"
                 size="full" :close-on-click-modal="false">
        <el-card :gutter="20">
            <label-select
                label="平台："
                class="inline ml-sm"
                fontWeight="bold"
                :lists="channelList"
                v-model="form.channel_id"
                :show-required="true"
                :clearable="true"
                :filterable="true"
                placeholder="请选择"
                @change="change_platform">
            </label-select>
            <label-select
                label="站点："
                class="inline ml-sm"
                fontWeight="bold"
                v-show="siteList.length>0"
                v-model="form.site_code"
                :lists="siteList"
                :show-required="true"
                :clearable="true"
                :filterable="true"
                placeholder="请选择"
                @change="change_site">
            </label-select>
            <label-select
                label="账号简称："
                class="inline ml-sm"
                fontWeight="bold"
                v-show="accountList.length>0"
                v-model="form.channel_account_id"
                :lists="accountList"
                :show-required="true"
                :clearable="true"
                :filterable="true"
                placeholder="请选择"
                @change="change_account">
            </label-select>
            <label-select
                label="发货仓库："
                class="inline ml-sm"
                fontWeight="bold"
                v-show="options.length>0"
                v-model="form.warehouse_id"
                :lists="options"
                :show-required="true"
                :clearable="true"
                :filterable="true"
                placeholder="请选择"
                @change="change_warehouse">
            </label-select>
        </el-card>
        <el-button
            class="ml-sm mt-sm"
            type="primary"
            size="mini"
            v-for="item in buttons"
            :key="item.label"
            @click.native="cur_click(item)"
            :disabled="disabled(item)"
        >{{item.label}}</el-button>
        <import-file v-model="addEvent"
                  :submit-url="submitUrl"
                  @download-file="download_file"
                  @files-data="change_table"></import-file>

        <data-table
            :data="tableData"
            @select="select"
            @add-new-data="add_new_data"
        ></data-table>

        <div slot="footer" class="dialog-footer">
            <request-button @click.native="keep" req-key="click_native_keep">确认导入</request-button>
            <el-button size="mini" @click.native="dialog=false">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .el-message-box {
        width: 630px !important;
        max-height 90% !important;
        overflow-y scroll !important;
    }
</style>
<script>
    import {api_save_import,api_post_import} from '../../../api/handwork';
    import {downloadFile} from '../../../lib/http';
    import {add_order,api_get_channel,api_get_account,api_get_country,api_get_warehouse } from '../../../api/handwork';
    export default {
        data() {
            return {
                submitUrl:api_post_import,
                dialog: this.value,
                params:{},
                clears:{},
                curChannel:"",
                accountList:[],
                form:{
                    channel_id:'',
                    site_code:'',
                    channel_account_id:'',
                    warehouse_id:'',
                    data:'',
                },
                buttons:[
                    {label:"添加",value:"add_tian"},
                    {label:"删除",value:"delete_shan"},
                ],
                addEvent:false,
                //平台获取
                channelList: [],
                //站点获取
                siteList: [],
                options: [],
                tableData:[],
                orderIdList:[],
            }
        },
        computed:{
            showSite(){
                return this.curChannel === "eBay平台"||this.curChannel === "ymx"?true:false;
            },
            showAccount(){
                return this.curChannel === "other"?false:true;
            }
        },
        methods: {
            open(){
                this.get_channel();
                this.siteList = [];
                this.accountList = [];
                this.form = {
                    channel_id:'',
                    site_code:'',
                    channel_account_id:'',
                    warehouse_id:'',
                    data:[],
                };
                this.tableData = [];
            },
            download_file(){//下载模板
                let url = config.apiHost+'downfile';
                let code={
                    code:'manualOrder'
                };
                downloadFile({
                    url:url,
                    get:code,
                    fileName:'下载模板',
                    suffix:'.xls',
                })
            },
            disabled(val){
                if(val.value==='delete_shan'){
                    if(this.tableData.length>0){
                        return false;
                    }
                    return true;
                }
            },
            change_table(val){
                this.tableData = val;
                this.tableData.forEach(row=>{
                    this.$set(row,'isRed',false);
                })
            },
            keep() {
                if(this.channelList.length>0&&this.siteList.length>0&&this.accountList.length>0){
                    if(!this.form.channel_id||!this.form.site_code||!this.form.channel_account_id){
                        this.$reqKey('click_native_keep',false);
                        return this.$message({type:"warning",message:"平台/站点/账号简称为必选项，请补充完整！"});
                    }
                    this.submit();
                }else if(this.channelList.length>0&&this.accountList.length>0){
                    if(!this.form.channel_id || !this.form.channel_account_id) {
                        this.$reqKey('click_native_keep',false);
                        return this.$message({message:"平台/账号简称为必选项，请补充完整！", type:'warning'});
                    }
                    this.submit();
                }else if(this.channelList.length>0&&this.siteList.length>0){
                    if(!this.form.channel_id || !this.form.site_code) {
                        this.$reqKey('click_native_keep',false);
                        return this.$message({message:"平台/站点为必选项，请补充完整！", type:'warning'});
                    }
                    this.submit();
                }else{
                    if(!this.form.channel_id) {
                        this.$reqKey('click_native_keep',false);
                        return this.$message({message:"请选择平台！", type:'warning'});
                    }
                    this.submit();
                }
            },
            // 确认导入
            submit(){
                this.form.data = this.tableData;
                if(this.form.data.find(row=>row.sku_quantity==='0'||row.sku_quantity==="")) {
                    this.$reqKey('click_native_keep',false);
                    return this.$message({message:"订单商品选择数据后，数量为必填项", type:'warning'});
                }
                if(this.form.data.find(row=>row.sku_price<=0)){
                    this.$reqKey('click_native_keep',false);
                    return this.$message({message:"商品单价不允许小于或等于0，请更正！",type:'warning'});
                }
                if(this.tableData.length>0){
                    let verify_abbreviation = this.tableData.find(row=>row.country_code==='国家简称不正确');
                    if(!!verify_abbreviation){
                        this.tableData.forEach(row=>{
                            row.country_code==='国家简称不正确'&&this.$set(row,'isRed',true);
                        });
                        this.$reqKey('click_native_keep',false);
                        return this.$message({message:"存在收货国家英文简称不正确的订单，请更正！",type:'warning'});
                    }
                    this.$http(api_save_import,this.form).then(res=>{
                        if(res.data&&res.data.length>0){
                            let newDatas = [];
                            const h = this.$createElement;
                            //通过循环data数组，调用h方法，将每项值传给h,h('标签名',样式,具体内容)
                            for(let i in res.data){
                                //将data数据push进newDatas数组中
                                newDatas.push(h('p',null,res.data[i]));
                            }
                            this.$msgbox({title:'提示', type:'error',message:h('div',{style:{width:'500px'}}, newDatas) || res});
                        }else{
                            this.$emit("save");
                            this.$message({
                                type: 'success',
                                message: res.message || res
                            });
                            this.dialog = false;
                        }
                    }).catch(code=>{
                        this.dialog = true;
                        this.$message({message:code.message||code,type:'error'});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('click_native_keep',false);
                        },200);
                    });
                }else {
                    this.$reqKey('click_native_keep',false);
                    return this.$message({type:"warning",message:"没有订单，请补充完整！"})
                }
            },

            /*平台*/
            change_platform(val){
                this.curChannel = val;
                this.get_site(val);
                this.get_warehouse(val);
                this.form.site_code = "";
                this.form.channel_account_id="";
            },
            /*站点*/
            change_site(val){
                if(!val) return;
                this.form.channel_account_id="";
                this.get_account(this.curChannel,val);
            },
            /*账号简称*/
            change_account(val){
//                console.log("val",val);
            },
            /*发货仓库*/
            change_warehouse(val){
//                console.log("val",val);
            },
//          获取平台
            get_channel(){
                this.$http(api_get_channel).then(res=>{
                    this.channelList = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
//          获取站点
            get_site(val){
                this.accountList = [];
                this.siteList = [];
                this.$http(api_get_account,{channel_id:val}).then(res=>{
                    if(res.site.length<=0){
                        this.accountList = res.account;
                    }else{
                        this.siteList = res.site;
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
//            获取账号
            get_account(channel,site){
                this.$http(api_get_account,{channel_id:channel,site_code:site}).then(res=>{
                    this.accountList = res.account;
                }).catch(code=>{
                    console.log(code);
                })
            },
//          获取发货仓库
            get_warehouse(val){
                this.$http(api_get_warehouse,{channel_id:val}).then(res=>{
                    this.options = res;
                    let find= res.find(row=>{
                        return row.label==='中山仓'
                    });
                    find&&(this.form.warehouse_id = find.value || '');
                }).catch(code=>{
                    console.log(code);
                })

            },
            select(val){
                this.orderIdList = val;
            },
            add_new_data(val){
                val.forEach((data)=>{
                    if(this.form.data.find(row=>{return row.channel_order_number===data.channel_order_number})) return this.$message({message:"请不要重复添加商品", type:'warning'})
                });
            },
            cur_click(item){
                switch (item.value){
                    case "add_tian":
                            this.addEvent = true;
                        break;
                    case "delete_shan":
                        this.$confirm('此操作将删除该选项, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.orderIdList.forEach(item => {
                                let index = this.tableData.findIndex(row =>row.channel_order_number === item.channel_order_number&&row.address===item.address);
                                if (index > -1) {
                                    this.tableData.splice(index, 1);
                                }
                            });
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除！'
                            });
                        });
                        break;
                }
            },
        },
        watch: {
            dialog(val) {
                this.$reqKey('click_native_keep',false);
                this.$emit('input', val);
            },

            value(val) {
                this.dialog = val;
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            }
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            labelSelect:require('../../../components/label-select.vue').default,
            dataTable:require('./select-table.vue').default,
            importFile:require('../../../components/import-file.vue').default,
        }
    }
</script>
