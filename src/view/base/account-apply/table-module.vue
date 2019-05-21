<template>
    <div>
        <el-table :data="tableData.list"
                  class="scroll-bar"
                  v-resize="{height:41}"
                  v-loading="loading"
                  highlight-current-row
                  @sort-change="$emit('sort',$event)"
                  element-loading-text="玩命加载中"
                  empty-text="暂无数据">
            <el-table-column label="NO."
                             width="50"
                             prop="id">
            </el-table-column>
            <el-table-column label="平台" prop="channel_txt">
            </el-table-column>
            <el-table-column label="站点" >
                <template slot-scope="scope">
                    <ui-tip :content="`${scope.row.site_code||'暂无站点'}`" :width="98"></ui-tip>
                </template>
            </el-table-column>
            <el-table-column label="账号全称" >
                <template slot-scope="scope">
                    <ui-tip :content="scope.row.account_name" :width="98"></ui-tip>
                </template>
            </el-table-column>
            <el-table-column label="账号简称">
                <template slot-scope="scope">
                    <ui-tip :content="scope.row.account_code" :width="98"></ui-tip>
                </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone">
            </el-table-column>
            <el-table-column label="邮箱" >
                <template slot-scope="scope">
                    <ui-tip :content="scope.row.email" :width="98"></ui-tip>
                </template>
            </el-table-column>
            <el-table-column label="公司名称" width="200">
                <template slot-scope="scope">
                    <ui-tip :content="scope.row.company_name" :width="98"></ui-tip>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status_txt" width="130">
            </el-table-column>
            <el-table-column label="注册人" prop="register_txt" width="100">
            </el-table-column>
            <el-table-column label="创建时间" sortable prop="create_time">
                <template slot-scope="scope">
                    <span>{{scope.row.create_time*1000|fdatetime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <span v-for="(item,index) in show_operate(scope.row)"
                          :key="item.value">
                        <span v-if="index!==0" class="ml-mini mr-mini">|</span>
                        <span @click="operates(scope.row,item)"
                              class="operate">{{item.label}}
                        </span>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="$emit('change-size',$event)"
                @current-change="$emit('change-page',$event)"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.count">
        </el-pagination>
        <page-dialog :title="title"
                     v-model="show"
                     width="80%">
            <log-info :form="logForm"></log-info>
            <el-row slot="footer" class="dialog-footer">
                <el-button size="mini" @click="show=false">关 闭</el-button>
            </el-row>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_operation_log} from '../../../api/account-apply'
    import logInfo from './log-info';
    export default {
        data(){
            return {
                operations:[
                    {
                        label:'查看',
                        value:1,
                        action(row){
                            this.$emit('look-edit',row,1);
                        }
                    },
                    {
                        label:'编辑',
                        value:2,
                        action(row){
                            this.$emit('look-edit',row,2);
                        }
                    },
                    {
                        label:'日志',
                        value:3,
                        action(row){
                            this.look_operation(row);
                        }
                    },
                ],
                title:'',
                show:false,
                logForm:{
                    log:[]
                }
            }
        },
        methods: {
            look_operation(row){
                this.logForm={};
                this.$http(api_get_operation_log,row.id).then(res=>{
                    this.title=`查看${row.account_name?row.account_name+'的':''}操作日志`;
                    this.$set(this.logForm,'log',res);
                    console.log(this.logForm,'this.logForm');
                    this.show=true;
                }).catch( error =>{
                    console.log(error);
                });
            },
            show_operate(row){
                return this.operations.filter(operate=>{
                    switch (operate.value){
                        case 1:
                            return true;
                        case 2:
                            let arr=['已作废','已推送/注册完成'];
                            return !arr.includes(row.status_txt);
                        case 3:
                            return true;
                    }
                })
            },
            operates(row,operate){
                operate.action.call(this,row,operate);
            }
        },
        props: {
            tableData:{
                type:Object,
                require:true
            },
            loading:{
                type:Boolean,
                require:true
            },
        },
        components: {
            logInfo
        },
    }
</script>
