<template>
        <page class="p-index">
            <card-search
                ref="search"
                :searchData="searchData"
                @search="search"></card-search>
            <el-row class="mt-xs">
                <permission tag="ElButton"
                            :route="apis.url_add_warehouse_cargo_class"
                            type="primary"
                            class="mb-xs ml-sm"
                            @click="add"
                            size="mini">添加货位类型
                </permission>
            </el-row>
            <data-table
                :data-table="dataTable"
                @look-data="look_data"
                @edit-data="edit_data"
                @delete-data="delete_data"
                :loading="loading"
                :status="this.searchData.status"
            ></data-table>
            <div class="t-right">
                <el-pagination
                    class="page-fixed"
                    @size-change="handle_size_change"
                    @current-change="handle_current_change"
                    :current-page=this.searchData.page
                    :page-sizes="[20, 50,100, 200]"
                    :page-size=this.searchData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=this.count>
                </el-pagination>
            </div>
            <add-edit v-model="dialogShow" :edit-id="editId" @add-data="add_data" @update-data="update_data" :warehouses="warehouses" :edit="edit" :warehouse-cargo-class-data="warehouseCargoClassData" :title="title"></add-edit>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import{warehouse_cargo_class,add_warehouse_cargo_class,api_edit_warehouse_cargo_class,url_add_warehouse_cargo_class}from '../../../api/warehouse-cargo-class';
        import {entrepot_picking,api_warehous_lists} from '../../../api/entrepot-picking';
        export default{
            page: {},
            permission:{
                url_add_warehouse_cargo_class
            },
            refresh(){
                this.init();
            },
            data(){
                return{
                    searchData:{
                        warehouse_id:2,
                        code:'',
                        name:'',
                        status:'',
                        pageSize:50,
                        page:1
                    },
                    dataTable:[],
                    warehouses:[],
                    warehouseCargoClassData:{
                        code:'',
                        name:'',
                        warehouse_id:'',
                        width:'',
                        length:'',
                        height:'',
                        rate:`1.00`,
                        max_volume:'',
                        status:1,
                        description:'',
                    },
                    loading:false,
                    edit:false,
                    dialogShow:false,
                    count:0,
                    editId:'',
                    title:'',

                }
            },
            created(){
                this.init();
                this.warehouses_init();
            },
            methods:{
                warehouses_init(){
                    this.$http(api_warehous_lists).then(res => {
                        this.warehouses = res.map((item) => {
                            return {label: item.name, value: item.id};
                        });
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })
                },
                init(){
                    this.loading = true;
                    let params = {
                        page:this.searchData.page,
                        pageSize:this.searchData.pageSize,
                        warehouse_id:this.searchData.warehouse_id,
                        code:this.searchData.code,
                        name:this.searchData.name,
                        status:this.searchData.status,
                    };
                    this.$http(warehouse_cargo_class,params).then(res=>{
                        this.dataTable = res.data;
                        this.count = res.count;
                        this.loading = false;
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })
                },
                handle_size_change(val){
                    this.searchData.pageSize = val;
                    this.init();
                },
                handle_current_change(val){
                    this.searchData.page = val;
                    this.init();
                },
                search(){
                    this.init();
                },
                add(){
                    this.edit = true;
                    this.dialogShow = true;
                    this.warehouseCargoClassData = {
                        code:'',
                        name:'',
                        warehouse_id:this.searchData.warehouse_id,
                        width:'',
                        length:'',
                        height:'',
                        rate:`1.00`,
                        max_volume:'',
                        status:1,
                        description:'',
                    };
                    this.editId = false;
                    this.title = `添加货位类型`;
                },
                look_data(val){
                    this.dialogShow = true;
                    this.warehouseCargoClassData = val;
                    this.edit = false;
                    this.title = `查看货位类型: ${val.name} 信息`;
                },
                edit_data(val,id){
                    this.editId = id;
                    this.dialogShow = true;
                    this.edit = true;
                    this.warehouseCargoClassData = val;
                    this.title = `编辑货位类型: ${val.name} 信息`;
                },
                delete_data(){
                	this.count -= 1;
                },
                add_data(val){
                    return this.$http(add_warehouse_cargo_class,val).then(res=>{
                        this.$set(val,'id',parseInt(res.id));
                        let warehouses_name = this.warehouses.find(item=>item.value===val.warehouse_id);
                        if(!!warehouses_name){
                            val.warehouse = warehouses_name.label;
                        }
                        this.dataTable.unshift(val);
                        this.count += 1;
                        this.$message({type:'success',message:res.message || res});
                        this.dialogShow = false;
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        });
                    });
                },
                update_data(val,id){
                    console.log("data",val);
                    let data = {
                        id:val.id,
                        code:val.code,
                        name:val.name,
                        warehouse_id:val.warehouse_id,
                        length:val.length,
                        width:val.width,
                        height:val.height,
                        status:val.status,
                        rate:val.rate===`1`?`1.00`:val.rate,
                        description:val.description,
                        max_volume:val.max_volume,
                    };
                    return this.$http(api_edit_warehouse_cargo_class,id,data).then(res=>{
                        let warehouses_name = this.warehouses.find(item=>item.value===val.warehouse_id);
                        if(!!warehouses_name){
                            val.warehouse = warehouses_name.label;
                        }
                        val.update_time = datef("YYYY-MM-dd HH:mm:ss",Date.parse(new Date)/1000);
                        this.dataTable.forEach(row=>{
                            if(row.id===val.id){
                                Object.assign(row,val);
                                row.rate = data.rate;
                            }
                        });
                        this.$message({type:'success',message:res.message || res});
                        this.dialogShow = false;
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        });
                    });
                },
            },
            components:{
                cardSearch:require('./card-search.vue').default,
                dataTable:require('./data-table.vue').default,
                addEdit:require('./add-edit.vue').default,
            }
        }
    </script>
