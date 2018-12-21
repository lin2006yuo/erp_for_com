<template>
    <div class="product-class-setting-data-table">
        <div class="head">
            <el-button size="mini" type="primary" @click.native="add">添加</el-button>
            <permission tag="requestButton" :route="apis.url_product_batch" :request="removes">批量删除</permission>
        </div>
        <el-table
                v-resize="{height:41}"
                :data="tableData"
                v-loading="loading" element-loading-text="玩命加载中..."
                highlight-current-row
                style="width: 100%"
                @selection-change="select_change"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="35">
            </el-table-column>
            <el-table-column inline-template label="分组名称">
                <div v-copy>
                    <ui-tip :content="row.name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="所属类别">
                <ui-tip :content="row.category" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="开发员" inline-template width="100">
                <ui-tip :content="row.developer" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="负责的子类" inline-template show-tooltip-when-overflow>
                <ui-tip :content="row.subclass" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="更新时间" inline-template width="150">
                <div>{{row.update_time | dateFliter}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template width="100">
                <div>
                    <permission tag="span" :route="apis.url_product_edit" class="operate" @click="edit_over(row)">编辑</permission>&nbsp;|&nbsp;<permission tag="span" :route="apis.url_product_del"class="operate " @click="deletes(row)">删除</permission>
                </div>
            </el-table-column>
        </el-table>
        <setting v-model="show" :devData="devData" :isEdit="isEdit" ref="setting" @add-list="add_list" @update-list="update_list"></setting>
    </div>
</template>
<style lang="stylus">
    .product-class-setting-data-table {
        .head {
            padding: 5px 0 5px 10px;
        }
    }
</style>
<script>
    import {
        api_product_look,
        api_product_edit,
        api_product_del,
        api_product_channel,
        api_product_account,
        api_product_batch,
        url_product_batch,
        url_product_del,
        url_product_edit
    } from "../../../api/product-class"
    export default{
        permission:{
          url_product_batch,
          url_product_del,
          url_product_edit
        },
        data(){
            return {
                selected: [],
                devData: {},
                show: false,
                isEdit: false,
                channel: [],
            }
        },
        mounted(){
            this.get_channel()
        },
        methods: {
            //编辑
            edit_over(row){
                this.$http(api_product_edit, row.id).then(res => {
                    this.devData = res;
                    this.show = true;
                    this.isEdit = true;
                    this.$refs.setting.title = `编辑分组: ${res.name} 信息`
                }).catch(code => {
                    console.log(code)
                })
            },
            add_list(data){
            	this.tableData.unshift(data);
            	this.$emit("change-add");
            },
            update_list(data){
            	let find = this.tableData.find( row=>{
            		return row.id === data.id;
                });
                if(!!find){
                    Object.assign(find,data);
                }
            },
            //删除
            deletes(row){
                this.$confirm(`您将删除${row.name}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_product_del, row.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        let index = this.tableData.indexOfFun(row,function (old,row) {
                            return old.id === row.id;
                        });
                        this.tableData.splice(index,1);
                        this.$emit('change-del')
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            removes(){
                if (this.selected.length === 0) {
                    this.$message({
                        message: '请选择一条数据',
                        type: 'warning',
                        duration: 0,
                    });
                    return false;
                }
                let removeData = this.selected.map(row => {
                    return row.name
                })
                let removeid = this.selected.map(row => {
                    return row.id
                })
                return this.$confirm(`您将删除${removeData.join(",")}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_product_batch, {data: removeid}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        let sum = 0;
                        this.selected.forEach(row=>{
                            let index=this.tableData.indexOfFun(old=>{
                                return old.id===row.id;
                            });
                            if(index!== undefined){
                                this.tableData.splice(index,1);
                                sum++;
                            }
                        });
                        this.$emit('change-del',sum);
                        this.selected = [];
                        return Promise.resolve()
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //改变
            select_change(sels){
                this.selected = sels;
            },
            //添加
            add(){
                this.show = true;
                this.isEdit = true;
                this.$refs.setting.title = "添加";
                this.devData = {
                    id: 0,
                    name: "",
                    company_id: '',
                    category_id: '',
                    developer_id: '',
                    channel_id: '',
                    subclass: [],
                    detail: []
                }
            },
            get_channel(){
                this.channel = [];
                this.$http(api_product_channel).then(res => {
                    this.channel = res;
                }).catch(code => {
                    console.log(code)
                })
            },
        },
        computed:{
            emptyText() {
                return this.firstLoading?'请查询数据':'暂无数据'
            },
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading:{
                required:true,
                type:Boolean
            }
        },
        filters: {
            dateFliter(val){
                return datef('YYYY-MM-dd HH:mm:ss', val)
            }
        },
        components: {
            setting: require('./setting.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
