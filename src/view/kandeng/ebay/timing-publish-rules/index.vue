<template>
    <page class="p-index">
        <search-card @search="search" @enter="search" :params="params" :clears="clears">
            <label-item label="定时规则名称：" class="mr-sm">
                <el-input placeholder="请输入搜索内容..." v-sf.name  v-model="params.name" class="width-super"></el-input>
            </label-item>
        </search-card>
        <el-row class="mt-xs mb-xs ml-sm">
            <el-button type="primary" size="mini" @click.native="add">添加</el-button>
            <permission tag="ElButton" :route="apis.url_remove_timing_rule_list"
                        type="primary"
                        size="mini"
                        :disabled="delDisable"
                        @click="batch_del">删除</permission>
        </el-row>
        <el-table :data="tableData" v-resize="{height:41}" v-loading="loading"
                  @selection-change="handleSelectionChange"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="定时规则名称" prop="timing_rule_name" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="已在刊登队列中" prop="queue_count">
            </el-table-column>
            <el-table-column label="执行范本" prop="draft_count">
            </el-table-column>
            <el-table-column label="描述" prop="detail" width="720" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="备注" prop="remark" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="100" inline-template>
                <trends-select  class="inline" @trigger="operate(row,$event)" :selects="operatesList" type="primary"></trends-select>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[1,20, 50, 100, 200,500]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <add-rule v-model="addRuleShow" @add-rule="add_rule" :title="title"
                  @finished-add="finished_add"
                  :formData="formData" ref="addRule"></add-rule>
        <choose-model v-model="chooseModelShow"
                      :rulesData="rulesData"
                      @finished-add="finished_add"
        ></choose-model>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {operateList} from './action';//------操作按钮引入
    import {api_get_timing_rule_list,api_common_modeList,api_remove_timing_rule_list,url_update_listing,url_remove_timing_rule_list} from '../../../../api/ebay-kandeng-public-module'

    export default{
        permission: {
            url_update_listing,url_remove_timing_rule_list
        },
        page:{},
        refresh(){
            this.params.name = "";
            this.init();
        },
        data(){
            return {
                tableData:[],
                page:1,
                size:50,
                total:0,
                addRuleShow:false,
                chooseModelShow:false,
                modelList:[],
                loading:false,
                firstLoading: true,
                operateList:operateList,
                rulesData:"",
                multipleSelection:[],
                formData:{
                    timing_rule_name:"",
                    timing_fre:"",
                    start_date:"",
                    end_date:"",
                    count:"",
                    start_interval:"",
                    count_interval:"",
                    total_count:"",
                    name:"",
                    validity:"",
                    start_count:"",
                    count_val:"",
                    start_validity:"",
                    end_validity:"",
                    remark:"",
                    detail:"",
                    draft_ids:""
                },
                title:"",
                params:{
                   name:"",
                },
                clears:{}
            }
        },
        created(){
            this.init();
        },
        methods:{
            init(){
                this.loading = true;
                let data = {
                    ids:"",
                    name:this.params.name,
                    page:this.page,
                    size:this.size,
                };
                this.$http(api_get_timing_rule_list,data).then(res=>{
                    this.tableData = res.data.rows;
                    this.total = res.data.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
            getModelList(){
                this.$http(api_common_modeList,{model_type:"cate"}).then(res=>{
                    this.modelList = res.data.map((item)=>{
                        return {
                            label:item.model_name,
                            value:item.id,
                        }
                    });
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
            search(){
                this.init();
                this.getModelList();
            },
            add(){
                this.title="添加定时规则";
                this.formData = {
                    timing_rule_name:"",
                    timing_fre:"",
                    start_date:"",
                    end_date:"",
                    count:"",
                    start_interval:"",
                    count_interval:"",
                    total_count:"",
                    name:"",
                    validity:"",
                    start_count:"",
                    count_val:"",
                    start_validity:"",
                    end_validity:"",
                    remark:"",
                    detail:"",
                    draft_ids:""
                };
                this.$refs.addRule.isEdit = false;
                this.addRuleShow = true;
            },
            edit(val){
                this.formData=window.clone(val);
                this.title=`编辑定时规则：${val.timing_rule_name} 信息`;
                this.$refs.addRule.isEdit = true;
                this.addRuleShow = true;
            },
            del(data,arr){
                this.$confirm(`您将要对已选Listing执行删除, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_remove_timing_rule_list,{ids:data}).then(res=>{
                        this.$message({
                            type:"success",
                            message: res.message || res,
                        });
                        if(arr instanceof Array){
                            arr.forEach(row=>{
                                let index=this.tableData.indexOfFun(row,function (old,row) {
                                    return old.id===row.id;
                                });
                                this.tableData.splice(index,1);
                                this.total--;
                            })
                        } else if(arr instanceof Object){
                            let i = this.tableData.indexOfFun(arr,function (old,arr) {
                                return old.id===arr.id;
                            });
                            this.tableData.splice(i,1);
                            this.total--;
                        }
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    });
                });
            },
            batch_del(){
                if(!this.multipleSelection.length){
                    this.$message({
                        type: 'warning',
                        message: '未选择需要操作的数据',
                    });
                    return ;
                }else{
                    let ids = this.multipleSelection.map(x=> x.id).join(",");
                    this.del(ids,this.multipleSelection);
                }
            },
            add_rule(val){
                this.rulesData = val;
                this.chooseModelShow = true;
            },
            finished_add(val,data){
                val.id = parseInt(data.id);
                val.queue_count = data.queue_count;
                val.draft_count = data.draft_count;
                let index = this.tableData.find(row=> {
                	return row.id === val.id;
                });
                if(index instanceof Object){
                    Object.assign(index,val);
                }else{
                    this.tableData.push(val);
                    this.total++;
                }
            },
            operate(data,options){
                options.action.call(this,data);
            },
            handleSizeChange(size){
                this.size=size;
                this.init();
            },
            handleCurrentChange(page){
                this.page=page;
                this.init();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
        },
        computed:{
            operatesList(){
                return operateList.filter(row=>{
                    return this.$hasPermission(row.api);
                })
            },
            delDisable(){
            	if(this.tableData.length){
            		return false;
                }else{
            		return true;
                }
            },
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        components: {
            labelItem:require("../../../../components/label-item.vue").default,
            searchCard:require('../../../../components/search-card.vue').default,
            addRule:require("./add-rule.vue").default,
            chooseModel:require("./choose-model.vue").default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
        }
    }
</script>
