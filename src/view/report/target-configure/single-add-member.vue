<template>
    <page-dialog v-model="dialog" title="添加成员"
                 @open="open_dialog"
                 size='large' :close-on-click-modal="false">
        <div class="mb-sm mt-sm">
            <el-select v-model="snType" class="inline width-xs" @change="chang_select">
                <el-option v-for="item in searchList"
                           :key="item.value"
                           :value="item.value"
                           :label="item.label"></el-option>
            </el-select>
            <div class="inline" v-if="isShow">
                <order-input class='inline width-super mr-sm' v-model="snText" @keydown="search_name"></order-input>
                <el-button class="inline" type="primary" size="mini" @click.native="search">搜索</el-button>
            </div>
            <el-select  class="inline"  v-else
                        default-first-option filterable clearable
                        v-model="snText"
                        @change="change_condition">
                <el-option v-for="item in condition"
                           :key="item.value"
                           :value="item.id"
                           :label="item.name"></el-option>
            </el-select>
            <el-button class="inline ml-xs" size="mini" @click.native="clear_search">清空搜索</el-button>
        </div>
        <el-card>
            <el-row>
                <ui-table
                        :has-data="tableData.lists.length>0"
                        v-model="checkAll"
                        :body-height="200"
                        :heads="[
                                    {isCheck:true,width:2,},
                                    {label:'用户名',width:30},
                                    {label:'姓名',width:20},
                                    {label:'部门',width:58},
                                ]"
                >
                    <tbody v-loading="loading" element-loading-text="玩命加载中......">
                    <template v-for="(item,index) in tableData.lists">
                        <tr :class="[clickData[index]?'active-color':'']" @click="addClass(index)">
                            <td><el-checkbox v-model="item.check"
                                             :disabled="item.isAdd"></el-checkbox></td>
                            <td>
                                <ui-tips :content="item.username"></ui-tips>
                            </td>
                            <td>
                                <ui-tips :content="item.realname"></ui-tips>
                            </td>
                            <td class="pri-td">
                                <span :title="item.department | filDepartment">{{item.department | filDepartment}}</span>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </ui-table>
                <el-pagination
                        @size-change="mem_size_change"
                        @current-change="mem_current_change"
                        :current-page="tableData.page"
                        :page-size="tableData.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="tableData.totalSize">
                </el-pagination>
            </el-row>
        </el-card>
        <div slot="footer">
            <el-button type="primary" size="mini"
                       @click.native="submit"
                       class="inline" >确定</el-button>
            <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_department_role,api_user_list } from '../../../api/role';
    export default {
        data() {
            return {
                snType:'username',
                snText:'',
                tableData:{
                    lists:[],
                    page:1,
                    pageSize:20,
                    totalSize:0
                },
                condition:[],
                searchList:[
                    {label:"用户名",value:"username"},
                    {label:"姓名",value:"realname"},
                    {label:"部门",value:"department_id"},
                ],
                loading:false,
                clickData:[],
                dialog:this.value,
            }
        },
        filters:{
            filDepartment(val){
                if(val===''){
                    return "-无-";
                }else{
                    return val;
                }
            }
        },
        mounted(){
//            for(let i=0;i<this.tableData.lists.length;i++){
//                this.clickData.push(false)
//            }
        },
        methods:{
            search_name(){
                this.init();
            },
            open_dialog(){
                this.init();
            },
            addClass(index){
                this.clickData = this.clickData.map(()=>{
                    return  false
                });
                this.clickData[index]=true
            },
            clear_search(){
                this.snType = 'username';
                this.snText = '';
                this.init();
            },
            params_init(){
                let params = {
                    page:this.tableData.page,
                    pageSize:this.tableData.pageSize,
                    snType:this.snType
                };
                if(this.snType==="department_id"){
                    params.snText = this.snText;
                }else{
                    let snText = this.snText.split('\n').filter(row=>!!row).map(row=>row.trim());
                    if(snText.length>1){
                        params.snText = snText
                    }else{
                        params.snText = this.snText.trim();
                    }
                }
                return params
            },
            init(){
                let params = this.params_init();
                this.tableData.lists = [];
                this.loading = true;
                this.$http(api_user_list,params).then(res=>{
                    res.data.map(row=>{
                        this.$set(row, 'check', false);
                    });
                    this.tableData.lists=res.data;
                    this.tableData.lists.forEach(row=>{
                        this.clickData.push(false)
                    });
                    this.tableData.totalSize=res.count;
                    this.loading = false;
                }).catch(code=>{
                    this.loading = false;
                    console.log(code);
                });
            },
            mem_size_change(size){
                this.tableData.pageSize = size;
                this.init();
            },
            mem_current_change(page){
                this.tableData.page = page;
                this.init();
            },
            change_condition(){
                this.init();
            },
            chang_select(selection){
                selection==="department_id"&& this.$http(api_department_role).then(res=>{
                    console.log(res.departmentList,'res.departmentList');
                    this.condition=res.departmentList
                });
            },
            search(){
                this.init();
            },
            submit(){
                let list = this.tableData.lists.filter(row=>!!row.check);
                this.dialog = false;
                this.$emit('submit',list);
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        computed:{
            isShow(){
                return (this.snType==="username"||this.snType==="realname")?true:false
            },
            checkAll: {
                get() {
                    if (this.tableData.lists.length > 0) {
                        return !this.tableData.lists.one(row => row.check === false);
                    } else {
                        return false;
                    }
                },
                set(val) {
                    this.tableData.lists.forEach(row => {
                        this.$set(row, 'check', val);
                    })
                }
            }
        },
        props:{
            value:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            uiTable:require('@/components/ui-table.vue').default,
            uiTips:require('@/components/ui-tips.vue').default,
            orderInput:require('@/components/order-input.vue').default,
        }
    }
</script>