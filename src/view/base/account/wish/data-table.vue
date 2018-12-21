<template>
    <el-row class="p-wish-table">
        <div>
            <el-table
                    v-resize="{height:41}"
                    :data="wishData.list"
                    v-loading="loading"
                    highlight-current-row
                    @sort-change="sort_change"
                    @selection-change="selectionChange"
                    element-loading-text="玩命加载中...">
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column property="code" sortable
                                 label="简称" align="center"
                                 width="150"></el-table-column>
                <el-table-column label="wish账户" sortable
                                 inline-template>
                    <div>
                        <ui-tip :content="row.account_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column property="expiry_time" label="密钥有效期" sortable
                                 align="center"></el-table-column>
                <el-table-column label="数据同步" align="center" inline-template>
                    <div >
                        <span class="succeed-download-order"
                              v-if="row.is_invalid && row.download_order>0"
                              :title="`远程订单${row.download_order}分钟抓取一次`"></span>
                        <span class="default-download-order" v-else title="抓取Wish订单功能已关闭"></span>
                        <span class="succeed-sync-delivery"
                              v-if="row.is_invalid && row.sync_delivery>0"
                              :title="`发货状态${row.sync_delivery}分钟同步一次`"></span>
                        <span class="default-sync-delivery"
                              v-else title="同步发货状态到Wish功能已关闭"></span>
                        <span class="succeed-download-listing"
                              :title="`远程刊登数据${row.download_listing}分钟抓取一次`"
                              v-if="row.is_invalid && row.download_listing>0"></span>
                        <span class="default-download-listing"
                              title="抓取远程刊登数据未开启"
                              v-else></span>
                        <span class="succeed-sync-health"
                              :title="`健康数据${row.download_health/60}小时同步一次`"
                              v-if="row.is_invalid && row.download_health>0"></span>
                        <span class="default-sync-health"
                              title="同步健康数据功能未开启"
                              v-else></span>
                    </div>
                </el-table-column>
                <el-table-column  label="wish状态" align="center"  inline-template>
                    <div :class="row.wish_enabled===1?'sucStatus':'loseStatus'">
                        {{row.wish_enabled|filterStatus}}</div>
                </el-table-column>
                <el-table-column inline-template  label="系统状态" align="center">
                    <div>
                        <el-switch :key="row.code"
                                   v-model="row.is_invalid"
                                   :on-text="status[0]"
                                   on-color="#20a0ff"
                                   :off-text="status[1]"
                                   off-color="#C0CCDA"
                                   @change="changStatus(row)">
                        </el-switch>
                    </div>
                </el-table-column>
                <el-table-column inline-template
                                 label="管理操作"
                                 inline-template
                                 align="center"
                                 width="290">
                    <div>
                        <permission
                                tag="span"
                                :route="apis.url_wish_look"
                                class="operate"
                                @click="look_over(row)">查看</permission>
                        <permission
                                tag="span"
                                :route="apis.url_wish_look">&nbsp;|&nbsp;</permission>
                        <permission
                                tag="span"
                                :route="apis.url_wish_edit"
                                class="operate"
                                @click="edit(row)">编辑</permission>
                        <permission
                                tag="span"
                                :route="apis.url_wish_edit">&nbsp;|&nbsp;</permission>
                        <permission
                                tag="span"
                                :route="apis.url_wish_client"
                                class="operate" @click="author(row)">
                            {{row.is_authorization |filterAuthor}}</permission>
                        <permission
                                tag="span"
                                :route="apis.url_wish_client">&nbsp;|&nbsp;</permission>
                        <permission tag="span"
                                    class="operate"
                                    @click="update_token(row)"
                                    :route="apis.url_refresh_token">更新token</permission>
                        <permission
                                tag="span"
                                :route="apis.url_refresh_token">&nbsp;|&nbsp;</permission>
                        <permission
                                tag="span"
                                :route="apis.url_add_member"
                                class="operate"
                                @click="add_member(row)">添加成员</permission>
                    </div>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="page-fixed"
                    @size-change="size_change"
                    @current-change="current_change"
                    :current-page='wishData.page'
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size='wishData.pageSize'
                    layout="total, sizes, prev, pager, next, jumper"
                    :total='wishData.total'>
            </el-pagination>
        </div>

    </el-row>
</template>
<style lang="stylus">
    .p-wish-table{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
        .sucStatus{
            color:#339907
        }
        .loseStatus{
            color:#ff0000;
        }
    }
