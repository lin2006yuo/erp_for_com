<template>
    <el-row class="p-index">
        <div class="card" >
            <el-button class="ml-sm" size="mini" @click.native="add_qc" type="primary" style="margin-bottom:5px">添加质检</el-button>
            <el-table :data="propertyData.lists" border highlight-current-row v-loading="loading" element-loading-text="玩命加载中...">
                <el-table-column property="id" label="ID" width="100"align="center"></el-table-column>
                <el-table-column property="name" label="质检名称" width="200"align="center" show-overflow-tooltip></el-table-column>
                <el-table-column property="content" label="质检内容" width="200" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column   label="类型" width="400" align="center"   inline-template>
                        <span>{{row.type|typeFilter}}</span>
                </el-table-column>
                <el-table-column property="sort" label="排序" width="100" align="center"></el-table-column>
                <el-table-column inline-template label="管理操作" inline-template align="center">
                    <div>
                        <span class="operate" @click="cur_modify(row.id)">修改</span>
                        |
                        <span class="operate" @click="cur_delete(row.id)">删除</span>
                    </div>
                </el-table-column>
            </el-table>

            <add-qc  @reload="reload" v-model="add_dialog" :markId="markId" :qcForm="qcForm" :isEdit="isEdit" :titleName="titleName"></add-qc>
        </div>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="propertyData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="propertyData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="propertyData.total">
        </el-pagination>
    </el-row>
</template>
<style lang="stylus">
</style>
<script>
    import addQc from './add-qc.vue';
    import {api_qc_data,api_add,api_delete,api_edit,api_update} from '../../../api/qc';

    export default{
    	  page:{},
        data(){
            return {
                titleName:'',
                add_dialog:false,
                isEdit:false,
                markId:0,//--标示id
                qcForm:{
                    name:'',
                    type:2,
                    content:'',
                    sort:''
                },
                search_qc:'',
                propertyData:{
                    page:1,
                    pageSize:50,
                    total:0,
                    lists:[]
                },
                selected_list:[],
                loading:true
            }
        },
        created(){
            this.init();
        },
        methods:{
            add_qc(){//-----------添加
                this.titleName='添加质检';
                this.markId=0;
                this.isEdit=true;
                this.qcForm={name:'', type:'',content:'', sort:''};//--清空
                this.add_dialog=true;
            },
            init(){
                let params={
                    page:this.propertyData.page,
                    pageSize:this.propertyData.pageSize
                }
                this.$http(api_qc_data,params).then(res=>{
                    this.propertyData.lists=res.data;//console.log(res.data);
                    this.propertyData.total=res.count;
                    this.loading=false;
                }).catch(code=> {
                    console.log(code);
                })
            },
//            ------------------------------------------ 修改
           cur_modify(id){
                this.titleName='修改商品质检';
                this.markId = id;
                this.isEdit=true;
                this.add_dialog=true;
                this.$http(api_edit,id).then(res=>{
                    this.qcForm.name=res.name;
                    this.qcForm.type=res.type;
                    this.qcForm.content=res.content;
                    this.qcForm.sort=res.sort;
                }).catch(code=>{
                    console.log(code)
                })
            },
//            ------------------------------------------ 更新

//            ------------------------------------------ 删除
            cur_delete(id){
                let name="";
                this.propertyData.lists.map(res=>{
                    if(res.id==id){
                        name=res.name;
                    }
                    this.$confirm(`您将删除${name}，确认此操作吗?`,'提示',{
                        confirmButtonText:"确定",
                        cancelButtonText:"取消",
                        type:"warning"
                    }).then(()=>{
                        this.$http(api_delete,id).then(res=>{
                            this.$message({
                                type:"success",
                                message:res.message
                            });
                            let index = this.propertyData.lists.indexOfFun(id,function (old, id) {
                                return old.id === id
                            });
                            this.propertyData.lists.splice(index, 1);
                        }).catch(code=>{
                            this.$message({
                                type:"error",
                                message:code,
                            })
                        })
                    }).catch(()=>{
                        this.$message({
                            type:"info",
                            message:"已取消"
                        })
                    })
                });
            },
//            ---------------------------------------- 打开 添加
//            ----------------------------------------- 添加
            confirm(){
                this.params={
                    name:this.form.name,
                    desc:this.form.desc
                };
                this.$http(api_add,this.params).then(res=>{
                    this.$message({
                        type:"success",
                        message:`${res.message}`
                    });
                    this.addDialog=false;
                    this.params.id=res.id;
                    this.propertyData.lists.push(this.params);
                    this.init();
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:`${code}`
                    });
                        return
                })
            },
//            ----------------------------------------- 分页
            handleSizeChange(size){
                this.propertyData.pageSize=size;
                this.init();
            },
            handleCurrentChange(page){
                this.propertyData.page=page;
                this.init();
            },
//            --------------
            reload(){this.init();}
        },
        filters:{
          typeFilter(val){
             switch (val){
                 case  0:
                     return "单选";
                 break;
                 case 1 :
                     return "多选";
                 break;
                 case 2 :
                     return "输入框"
                 break;
             }
          }
        },
        components: {
            addQc,
        }
    }
</script>
