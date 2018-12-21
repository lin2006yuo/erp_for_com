<template>
    <page class="p-index.vue">
        <card-search
            ref="search"
            :searchData="searchData"
            @update-area="update_area"
            @search="search"></card-search>
        <el-row class="mb-xs mt-xs">
            <permission tag="ElButton"
                        :route="apis.url_add_warehouse_area"
                        type="primary"
                        class="ml-sm"
                        @click="add"
                        size="mini">添加分区
            </permission>
        </el-row>
        <data-table
            :data-table="dataTable"
            @look-data="look_data"
            @edit-data="edit_data"
            :status="this.searchData.status"
            @delete-data="delete_data"
            :loading="loading"
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
        <category-ids v-model="categoryShow" :category-ids="categoryIds" @submit="submit"></category-ids>
        <add-edit v-model="dialogShow" :app-type-data="appTypeData" :edit-id="editId" @category-show="category_show" @add-data="add_data" @update-data="update_data" :edit="edit" :warehouses="warehouses" :warehouse-data="warehouseData" :title="title"></add-edit>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import{api_warehouse_area_app_types}from '../../../api/warehouse-cargo';
    import{warehouse_area,add_warehouse_area,api_edit_warehouse_area,url_add_warehouse_area}from '../../../api/warehouse-area';
    import {entrepot_picking,api_warehous_lists} from '../../../api/entrepot-picking';
    export default{
        page: {},
        permission:{
            url_add_warehouse_area
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                dataTable:[],
                warehouses:[],
                appTypeData:[],
                appTypeDatas:[],
                appType:[],
                searchData:{
                    warehouse_id:2,
                    status:'',
                    warehouse_area_type:0,
                    name:'',
                    code:'',
                    operator_id:'',
                    page:1,
                    pageSize:50,
                },
                warehouseData:{
                    code:'',
                    name:'',
                    warehouse_id:'',
                    warehouse_area_type:'',
                    sort:'',
                    floor_id:'',
                    operator_ids:'',
                    description:'',
                    status:1,
                    category_lists:'',
                    category_ids:[],
                },
                count:0,
                loading:false,
                edit:false,
                dialogShow:false,
                categoryShow:false,
                title:'',
                editId:'',
                categoryIds:[]
            }
        },
        created(){
            this.init();
            this.warehouses_init();
            this.warehouse_area_app_types();
        },
        methods:{
            update_area(){
                this.warehouse_area_app_types();
            },
            warehouse_area_app_types(){
                this.$http(api_warehouse_area_app_types).then(res=>{
                    this.appTypeDatas = res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            	let data ={
                    list_type:1,
                    warehouse_id:this.searchData.warehouse_id
                };
                this.$http(api_warehouse_area_app_types,data).then(res=>{
                    this.appType = res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            },
            warehouses_init() {
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
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            init(){
                this.loading = true;
                let params = {
                    page:this.searchData.page,
                    pageSize:this.searchData.pageSize,
                    warehouse_id:this.searchData.warehouse_id,
                    status:this.searchData.status,
                    warehouse_area_type:this.searchData.warehouse_area_type,
                    name:this.searchData.name,
                    code:this.searchData.code,
                    operator_id:this.searchData.operator_id,
                };
                this.$http(warehouse_area,params).then(res=>{
                    this.dataTable = res.data;
                    this.dataTable.forEach(row=>{
                        row.category_lists.forEach(res=>{
                            res.category_name = res.category_name.replace('>','>>');
                        });
                        row.category_list = row.category_lists.map(res=>res.category_name);
                        row.category_list = row.category_list.join(',');
                    });
                    this.count = res.count;
                    this.loading = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            search(){
                this.init();
            },
            add(){
                this.appTypeData = [];
                this.appTypeData = this.appType;
                this.edit = true;
                this.editId = 0;
                this.dialogShow = true;
                this.categoryIds = [];
                this.warehouseData = {
                    code:'',
                    name:'',
                    warehouse_id:this.searchData.warehouse_id,
                    warehouse_area_type:'',
                    sort:'',
                    floor_id:'',
                    operator_ids:'',
                    description:'',
                    status:1,
                    category_lists:'',
                    category_ids:[],
                };
                this.title = `添加仓库分区`;

            },
            look_data(val){
                this.dialogShow = true;
                this.warehouseData = val;
                this.edit = false;
                this.warehouseData.category_lists = val.category_lists.map(res=>res.category_name.replace('>','>>'));
                this.title = `查看仓库分区: ${val.name} 信息`;
            },
            edit_data(val,id){
                this.appTypeData = [];
                this.appTypeData = this.appTypeDatas;
                this.editId = id;
                this.dialogShow = true;
                this.edit = true;
                this.warehouseData = val;
                this.warehouseData.category_ids = val.category_lists.map(res=>res.category_id);
                this.warehouseData.category_lists = val.category_lists.map(res=>res.category_name.replace('>','>>'));
                this.title = `编辑仓库分区: ${val.name} 信息`;
            },
            add_data(val){
                let data = {
                    code:'',
                    name:'',
                    warehouse_id:'',
                    warehouse_area_type:'',
                    sort:'',
                    floor_id:'',
                    operator_ids:'',
                    description:'',
                    status:1,
                    category_ids:[],
                };
                Object.keys(data).forEach(key=>{
                	data[key] = val[key];
                });
                return this.$http(add_warehouse_area,data).then(res=>{
                  let param = window.clone(val);
                    this.$set(param,'id',parseInt(res.id));
                    let find = this.appTypeDatas.find(item=>item.value===val.warehouse_area_type);
                    if(!!find){
                        param.warehouse_area_type = find.label;
                    }
                    let warehouses_name = this.warehouses.find(item=>item.value===val.warehouse_id);
                    if(!!warehouses_name){
                        param.warehouse = warehouses_name.label;
                    }
                    if(!!val.category_lists){
                        param.category_list = val.category_lists.join();
                        if(param.category_lists.length>1){
                            param.category_lists.forEach((params,index)=>{
                                param.category_lists[index] = {
                                    category_name:params
                                };
                            });
                        }
                    }
                    param.shelf_disable_count = 0;
                    param.shelf_count = 0;
                    param.operator = res.data.operator;
                    param.status = res.data.status;
                    param.floor_id = res.data.floor_id;
                    param.update_time = res.data.update_time;
                    this.dataTable.unshift(param);
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
                    floor_id:val.floor_id,
                    operator_ids:val.operator_ids,
                    status:val.status,
                    warehouse_area_type:val.warehouse_area_type,
                    sort:val.sort,
                    description:val.description,
                    category_ids:val.category_ids,
                };
                return this.$http(api_edit_warehouse_area,id,data).then(res=>{
                    let find = this.appTypeDatas.find(item=>item.value===data.warehouse_area_type);
                    if(!!find){
                        data.warehouse_area_type = find.label;
                    }
                    this.dataTable.forEach(row=>{
                        if(row.id===data.id){
                            Object.assign(row,res.data);
                            row.warehouse_area_type = data.warehouse_area_type;
                            row.category_list = val.category_lists.join();
                            if(row.category_lists.length>1){
                                row.category_lists.forEach((item,index)=>{
                                    item.category_name = val.category_lists[index];
                                });
                            }else{
                                val.category_lists.forEach((param,index)=>{
                                    row.category_lists[index] = {
                                        category_name:param
                                    };
                                });
                            }
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
            delete_data(){
                this.count --;
            },
            category_show(ids){
            	this.categoryShow = true;
            	if(ids){
            		console.log("category_ids",ids);
            		this.categoryIds = ids;
                }
            },
            submit(node,ids){
            	this.nodes = node;
            	this.ids = ids;
                if(node){
                    let name = [];
                    node.forEach(res=>{
                        res.name_path = res.name_path.replace('-','>>');
                        name.push(res.name_path);
                    });
                    this.$set(this.warehouseData,'category_ids',ids);
                    this.$set(this.warehouseData,'category_lists',name);
                }
            }
        },
        components:{
            cardSearch:require('./card-search.vue').default,
            dataTable:require('./data-table.vue').default,
            addEdit:require('./add-edit.vue').default,
            categoryIds:require('./category-ids.vue').default
        }
    }
</script>
