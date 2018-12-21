<template>
    <page class="p-index-pack">
            <permission tag="ElButton"
                        class="mt-xs mb-xs ml-sm"
                        :route="apis.url_pack_add"
                        size="mini"
                        @click.native="add_pack"
                        type="primary">添加包装材料</permission>
            <el-table :data="propertyData"  border highlight-current-row v-loading="loading" v-resize="{height:41}" element-loading-text="玩命加载中...">
                <el-table-column property="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column property="title" label="包装名称" width="200" align="center"></el-table-column>
                <el-table-column inline-template label="包装类型" width="200" align="center">
                    <div>{{row.type|typeFilter}}</div>
                </el-table-column>
                <el-table-column inline-template label="成本（￥）"  width="200" align="center">
                    <div>{{row.cost_price|numFilter}}</div>
                </el-table-column>
                <el-table-column inline-template label="长x宽x高(cm)" align="center">
                    <div>
                        <span>{{row.depth}}</span>&nbsp;X
                        <span>{{row.width}}</span>&nbsp;X
                        <span>{{row.height}}</span>
                    </div>
                </el-table-column>
                <el-table-column property="handle" label="管理操作" inline-template align="center" width="200">
                    <div>
                        <permission tag="span" :route="apis.url_pack_edit" class="operate" @click="curModify(row.id)">修改</permission>
                        <permission tag="span" :route="apis.url_pack_edit">|</permission>
                        <permission tag="span" :route="apis.url_pack_del" class="operate" @click="curDelete(row)">删除</permission>
                    </div>
                </el-table-column>
            </el-table>
            <add-pack v-model="editDialog" :titleName="titleName" :packForm="packForm" :editId="editId" @confirm='confirm' @update="update"></add-pack>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=listData.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .p-index-pack{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
    }

</style>
<script>
    import addPack from './add-pack.vue';
    import {
        api_pack_data,
        pack_del,
        api_pack_edit,

        url_pack_add,
        url_pack_edit,
        url_pack_del
    } from '../../../api/pack';
    export default{
        permission:{
            url_pack_add,
            url_pack_edit,
            url_pack_del
        },
    	page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'谭斌',
                createTime:'2016-11-8',
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
                editDialog: false,
                propertyData: [],
                total: 0,
                listData: {
                    page: 1,
                    pageSize: 50
                },
                editId: 0,
                packForm:{
                    supplier:0,
                    title:'',
                    type:0,
                    currency:'CNY',
                    cost_price:'',
                    depth:'',
                    width:'',
                    height:'',
                    weight:'',
                    remark:''
                },
                titleName:'',
                loading:true
            }
        },
        created(){
            this.init();
        },
        methods: {
            init(){//------------list接口
                this.propertyData = [];
                this.loading = true;
                this.$http(api_pack_data, this.listData).then(res => {
                    this.propertyData = res.data;
                    this.total = res.count;
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                }).catch(code=> {
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            add_pack(){//-----------------添加
                this.editDialog = true;
                this.editId = 0;
                this.titleName = '添加包装材料';
                this.packForm = {
                    supplier:'',
                    title:'',
                    type:0,
                    currency:'CNY',
                    cost_price:'',
                    depth:'',
                    width:'',
                    height:'',
                    weight:'',
                    remark:''
                }
            },
            confirm(id,val){//---------------保存
                this.$set(val,'id',parseInt(id));
                this.propertyData.push(val);
                this.total++;
            },
            update(editId,data){//-------------编辑
                this.propertyData.forEach(res=>{
                	if(res.id === editId){
                		Object.assign(res,data);
                    }
                })
            },
            curModify(id){//---------------修改
                this.editDialog = true;
                this.editId = id;
                this.$http(api_pack_edit,id).then(res => {
                    this.titleName = `修改包装材料：${res.title}信息`;
                    this.packForm.supplier = res.supplier_id;
                    this.packForm.title = res.title;
                    this.packForm.type = res.type;
                    this.packForm.currency = res.currency_code;
                    this.packForm.cost_price = res.cost_price;
                    this.packForm.depth = res.depth;
                    this.packForm.width = res.width;
                    this.packForm.height = res.height;
                    this.packForm.weight = res.weight;
                    this.packForm.remark = res.remark;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            curDelete(row){
                this.$confirm('您将删除'+row.title+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(pack_del, row.id).then(res=> {
                        this.$message({
                            showClose: true,
                            type:"success",
                            message: res.message || res
                        });
                        let index = this.propertyData.findIndex(item=>{
                        	return item.id === row.id;
                        });
                        this.propertyData.splice(index,1);
                        this.total--;
                    }).catch(code=> {
                        this.$message({message:code.message||code,type:'error'});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            handleSizeChange(val){

                this.listData.pageSize = val;
                this.init()
            },
            handleCurrentChange(val){

                this.listData.page = val;
                this.init()
            }
        },
        filters: {
            numFilter(val){
                return  Number(val).toFixed(2)
            },
            typeFilter(val){
                return val === 0 ? '入库' : '出库'
            }

        },
        components: {
            addPack
        }
    }
</script>
