<template>
    <div class="c-data-table">
        <el-table
            class="scroll-bar" 
            :data="tableParams.list"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            @selection-change="selectionChange"
            @sort-change="sort_change"
            highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column label="简称" prop="code" sortable></el-table-column>
            <el-table-column label="1688账号" prop="account_name" sortable></el-table-column>
            <el-table-column label="会员身份" inline-template>
                <div>{{row.membership | filterShip}}</div>
            </el-table-column>
            <el-table-column label="1688状态" inline-template>
                <div :class="[row.enabled?'sucStatus':'loseStatus']">{{row.enabled | filerEnabled}}</div>
            </el-table-column>
            <el-table-column label="系统状态" inline-template>
                <permission tag="ElSwitch"
                            v-model="row.is_invalid"
                            onText="启用"
                            offText="停用"
                            @change="change_status(row,$event)"
                            :route="apis.url_set_states"></permission>
            </el-table-column>
            <el-table-column label="失效时间" inline-template sortable>
                <times :time="row.expiry_time"></times>
            </el-table-column>
            <el-table-column label="订单后缀" prop="order_prefix"></el-table-column>
            <el-table-column label="创建时间" inline-template>
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column label="更新时间" inline-template>
                <times :time="row.update_time"></times>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <permission tag="span"
                                class='operate'
                                @click="look(row)"
                                :route="apis.url_look_accountlist">查看</permission>
                    <permission tag="span"
                                :route="apis.url_look_accountlist">|</permission>
                    <permission tag="span"
                                class='operate'
                                @click="edit(row)"
                                :route="apis.url_update_accountlist">编辑</permission>
                    <permission tag="span"
                                :route="apis.url_update_accountlist">|</permission>
                    <permission class='operate'
                                tag="span"
                                :route="apis.url_get_token"
                                @click="author_code(row)">{{row.is_authorization | filterAuth}}</permission>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="tableParams.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="tableParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableParams.count">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .c-data-table{
        .sucStatus{
            color:#339907
        }
        .loseStatus{
            color:#ff0000;
        }
    }

</style>
<script>
    import {api_set_states} from '../../../../api/1688-accounts';
    import {url_set_states,url_look_accountlist,url_update_accountlist,url_get_token} from '../../../../api/1688-accounts';
    export default {
        permission:{
            url_set_states,
            url_look_accountlist,
            url_update_accountlist,
            url_get_token
        },
        data() {
            return {
            }
        },
        filters:{
            filterAuth(val){
                switch(Number(val)){
                    case 0:
                        return '未授权';
                    case 1:
                        return '已授权';
                }
            },
            filerEnabled(val){
                switch(Number(val)) {
                    case 0:
                        return '失效';
                        break;
                    case 1:
                        return '有效';
                        break;
                }
            },
            filterShip(val){
                switch(Number(val)){
                    case 1:
                        return '企业单位';
                        break;
                    case 2:
                        return '事业单位或社会团体';
                        break;
                    case 3:
                        return '个体经营';
                        break;
                    case 4:
                        return '个人';
                        break;
                }
            },
        },
        methods:{
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            handle_size_change(size){
                this.$emit('change-size',size);
            },
            handle_current_change(page){
                this.$emit('change-page',page);
            },
            change_status(row,val){
                this.$confirm('您将更改, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(val,'val');
                    let params = {
                        id:row.id,
                        is_invalid:val?1:0   // 1-启用 0-停用
                    };
                    this.$http(api_set_states,params).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                    }).catch(code=>{
                        this.$message({type:"error",message:res.message||res});
                    })
                }).catch(code => {
                    this.$message({
                        type: 'info',
                        message: `已取消删除!`
                    })
                    row.is_invalid = !row.is_invalid;
                })
            },
            look(row){
                this.$emit('look',row);
            },
            edit(row){
                this.$emit('edit',row);
            },
            author_code(row){
                this.$emit('author-code',row);
            },
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props:{
            tableParams:{
                required:true,
                type:Object
            },
            loading:{
                type:Boolean,
                default(){
                    return false
                }
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components: {
            uiTip:require('../../../../components/ui-tip.vue'),
        }
    }
</script>