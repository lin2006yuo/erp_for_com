<template>
    <page class="p-index-reply">
        <search ref="search" :searchData="searchData" @reflash="reflash" @change-click="change_click" @clear="clear"></search>
        <el-row class="ml-sm mb-xs mt-xs">
            <permission tag="ElButton" :route="apis.url_add_template" size="mini" @click="add_" type="primary" class="inline">添加</permission>
            <permission tag="ElButton" :route="apis.url_all_del" size="mini" @click="deletes" type="primary" class="inline ml-sm">删除</permission>
        </el-row>
        <el-table
            :data="tableData"
            border
            v-loading="loading"
            element-loading-text="玩命加载中..."
            highlight-current-row
            style="width: 100%"
            v-resize="{height:41}"
            @selection-change="selection_change">
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
            <el-table-column
                label="模板编号"
                width="200"
                inline-template>
                <div>
                    <ui-tip :content="row.template_no" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                label="模板名称"
                width="200"
                inline-template>
                <div>
                    <ui-tip :content="row.template_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                label="备注"
                width="150"
                inline-template>
                <div>
                    <ui-tip :content="row.remark" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                label="模板类型"
                width="150"
                inline-template>
                <div>
                    <ui-tip :content="row.template_type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                label="模板分组"
                width="150"
                inline-template>
                <div>
                    <ui-tip :content="row.group_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                label="模板内容"
                inline-template>
                <div>
                    <ui-tip :content="row.content" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100"
                inline-template
            >
                <div>
                    <permission tag="span" :route="apis.url_edit_reply" class="operate" @click="edit(row)">编辑</permission>
                    <permission tag="span" :route="apis.url_edit_reply">&nbsp;|&nbsp;</permission>
                    <permission tag="span" :route="apis.url_del_reply" class="operate" @click="del(row)">删除</permission>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100,200,500]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <page-dialog v-model="addVisable" title="添加模板" :close-on-click-modal="false">
            <label class="ml-lg">模板类型：</label>
            <el-select v-model="group_id" placeholder="请选择" class="inline">
                <el-option
                    :key="item.value"
                    v-for="item in handles"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="confirm">确认</el-button>
                <el-button size="mini" @click.native="addVisable = false">关闭</el-button>
            </div>
        </page-dialog>
        <reply v-model="replyVisable" :form="form" :change-no="changeNo" ref="reply" @reflash="init" @change-data="change_data"></reply>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_reply_types,api_reply_list,api_edit_reply,api_del_reply,api_all_del} from "../../../api/reply-template"
    import {url_add_template,url_all_del,url_edit_reply,url_del_reply} from '../../../api/reply-template'
    export default{
        permission:{
            url_add_template,
            url_all_del,
            url_edit_reply,
            url_del_reply
        },
        page:{},
        refresh(){
            this.init();
        },
        data(){
            return{
                total:0,
                loading:true,
                searchData:{
                    page:1,
                    pageSize:50,
                    template_type:1,
                    channel_id:1,
                    group_id:"",
                    search_key:"template_no",
                    search_val:""
                },
                replyVisable:false,
                addVisable:false,
                tableData:[],
                handles:[],
                group_id:"",
                replyId:"",
                isEdit:false,
                form:{},
                selects:[],
                changeNo:false,
                new_emplate_type:"",
                new_channel_id:"",
            }
        },
        created(){},
        mounted(){
            this.get_types();
            this.init()
        },
        computed:{},
        methods:{
            change_click(val){
                this.new_emplate_type = val.template_type;
                this.new_channel_id = val.channel_id;
            },
            change_data(val,group){
                let find = this.tableData.find( row =>{
                	return row.id === val.id
                });
                this.$set(val,"emplate_type_id",val.template_type);
                this.$set(val,"template_type",this.handles.find(row=>{
                    return row.value === val.template_type
                }).label);
                val.group_name = group;
                if(!!find){
                    if(this.new_channel_id===val.channel_id){
                        Object.assign(find,val)
                    }else{
                    	let index = this.tableData.findIndex(x=> {
                    	    return x === find;
                    	});
                    	if(index!==undefined){
                            this.tableData.splice(index,1);
                            this.total-=1;
                        }
                    }
                }else{
                	if(this.new_emplate_type===val.emplate_type_id && this.new_channel_id===val.channel_id){
                        this.tableData.push(val)
                        this.total++;
                    }
                }
            },
            init(){
                this.loading=true;
                this.$http(api_reply_list,this.searchData).then(res=>{
                    this.tableData=res.data;
                    this.total=res.count;
                    this.loading=false;
                }).catch(code=>{
                    console.log(code)
                })
            },
            add_(){
                this.addVisable=true;
                this.changeNo = false;
                this.group_id="";
            },
            deletes(){
                if(this.selects.length===0){
                    this.$message({type:"warning",message:'请选择要删除的数据'})
                    return
                }
                let ids=this.selects.map(row=>{
                    return row.id
                });
                let name=this.selects.map(row=>{
                    return row.template_no
                });
                this.$confirm(`您将删除模板编号 ${name.join(",")}，确认此操作吗？'`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_all_del,{ids:ids.join(",")}).then(res=> {
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                        this.opreate_del(name);
                        return Promise.resolve();
                    }).catch(code=> {
                        this.$message({message:code.message||code,type:'error'});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            selection_change(val){
                this.selects=val;
            },
            edit(row){
                return this.$http(api_edit_reply,row.id).then(res=>{
                    this.$set(this,"form",res);
                    this.replyVisable=true;
                    this.$refs.reply.isAdd=false;
                    let data={
                        template_type:this.form.template_type,
                        channel_id:this.form.channel_id,
                    };
                    this.$refs.reply.get_team(data);
                    this.$refs.reply.get_field(data);
                    this.changeNo = true;
                    if(this.form.template_type===1){
                        this.$refs.reply.title=`编辑回复模板: ${row.template_name} 信息`
                    }else {
                        this.$refs.reply.title=`编辑评价模板: ${row.template_name} 信息`
                    }
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            del(row){
                this.$confirm(`您将删除模板号${row.template_no}，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_del_reply,row.id).then(res=> {
                        this.$message({
                            type:'success',
                            message: res.message||res
                        });
                        this.opreate_del(row);
                        return Promise.resolve();
                    }).catch(code=> {
                        this.$message({message:code.message||code,type:'error'});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            opreate_del(datas){
                if(datas instanceof Array){
                    datas.forEach(row=>{
                        let index=this.tableData.indexOfFun( old => {
                            return old.template_no===row
                        });
                        this.tableData.splice(index,1)
                        this.total-=1;
                    })
                } else if(datas instanceof Object){
                    let i = this.tableData.indexOfFun( old =>{
                        return old.template_no===datas.template_no
                    });
                    this.tableData.splice(i,1)
                    this.total-=1;
                }
            },
            size_change(val){
                this.searchData.pageSize=val;
                this.init()
            },
            current_change(val){
                this.searchData.page=val;
                this.init()
            },
            //获取模板类型
            get_types(){
                this.handles=[];
                this.$http(api_reply_types).then(res=>{
                    this.handles = res.data.map(row=>{
                        return  {
                            label:row.name,
                            value:row.id,
                        }
                    });
                }).catch(code=>{
                    console.log(code)
                })
            },
            confirm(){
                if(this.group_id){
                    this.form={
                        channel_id:"",
                        template_no:"",
                        template_name:"",
                        group_id:"",
                        remark:"",
                        content:"",
                    };
                    this.addVisable=false;
                    this.replyVisable=true;
                    this.form.template_type=this.group_id;
                    this.$refs.reply.isAdd=true;
                    if(this.group_id === 1){
                        this.$refs.reply.title="添加回复模板"
                    }else {
                        this.$refs.reply.title="添加评价模板"
                    }
                }
            },
            reflash(){
                this.init();
            },
            clear(){
                this.searchData.group_id="";
                this.searchData.search_key="template_no";
                this.searchData.search_val="";
                this.searchData.page=1;
                this.searchData.pageSize=50;
                this.init();
            }
        },
        filters:{
        },
        watch:{
        },
        props:{
        },
        components:{
            search:require('./search.vue').default,
            pageDialog:require("../../../components/page-dialog.vue").default,
            reply:require("./reply.vue").default,
            uiTip:require('../../../components/ui-tip.vue').default,
            searchCard:require("../../../components/search-card.vue").default
        }
    }
</script>
