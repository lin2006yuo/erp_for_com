<template>
    <div class="c-data-table">
        <el-row class="mb-xs mt-xs">
            <el-button class="ml-sm" size="mini" type="primary" @click.native="add">添加</el-button>
            <permission tag="requestButton" :route="apis.url_delete_buyers_batch" :disabled="delete_show" :request="delete_all">批量删除</permission>
            <el-button class="ml-sm" size="mini" type="primary" @click.native="batch_import">批量导入</el-button>
        </el-row>
        <el-table class="mb-sm scroll-bar"
                  border
                  :data="tables.lists"
                  highlight-current-row
                  current-row-key="tabelId"
                  row-key="id"
                  v-resize="{height:41}"
                  @selection-change="(sels)=>{buyersListSelect=sels;}"
                  v-loading="isLoad"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="平台" inline-template width="100">
                <div>
                    <ui-tip :content="row.channel_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="账号简称" inline-template>
                <div>
                    <ui-tip :content="row.account_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="邮箱地址" inline-template>
                <div>
                    <ui-tip :content="row.email" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="名称" inline-template>
                <div>
                    <ui-tip :content="row.name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="买家ID" inline-template>
                <div>
                    <ui-tip :content="row.buyer_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="联系方式" inline-template width="140">
                <div>
                    <ui-tip :content="row.mobile" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="状态" inline-template width="60">
                <div>
                    <ui-tip :content="row.status | statusFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="创建时间" inline-template width="100">
                <div>
                    <times :time="row.create_time"></times>
                </div>
            </el-table-column>
            <el-table-column label="更新时间" inline-template width="100">
                <div>
                    <times :time="row.update_time"></times>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template width="170">
                <div>
                    <span class="operate" @click="update(row)">修改</span>&nbsp;|&nbsp;
                    <span class="operate" @click="update_address(row)">地址管理</span>
                    <permission tag="span" :route="apis.url_delete_buyers">&nbsp;|&nbsp;</permission>
                    <permission tag="span" :route="apis.url_delete_buyers" class="operate" @click="remove(row)">删除</permission>
                </div>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_delete_buyers,api_delete_buyers_batch,
        url_delete_buyers,url_delete_buyers_batch} from '../../../api/buyer';
    export default{
        permission:{
            url_delete_buyers,
            url_delete_buyers_batch
        },
        page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'张文宇',
                createTime:'2017-8-5',
                updateTime:'2017-8-22'
            }
        },
        data(){
            return{
                buyersListSelect:[],
                tabelId:''
            }
        },
        methods:{
            add(val){
                this.$emit("add-list",val);
            },
            update(val){
                this.$emit("update-list",val);
            },
            update_address(val){
                this.$emit("update-address",val);
            },
            batch_import(){//批量导入
                this.$emit('batch-import',this.buyersListSelect)
            },
            delete_all(){
                return this.$confirm('您将批量删除买家信息, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let idData = [];
                    this.buyersListSelect.forEach(row=>{
                        idData.push(row.id);
                        let index = this.tables.lists.indexOfFun(data=>data.id===row.id)
                        this.tables.lists.splice(index,1);
                        this.$emit('update-delete');
                    })
                    this.$http(api_delete_buyers_batch,{ids:idData}).then(res=>{
                        this.$message({type:'success',message:`删除成功!`});
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                }).catch(code=>{
                    this.$message({
                        type:'info',
                        message:"已取消删除"
                    })
                })
            },
            remove(row){
                this.$confirm('您将删除此信息, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_buyers,row.id).then(res=>{
                        this.$message({message:res.message||res, type:'success'});
                        let index = this.tables.lists.indexOfFun(data=>data.id===row.id)
                        this.tables.lists.splice(index,1);
                        this.$emit('update-delete');
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                }).catch(code=>{
                    this.$message({
                        type:'info',
                        message:"已取消删除"
                    })
                })
            },

        },
        filters:{
            statusFilter(val){
                switch (val){
                    case 0:
                        return `正常`;
                        break;
                    case 1:
                        return `异常`;
                        break;
                }
            },
            updateTimeFilter(val){
                return  datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        computed:{
            delete_show(){
                if(this.buyersListSelect.length>0){
                    return false;
                }else{
                    return true;
                }
            },
            emptyText() {
                return this.firstLoading?'请查询数据':'暂无数据'
            }
        },
        props:{
            tables:{
                required:true,
                type:Object
            },
            isLoad:{
                required:true,
                type:Boolean
            },
            firstLoading:{
                required:true,
                type:Boolean
            }
        },
        components:{
            uiTip:require('../../../components/ui-tip.vue').default,
            requestButton:require('../../../global-components/request-button').default

        }
    }
</script>
