<template>
    <page class="p-index-unit">
        <permission
                class="mb-xs mt-xs ml-sm"
                tag="addUnit"
                :route="apis.url_add"
                :form="form"
                @confirm="confirm"
                @add-unit="add_unit"
                v-model="addDialog"
        ></permission>
        <el-table class="scroll-bar"
                  v-resize="{height:41}"
                  :data="propertyData.lists"
                  highlight-current-row border
                  v-loading="isLoading"
                  element-loading-text="玩命加载中...">
            <el-table-column property="id" label="ID" width="150"align="center"></el-table-column>
            <el-table-column property="name" label="单位名称" width="300" align="center" row-key="name"></el-table-column>
            <el-table-column property="desc" label="单位描述"  align="center"></el-table-column>
            <el-table-column inline-template label="管理操作" width="200" inline-template align="center">
                <div>
                    <permission tag="span" :route="apis.url_edit" class="operate" @click="cur_modify(row.id)">修改</permission>
                    <permission tag="span" :route="apis.url_edit">|</permission>
                    <permission tag="span" :route="apis.url_delete" class="operate" @click="cur_delete(row.id)">删除</permission>
                </div>
            </el-table-column>
        </el-table>
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
        <edit-unit :form="editForm" v-model="editDialog" @edit-confirm="edit_confirm"></edit-unit>
    </page>
</template>
<style lang="stylus">
.p-index-unit{
    .el-table__body-wrapper{
        overflow-x: hidden;
    }
}
</style>
<script>
    import addUnit from './add-unit.vue';
    import editUnit from './edit-unit.vue';
    import {
        api_unit_data,
        api_add,api_delete,
        api_edit,api_update,
        url_add,
        url_edit,
        url_delete
    } from '../../../api/unit';
    export default{
        activated(){
            console.log("eeeeeee");
        },
        deactivated(){//当切换到其它页面时触发这个回调。
            console.log("走了 ");
        },
        permission:{
            url_add,
            url_edit,
            url_delete
        },
    	page:{
            devinfo:{
                frontEnd:'王月如',
                backEnd:'翟斌',
                createTime:'2016-11-8',
                updateTime:'2017-9-26'
            },
            beforeClose(){
                return true;
            }
        },
        refresh() {
            this.init();
        },
        data(){
            return {
                propertyData:{
                    page:1,
                    pageSize:50,
                    total:0,
                    lists:[]
                },
                form:{
                    name:"",
                    desc:""
                },
                editForm:{
                    id:0,
                    name:"",
                    desc:""
                },
                params:{},
                addDialog:false,
                editDialog:false,
                isLoading:true,
            }
        },
        created(){
            this.init();
        },
        methods:{
            init(){
                this.isLoading = true;
                let params={
                    page:this.propertyData.page,
                    pageSize:this.propertyData.pageSize
                }
                this.$http(api_unit_data,params).then(res=>{
                    this.propertyData.lists=res.data;
                    this.propertyData.total=res.count;
                    setTimeout(()=>{
                        this.isLoading = false;
                    },200);
                }).catch(code=> {
                    console.log(code);
                    this.isLoading = false;
                })
            },
//            ------------------------------------------ 修改
            cur_modify(id){
                console.log(`id ${id}`);
                this.$http(api_edit,id).then(res=>{
                    this.editForm.id=res.id;
                    this.editForm.name=res.name;
                    this.editForm.desc=res.desc;
                    this.editDialog=true;
                }).catch(code=>{
                    console.log(code)
                })
            },
//            ------------------------------------------ 更新
            edit_confirm(id,editParams){
                this.propertyData.lists.forEach(res=>{
                	if(res.id===id){
                		res.name = editParams.name;
                		res.desc = editParams.desc;
                    }
                })
            },
//            ------------------------------------------ 删除
            cur_delete(id){
                let name = "";
                this.propertyData.lists.map(res => {
                    if (res.id == id) {
                        name = res.name;
                    }
                    this.$confirm(`您将删除${name}，确认此操作吗?`, '提示', {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        this.propertyData.total--;
                        this.api_delete(id);
                    }).catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消"
                        })
                    });
                })
            },
//            ---------------------------------------- 打开 添加
            add_unit(){
                this.form={name:'',desc:''};
                this.addDialog=true;
            },
//            ----------------------------------------- 添加
            confirm(id,val){
            	this.$set(val,'id',id);
                this.propertyData.lists.unshift(val);
                this.propertyData.total++;
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
//            ----------------------------------------- 删除API
            api_delete(id){
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
                        message:code.message||code,
                    })
                })
            }
        },
        components: {
            addUnit,
            editUnit
        }
    }
</script>
