<template>
    <page class="p-args-index">
        <search-card @search="search" @enter='search' :params="listParams" :clears="clears">
            <label-buttons label="类型：" :buttons="handles" @select="select_handles"></label-buttons>
            <label>分组：</label>
            <ui-select v-sf.group_id v-model="listParams.group_id" placeholder="请选择" class="inline s-width-default" filterable clearable>
                <el-option
                        v-for="(group,index) in group"
                        :label="group.label"
                        :value="group.value"
                        :key="group.value">
                </el-option>
            </ui-select>
            <label class="ml-sm">状态：</label>
            <el-select v-sf.status v-model="listParams.status" placeholder="请选择"
                       class="inline s-width-small" clearable>
                <el-option
                        :key="item.value"
                        v-for="item in status"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <label class="ml-sm">标识：</label>
            <el-input  class="inline width-super mr-sm" placeholder="支持模糊查找..." v-sf.name v-model="listParams.name" @input="snText"></el-input>
            <!--<el-button type="primary"  class="inline ml-sm" size="mini" @click.native="search()">搜索</el-button>-->
            <!--<el-button class="inline  ml-sm" size="mini" @click.native="clear_search()">清空搜索</el-button>-->
        </search-card>
        <permission tag="request-button" :mintime='300' reqKey='sortKey' :route="apis.url_args_sort"
                    style="margin: 5px 0px 5px 10px;" @click="sort">排序</permission>
        <el-button type="primary" size="mini" @click="add_args">添加参数</el-button>
        <el-button type="primary" size="mini" @click="add_group">添加分组</el-button>

        <el-table
            v-resize="{height:41}"
            :data="tableData.tableList"
            border
            highlight-current-row
            v-loading="loading"
            element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column  inline-template label="排序" align="center" width="80">
                <ui-input v-model="row.sort" @change="change(row)" :class="row.isCheck?'addClass':''"></ui-input>
            </el-table-column>
            <el-table-column property="id" label="ID" align="center" width="80"></el-table-column>
            <el-table-column label="参数标识" inline-template>
                <div v-copy>
                    <ui-tip :content="row.name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="标题">
                <div>
                    <ui-tip :content="row.title" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="参数类型" width="100">
                <div>{{row.type|typeFilter}}</div>
            </el-table-column>
            <el-table-column inline-template label="所属分组" width="100">
                <div>{{row.group}}</div>
            </el-table-column>
            <el-table-column inline-template label="备注">
                <div>
                    <ui-tip :content="row.remark" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column  inline-template label="状态" width="80">
                <div>{{row.status|statusFilter}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template align="center" width="160">
                <div>
                    <span v-if="row.system===1">修改</span>
                    <permission tag="span" :route="apis.url_args_edit" class="operate" @click="edit(row)" v-else>修改</permission>
                    |
                    <div style="display:inline;" v-if="row.system===1" >
                        <span  v-if="row.status===1">禁用</span>
                        <span  v-else>启用</span>
                    </div>
                    <div style="display:inline;" v-else>
                        <permission tag="span" :route="apis.url_args_changeStatus" class="operate" @click="changeStatus(row)" v-if="row.status===1">禁用</permission>
                        <permission tag="span" :route="apis.url_args_changeStatus" class="operate"  @click="changeStatus(row)" v-else>启用</permission>
                    </div>
                    |
                    <span v-if="row.system===1">删除</span>
                    <permission tag="span" :route="apis.url_args_del" class="operate" @click="del(row)" v-else>删除</permission>
                </div>
            </el-table-column>
        </el-table>
        <add-args ref="argsData" v-model="argsBox" @edit-update="edit_update" @add-update="add_update" :args-form="argsForm" :mark-id="markId" :title-name="titleName"></add-args>
        <add-group v-model="groupBox" @submit="submit" :group-form="groupForm" :title-name="titleName" :mark-id="markId"></add-group>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=listParams.page
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=listParams.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=tableData.total>
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .p-args-index{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
    }
</style>
<script>
    import addArgs from './add-args.vue'
    import addGroup from './add-group.vue'
    import {args_list,args_edit} from '../../../../api/system'
   import {system_getGroups,args_changeStatus,args_del,args_sort,url_args_sort,url_args_edit,url_args_changeStatus,url_args_del} from '../../../../api/system'
   import uiInput  from "./ui-input.vue"
    export default{
    	  permission:{
          url_args_sort,
          url_args_edit,
          url_args_changeStatus,
          url_args_del
        },
        page:{},
        refresh(){
            this.listParams.group_id = "";
            this.listParams.status = "";
            this.listParams.name = "";
            this.init_status_btn();
        },
        data(){
            return {
                argsBox:false,
                groupBox:false,
                titleName:'',
                markId:0,//---标识id
                argsForm:{
                    lang_id:0,
                    group_id:'1',
                    title:'',
                    name:'',
                    type:'1',
                    data_type:'int',
                    choose_type:'',
                    setting:[
                      {
                        key:'',
                        value:'',
                        child:[]
                      }
                    ],
                    remark:'',
                    sort:0,
                    status:1
                },
                groupForm:{
                    title:'',
                    name:'',
                    sort:0,
                    status:1
                },
                listParams:{
                    page:1,
                    pageSize:50,
                    group_id:'',
                    status:'',
                    type:'',
                    name:'',
                },
                clears:{
                    page:1,
                    pageSize:50,
                    group_id:'',
                    status:'',
                    type:'',
                    name:'',
                },
                tableData:{
                    tableList:[],
                    total:0
                },
                loading:true,
                group:[],
                status:[
                    {value: '',label:'全部'},
                    {
                        value: 1,
                        label: '启用'
                    },
                    {
                        value: 0,
                        label: '禁用'
                    }
                ],
                sortId:[],
                handles:[
                    {
                        value: '',
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '参数'
                    },
                    {
                        value: 1,
                        label: '分组'
                    }
                ],
                firstLoading:true
            }
        },
        created(){
            this.init()
        },
        mounted(){
            this.$http(system_getGroups).then(res=>{
                this.group = Object.keys(res.groups).map(row=>{
                    return {label:res.groups[row],value:row};
                });
                this.group.unshift({label:'全部', value:''});
            }).catch(code=>{
                this.$message({message:code.message||code,type:'error'});
            })
        },
        methods: {
            init_status_btn(){
                let curBtn = this.handles;
                this.handles = [];
                this.$nextTick(()=>{
                    this.handles = curBtn;
                })
            },
            select_handles(val){
                this.listParams.type = this.handles[val].value;
                this.init();
            },
            snText(){
                this.listParams.name = this.listParams.name.replace(/\s*/g,'')
            },
            init(){
                this.tableData.tableList = [];
                this.loading = true;
                this.$http(args_list,this.listParams).then(res=>{
                    this.tableData.tableList = res.data;
                    this.tableData.tableList.forEach(data=>{
                        this.$set(data,'newSort',data.sort)
                    });
                    this.tableData.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            add_args(){
                this.argsBox = true;
                this.markId = 0;
                this.titleName = '添加参数';
                this.argsForm = {//-------清空
                    lang_id:0,
                    group_id:'1',
                    title:'',
                    name:'',
                    type:'1',
                    data_type:'int',
                    setting:[
                      {
                        key:'',
                        value:'',
                        child:[]
                      }
                    ],
                    choose_type:'',
                    remark:'',
                    sort:0,
                    status:1
                };
            },
            add_group(){
                this.groupBox = true;
                this.markId = 0;
                this.titleName = '添加分组';
                this.groupForm = {//------清空
                    title:'',
                    name:'',
                    sort:0,
                    status:1
                }
            },
            edit(data){
                this.markId = data.id;
                if (data.group_id === 0) {
                    this.groupBox = true;
                    this.$http(args_edit,data.id).then(res=>{
                        this.titleName = `修改分组：${res.title} 信息`;
                        this.groupForm.group_id = res.group_id+"";
                        this.groupForm.title = res.title;
                        this.groupForm.name = res.name;
                        this.groupForm.sort = res.sort;
                        this.groupForm.status = res.status;
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})
                    })
                }else{
                    this.$http(args_edit,data.id).then(res=>{
                        this.argsForm.lang_id = res.lang_id;
                        this.argsForm.group_id = res.group_id+"";
                        this.argsForm.title = res.title;
                        this.argsForm.name = res.name;
                        this.argsForm.type = res.type+"";
                        this.argsForm.data_type = res.data_type;
                        this.argsForm.choose_type = res.choose_type;
                        this.argsForm.setting =  res.choose_type;
                        this.argsForm.setting =  res.setting;
                        this.argsForm.remark = res.remark;
                        this.argsForm.sort = res.sort;
                        this.argsForm.status = res.status;
                        this.titleName = `修改参数：${res.title} 信息`;
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})
                    });
                        this.argsBox = true;
                }
            },
            sort(){
                this.sortId = [];
                let obj = {};
                this.tableData.tableList.forEach(data=>{
                    if (data.sort != data.newSort) {
                        obj[data.id] = data.sort
                        this.sortId.push(obj)
                    }
                })
                if (this.sortId.length === 0) {
                    this.$message({
                        message: '请修改排序项',
                        type: 'warning'
                    });
                    this.$reqKey('sortKey',false);
                    return false
                }
                let sortParams = {
                    sorts:obj
                }
                this.$http(args_sort,sortParams).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    this.init()
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                }).finally(()=>{
                    this.$reqKey('sortKey',false);
                })
            },
            change(val){
                console.log(val);
            },
            search(){
                this.init()
            },
            clear_search(){
                this.listParams.group_id = "";
                this.listParams.status = "";
                this.listParams.name = "";
            },
            changeStatus(data){
                let statusTitle = data.status == 0 ? '启用' : '禁用';
                this.$confirm('您将'+statusTitle+data.title+',确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let status = data.status == 0 ? 1 : 0;
                    let params = {
                        id:data.id,
                        status:status
                    };
                    this.loading = true;
                    this.$http(args_changeStatus,params).then(res=>{
                        this.$message({type: "success", message: res.message || res})
                        this.loading = false;
                        this.init()
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'+statusTitle
                    });
                });

            },
            del(data){
                this.$confirm('您将删除'+data.title+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(args_del,data.id).then(res=>{
                        this.$message({type: "success", message: res.message || res})
                        let i = this.tableData.tableList.indexOfFun(data,function (old,data) {
                            return old.id===data.id
                        });
                        this.tableData.tableList.splice(i,1)
                        this.$set(this.tableData,'total',this.tableData.total--)
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            handleSizeChange(val){
                this.listParams.pageSize = val;
                this.init()
            },
            handleCurrentChange(val){
                this.listParams.page = val;
                this.init()
            },
            submit(){
                this.init()
            },
            add_update(id,val){
            	let data = {
            		id:id,
                    sort:val.sort,
                    name:val.name,
                    title:val.title,
                    type:Number(val.type),
                    group:val.group,
                    remark:val.remark,
                    status:val.status,
                };
                this.tableData.tableList.unshift(data);
                this.tableData.total += 1;
            },
            edit_update(id,val){
                this.tableData.tableList.forEach(res=>{
                	if(res.id===id){
                        res.sort = val.sort;
                        res.name = val.name;
                        res.type = Number(val.type);
                        res.group = val.group;
                        res.remark = val.remark;
                        res.status = val.status;
                    }
                })
            }
        },
        filters: {
            statusFilter(val){
                if (val === 0) {
                    return '禁用'
                } else {
                    return '启用'
                }
            },
            typeFilter(val){
                switch (val) {
                    case 1:
                        return '单行文本';
                        break;
                    case 2:
                        return '多行文本';
                        break;
                    case 3:
                        return '数组';
                        break;
                }
            }
        },
        watch: {},
        computed: {
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props: {},
        components: {
            addArgs,
            addGroup,
            uiInput,
            labelButtons:require('../../../../components/label-all-buttons.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