</style>
<script>
    import  authorize from './authorize.vue'
    import  edit from './edit.vue'
    import {wish_invalid,api_refresh_token} from '../../../../api/wish';
    import {url_wish_look,url_wish_edit,url_wish_client,url_refresh_token} from '../../../../api/wish';
    import {url_add_member} from '../../../../api/aliexpress';
    export default{
        permission:{
            url_wish_look,
            url_wish_edit,
            url_wish_client,
            url_add_member,
            url_refresh_token
        },
        data(){
            return{
                showUserManage:false,
                titleName:'',
                authorVisible:false,
                editVisible:false,
                status:["启用","停用"],
                curStatus:false,
                memberData:[],
                editData:{},
                account:{},
                memberDialog:false,
                dataMember:[],
                accountName:"",
                memberLoading:false,
                action:{
                    name:'',
                    label:''
                }
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        methods:{
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            size_change(val){
                this.$emit('size-change',val);
            },
            current_change(val){
                this.$emit('current-change',val);
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
//            gain_token(){
//                this.$emit('gain_token')
//            },
            look_over(row){//---------------查看
                this.$emit('look-over',row);
//                this.editVisible = true;
//                this.action.name = 'view';
//                this.action.label = '查看';
//                this.titleName = `${this.action.label}账户：${row.account_name} 信息`;
//                this.$http(wish_check,row.id).then(res => {
//                    this.editData = res;
//                }).catch(code => {
//                    this.$message({
//                        type: 'error',
//                        message: code.message||code,
//                    });
//                });
            },
            edit(row){//----------------------编辑
                this.$emit('edit',row);
//                this.editVisible = true;
//                this.action.name = 'edit';
//                this.action.label = '编辑';
//                this.titleName = `${this.action.label}账户：${row.account_name} 信息`;
//                this.$http(wish_edit,row.id).then(res => {
//                    this.editData = res;
//                }).catch(code => {
//                    this.$message({
//                        type: 'error',
//                        message: code.message||code,
//                    });
//                });
            },
            update_token(row){
                this.$http(api_refresh_token,row.id).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },      
            author(row){//---------------------------开启授权
                this.$emit('author',row);
            },
            //            添加成员事件
            add_member(row){
                this.$emit('add-member',row);
//                this.memberDialog = true;
//                this.accountName = row.account_name;
//                this.api_add_member({channel_id:3,account_id:row.id});
            },
//            add_update_wish(val){
//                this.$emit('add-update-wish',val);
//            },
//            update_wish(id,val){
//                this.$emit('update-wish',id,val)
//            },
            changStatus(row){//----------------------------更改启用
                let statusTitle = row.is_invalid?'停用':'启用';
                this.$confirm('您将'+statusTitle+row.account_name+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let params = {
                        id:row.id,
                        is_invalid:row.is_invalid
                    };
                    this.$http(wish_invalid,params).then(res=>{
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                    }).catch(code=>{
                        this.$message({
                            type: 'error',
                            message: code.message||code,
                        });
//                        this.$emit('update_wish')
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'+statusTitle
                    });
                    row.is_invalid=!row.is_invalid
                });
            },
            //            添加成员
            api_add_member(val){
                this.memberLoading = true;
                this.$http(api_add_member,val).then(res=>{
                    this.memberLoading = false;
                    if (res.length > 0) {
                        this.dataMember = res;
                        this.dataMember.forEach(row=>{
                            row.customer_id = row.customer_id===0?"":row.customer_id;
                            row.info.forEach(res=>{
                                res.seller_id = res.seller_id===0?"":res.seller_id;
                            })
                        });
                    } else {
                        this.dataMember = [];
                        let cur = {
                            id:0,
                            channel_id:3,
                            customer_id:"",
                            account_id:val.account_id,
                            info:[
                                {seller_id:"",warehouse_type:0}
                            ]
                        };
                        this.dataMember.push(cur);
                    }
                }).catch(code=>{
                    setTimeOut(()=>{
                        this.memberLoading = true;
                    },100);
                    console.log(code);
                })
            },
        },
        filters:{
            filterStatus(value){
                if (value === 0) {
                    return "失效"
                } else if (value === 1) {
                    return "有效"
                }
            },
            filterAuthor(val){
                if (val === 0) {
                    return "授权"
                } else if (val === 1) {
                    return "已授权"
                }
            },
            filterPercent(value){
                return value+"%"
            },
        },
        props:{
            wishData:{
                required:true,
                type:Object
            },
            loading:{
                required:true,
                type:Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            }
        },
        components:{
            authorize,
            edit,
            userManage:require('../user-manage.vue').default,
            addMember:require('../smt/add-member.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
        }
    }
</script>
