<template>
    <div class="c-card-search">
        <label-item label="请选择仓库：" class="mb-xs mt-sm">
            <el-select v-model="warehouse_id" class="inline width-sm" @change="select_warehouse">
                <el-option
                    :key="item.value"
                    v-for="item in warehouses"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <search-card @search="search" @enter="search" :params="paramsData" :clears="clears" @init-params="init_btn">
                <label-buttons class="inline btn-ml" label="分区功能：" title="请选择状态" :buttons="appTypeList" @select="select_app_type"></label-buttons>
                <label-buttons class="inline btn-ml mar_left" label="状态：" title="请选择状态" :buttons="statusList" @select="select_status"></label-buttons>
            <el-select v-sf.snType v-model="paramsData.snType" class="inline s-width-default">
                <el-option
                    :key="item.value"
                    v-for="item in typeList"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-sf.snText v-model="paramsData.snText" :placeholder="`请输入${changeLabel}...`" class="inline enter-result"></el-input>
            <label-item label="管理员：" class="inline ml-sm">
                <warehouse-staffs class="inline mr-sm width-sm" v-sf.operator_id v-model="paramsData.operator_id"></warehouse-staffs>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking,api_warehous_lists} from '../../../api/entrepot-picking';
    import {api_warehouse_area_app_types} from '../../../api/warehouse-cargo';
    import {getUser} from '../../../api/purchasing';
    export default{
        data(){
            return{
                warehouse_id:2,
                paramsData:{
                    status:'',
                    warehouse_area_type:0,
                    snType:'code',
                    snText:'',
                    code:'',
                    name:'',
                    operator_id:'',
                },
                clears:{
                    snType:'code',
                    warehouse_area_type:0,
                },

                warehouses:[],
                statusList:[
                    {name:"全部",status:''},
                    {name:"启用",status:1},
                    {name:"停用",status:0},
                ],
                typeList:[
                    {label:"分区code",value:'code'},
                    {label:"分区名称",value:'name'},
                ],
                appTypeList:[],
                buyer:[],
                isCleared: false,
            }
        },
        created(){
            this.warehouses_init();
            this.warehouse_area_app_types();
            this.$http(getUser).then(res=>{
                this.buyer = res;
            }).catch(code=>{
                this.$message({type:'error',message:code.message||code});
            })
        },
        methods:{
            init_btn(){
                let statusBtn = this.statusList;
                let appBtn = this.appTypeList;
                this.statusList = [];
                this.appTypeList = [];
                this.isCleared = true;
                this.$nextTick(()=>{
                    this.statusList = statusBtn;
                    this.appTypeList = appBtn;
                });
            },
            warehouse_area_app_types(){
                this.$http(api_warehouse_area_app_types).then(res=>{
                    this.appTypeList = res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            },
            select_warehouse(val){
                this.paramsData.warehouse_id = val;
                this.search();
                this.$emit('update-area');
            },
            select_status(val){
                this.paramsData.status = this.statusList[val].status;
                this.search();
            },
            select_app_type(val){
                this.paramsData.warehouse_area_type = this.appTypeList[val].value;
                this.search();
            },
            search(){
                typeof this.paramsData.snText === 'string' && (this.paramsData.snText = this.paramsData.snText.trim());
            	if(this.paramsData.snType === 'code'){
                    this.paramsData.code = this.paramsData.snText;
                    this.paramsData.name = '';
                }else{
                    this.paramsData.code = '';
                    this.paramsData.name = this.paramsData.snText;
                }
                if(this.isCleared) {
            	    this.searchData.page = 1;
            	    this.searchData.pageSize = 50;
            	    this.isCleared = false;
                }
                Object.assign(this.searchData,this.paramsData, {warehouse_id: this.warehouse_id});
                this.$emit('search',this.searchData);
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
        },
        computed: {
            changeLabel(){
                let find = this.typeList.find(row=>{
                    return row.value === this.paramsData.snType;
                });
                if(!!find){
                    return find.label;
                }
            }
        },
        props:{
            searchData:{},
        },
        components:{
            labelItem:require('../../../components/label-item.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            labelButtons:require('../../../components/label-buttons.vue').default,
            warehouseStaffs:require('../../../api-components/warehouse-staffs.vue').default,
        }
    }
</script>

