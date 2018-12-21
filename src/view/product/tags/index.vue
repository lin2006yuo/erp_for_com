<template>
    <page class="p-index">
        <permission
                class="ml-sm mt-xs mb-xs"
                tag="addTag"
                :route="apis.url_add"
                :form="form"
                @confirm="confirm"
                @add-tag="add_tag"
                v-model="addDialog"
        ></permission>
        <el-table
                class="scroll-bar"
                v-resize="{height:41}"
                :data="propertyData.lists"
                border
                highlight-current-row
                v-loading="loading"
                element-loading-text="玩命加载中...">
            <el-table-column property="id" label="ID" width="50"align="center"></el-table-column>
            <el-table-column property="name" label="标签名称"align="center"></el-table-column>
            <el-table-column property="num" label="正在使用数量 （商品数）" align="center"></el-table-column>
            <el-table-column property="description" label="标签描述" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column  label="添加时间" align="center" inline-template>
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column property="creater" label="创建人"align="center"></el-table-column>
            <el-table-column label="更新时间" align="center"  inline-template>
                <times :time="row.update_time"></times>
            </el-table-column>
            <el-table-column property="updater" label="更新人" align="center"></el-table-column>
            <el-table-column inline-template label="管理操作" inline-template align="center">
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
        <edit-tag
                :form="editForm"
                v-model="editDialog"
                @edit-confirm="edit_confirm"
        ></edit-tag>
    </page>
</template>
<style lang="stylus" scoped>
</style>
<script>
    import addTag from './add-tag.vue';
    import editTag from './edit-tag.vue';
    import { mapGetters } from 'vuex'
    import {
        api_tag_data,
        api_add,api_delete,
        api_edit,

        url_add,
        url_edit,
        url_delete
    } from '../../../api/tags';
    export default{
        permission:{
            url_add,
            url_edit,
            url_delete
        },
    	page:{
            devinfo:{
                frontEnd:'张兵根',
                backEnd:'翟斌',
                createTime:'2016-11-26',
                updateTime:'2017-9-26'
            },
            beforeClose(){
                return true;
            }
        },
        refresh(){
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
                    description:""
                },
                params:{},
                addDialog:false,
                editDialog:false,
                loading:true
            }
        },
        created(){
            this.init();
        },
        methods:{
            init(){
                this.loading = true;
                let params={
                    page:this.propertyData.page,
                    pageSize:this.propertyData.pageSize
                }
                this.propertyData.lists=[];
                this.$http(api_tag_data,params).then(res=>{
                    this.propertyData.lists=res.data;//console.log(res.data);
                    this.propertyData.total=res.count;
                    this.loading = false;
                }).catch(code=> {
                    console.log(code);
                })
            },
//            ------------------------------------------ 修改
            cur_modify(id){
                this.$http(api_edit,id).then(res=>{
                    this.editForm = res;
                    this.editDialog=true;
                }).catch(code=>{
                    console.log(code)
                })
            },
//            ------------------------------------------ 更新
            edit_confirm(id,editParams){
                let timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                let find = this.propertyData.lists.find(row=>{
                	return row.id===id
                });
                if(!!find){
                	find.description = editParams.desc;
                    find.update_time = timestamp;
                    find.updater = this.currentUser.realname;
                    Object.assign(find,editParams)
                }
            },
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
                            this.propertyData.total--;
                        }).catch(code=>{
                            this.$message({
                                type:"error",
                                message:code.message||code,
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
            add_tag(){
                this.form={name:'',desc:''};
                this.addDialog=true;
            },
//            ----------------------------------------- 添加
            confirm(id,val){
                let timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
            	let data = {
            		id:parseInt(id),
            		name:val.name,
                    create_time:timestamp,
                    description:val.desc,
                    creater: this.currentUser.realname,
                };
                this.propertyData.lists.push(data);
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
//            --------------
        },
        computed:{
            ...mapGetters({currentUser:'user/info'})
        },
        components: {
            addTag,
            editTag
        }
    }
</script>
