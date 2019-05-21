<template>
    <page class="p-index-brand">
        <div class="mt-xs mb-xs ml-sm">
            <permission tag="ElButton" :route="apis.url_add" size="mini" @click.native="add_brand" type="primary">添加品牌</permission>
            <el-input placeholder="请输入品牌名称..." @keyup.enter.native="init"  v-model="search_brand" class="inline" style="margin:-3px 5px 0 5px"></el-input>
            <permission tag="requestButton" :route="apis.url_brand_data" size="mini" type="primary" :request="init">搜索</permission>
        </div>
        <el-table :data="propertyData.lists" @selection-change="selectionChange" highlight-current-row v-loading="loading" element-loading-text="玩命加载中..."  v-resize="{height:41}">
            <el-table-column inline-template label="品牌logo" align="center">
                <el-popover
                        v-if="row.logo"
                        placement="right"
                        width="150"
                        trigger="hover">
                    <img v-lazy="`http://${row.logo}`" width="150px" height="150px">
                    <span slot="reference">
                            <img v-lazy="`http://${row.logo}`" width="35" height="35" style="vertical-align: middle;">
                        </span>
                </el-popover>
            </el-table-column>
            <el-table-column property="name" label="品牌名称"align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="code" label="品牌code" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="site_url" label="品牌网址" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column property="description" label="品牌描述"  show-overflow-tooltip align="center"></el-table-column>
            <el-table-column property="handle" label="操作" inline-template align="center" width="250">
                <div>
                    <permission tag="span" :route="apis.url_edit" class="operate" @click="curCheck(row.id)">查看</permission>
                    &nbsp; <permission tag="span" :route="apis.url_edit">|&nbsp;</permission>
                    <permission tag="span" :route="apis.url_edit" class="operate" @click="cur_modify(row.id)">修改</permission>
                    &nbsp;<permission tag="span" :route="apis.url_edit">|&nbsp;</permission>
                    <permission tag="span" :route="apis.url_delete" class="operate" @click="cur_delete(row.id)">删除</permission>
                    <permission tag="span" :route="apis.url_delete">|&nbsp;</permission>
                    <span @click="browseGoods(row.id)">浏览商品</span>
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
        <add-brand @reload="reload" @update="update" v-model="add_dialog" :markId="markId" :brandForm="brandForm" :isEdit="isEdit" :titleName="titleName"></add-brand>
    </page>
</template>
<style lang="stylus">
    .p-index-brand{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
    }
</style>
<script>
    import addBrand from './add-brand.vue';
    import {
        api_brand_data,
        api_add,api_delete,
        api_edit,api_update,

        url_add,
        url_brand_data,
        url_edit,
        url_delete
    } from '../../../api/brand';
    export default{
        permission:{
            url_add,
            url_brand_data,
            url_edit,
            url_delete
        },
        page:{
            devinfo:{
                frontEnd:'张兵根',
                backEnd:'翟斌',
                createTime:'2016-11-7',
                updateTime:'2017-9-26'
            },
            beforeClose(){
                return true;
            }
        },
        refresh(){
            this.init();
        },
        created(){
            this.init();
        },
        data(){
            return {
                titleName:'',
                add_dialog:false,
                isEdit:false,
                markId:0,//--标示id
                brandForm:{
                    name:'',
                    code:'',
                    logo:'',
                    file:[],
                    site_url:'',
                    description:''
                },
                search_brand:'',
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
        methods:{
            add_brand(){//-----------添加
                this.titleName='添加商品品牌';
                this.markId=0;
                this.isEdit=true;
                this.brandForm={name:'', code:'',logo:'',site_url:'', description:''};//--清空
                this.add_dialog=true;
            },
            selectionChange(val){//---------tab选择项改变触发事件
                this.selected_list=val;
                console.log('修改选中项',val);
            },
            init(){//---------list接口
                this.search_brand=this.search_brand.trim();
                let params={
                    page:this.propertyData.page,
                    pageSize:this.propertyData.pageSize,
                    name:this.search_brand
                };
                this.propertyData.lists=[];
                this.loading=true;
                 this.$http(api_brand_data,params).then(res=>{
                    this.propertyData.lists = res.data;console.log(res.data);
                    this.propertyData.total=res.count;
                    this.loading=false;
                }).catch(code=>{
                    console.log(`code:${code}`);
                })
            },
            deleteAll(){//-----------删除多选
                if(this.selected_list.length==0){
                    this.$message({
                        showClose: true,
                        message: '请勾选需要删除的商品！',
                        type: 'warning'
                    });
                    return;
                }
                var select_id_arr=[]
                for(var i=0;i<this.selected_list.length;i++){
                    select_id_arr.push(this.selected_list[i].id);
                }
                console.log(select_id_arr.join(","))
                this.$confirm('此操作将永久删除该文件, 确认此操作吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete,select_id_arr.join(",")).then(res=>{
                        //console.log(select_id_arr);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.init();
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message||code,
                        })
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            curCheck(id){//--------------查看
                this.isEdit=false;
                this.add_dialog=true;
                this.$http(api_edit,id).then(res=>{
                    this.titleName=`查看品牌：${res.name} 信息`;
                    this.brandForm.name=res.name;
                    this.brandForm.code=res.code;
                    this.brandForm.logo=res.logo;
                    this.brandForm.site_url=res.site_url;
                    this.brandForm.description=res.description;
                    this.add_dialog=true;
                }).catch(code=>{
                    console.log(code)
                })
            },
//            ------------------------------------------ 删除
            cur_delete(id){console.log(id);
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
            browseGoods(id){ //TODO 这个没有接口 权限也没有加
                console.log('浏览id',id);
            },
//            ------------------------------------------ 修改
            cur_modify(id){
                this.markId = id;
                this.isEdit=true;
                this.add_dialog=true;
                this.$http(api_edit,id).then(res=>{
                    this.titleName=`修改品牌：${res.name} 信息`;
                    this.brandForm.name=res.name;
                    this.brandForm.code=res.code;
                    this.brandForm.logo=res.logo;
                    this.brandForm.site_url=res.site_url;
                    this.brandForm.description=res.description;
                }).catch(code=>{
                    console.log(code)
                })
            },
            /* ------------分页*/
            handleSizeChange(size){
                this.propertyData.pageSize=size;
                this.init();
            },
            handleCurrentChange(page){
                this.propertyData.page=page;
                this.init();
            },
            /*-----------分页end*/
            reload(id,val){
            	this.$set(val,'id',id);
            	this.propertyData.lists.unshift(val);
                this.propertyData.total++;
            },
            update(id,brandForm){
            	if(brandForm.file.length===0){
                    this.propertyData.lists.forEach(data=>{
                        if(data.id===id){
                            Object.assign(data,brandForm)
                        }
                    })
                }else{
                    this.$http(api_edit,id).then(res=>{
                        this.propertyData.lists.forEach(data=>{
                            if(data.id===id){
                                Object.assign(data,res)
                            }
                        })
                    }).catch(code=>{
                        console.log(code)
                    })
                }

            }
        },
        components: {
            addBrand,
            requestButton:require('@/global-components/request-button.vue').default,
        }
    }
</script>
