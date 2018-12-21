<template>
    <div>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <el-select v-model="warehouse_id"
                           @change="change_depot"
                           class="inline s-width-default">
                    <el-option
                        :key="item.value"
                        v-for="item in warehouses"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <search-card :params="searchData"
                     @search="search"
                     :clears="clears"
                     @init-params="init_status_btn">
            <div>
                <label-buttons
                    label="状态："
                    class="inline"
                    @select="change_status"
                    :buttons="statusList">
                </label-buttons>
            </div>
            <div class="mb-mini">
                <label-item label="上架单号：" labelWidth="60">
                    <el-input v-model="searchData.id"
                              class="width-lg"
                              v-sf.id
                              @keyup.enter.native="id_enter">
                    </el-input>
                </label-item>
                <label-item label="货位：" class="ml-sm" labelWidth="48">
                    <el-input v-model="searchData.warehouse_cargo_code"
                              v-sf.warehouse_cargo_code
                              @keyup.enter.native="id_enter">
                    </el-input>
                </label-item>
                <label-item label="SKU：" class="ml-sm mr-sm">
                    <el-input v-model="searchData.sku"
                              v-sf.sku
                              @keyup.enter.native="id_enter">
                    </el-input>
                </label-item>
            </div>
            <label-item label="上架区：" labelWidth="60">
                <el-select v-model="searchData.warehouse_area_type" class="s-width-default">
                    <el-option v-for="(item, index) in areaList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="创建人：" class="ml-sm" labelWidth="48">
                <param-account
                    style="width: 153px;"
                    v-model="searchData.creator_id"
                    :param="{data:{content:''}}"
                    :fixUrl="true"
                    :fixResult="sale_fix_result"
                    type="warehouseUser"
                    placeholder="请选择/输入..."
                    url="get|user/warehouse/staffs">
                </param-account>
            </label-item>
            <label-item label="创建时间：" class="ml-sm mr-sm">
                <el-date-picker
                    v-model="searchData.create_time_from"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.create_time_from
                    :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                    v-model="searchData.create_time_to"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.create_time_to
                    :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking} from '../../../api/mass-zone'
    import {api_get_area, api_get_type} from '../../../api/putaway-order'
    export default {
        data(){
            return {
                warehouse_id:2,
                searchData:{
                    id:'',
                    status:'',
                    warehouse_cargo_code:'',
                    sku:'',
                    warehouse_area_type:'',
                    creator_id:'',
                    create_time_from:'',
                    create_time_to:'',
                    page:1,
                    pageSize:20
                },
                clears:{
                    page:1,
                    pageSize:20
                },
                warehouses: [],
                statusList:[
                    {label:'全部',value:''},
                    {label:'待上架',value:1},
                    {label:'上架中',value:3},
                    {label:'已上架',value:5},
                    {label:'已作废',value:0}
                ],
                areaList:[],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_e){
                            return time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },//结束时间
                urlcreater:'get|user',
            }
        },
        mounted(){
            this.init_warehouse();
            this.init_area();
            this.init();
        },
        methods: {
            init_status_btn(){
                let cur = this.statusList;
                this.statusList = [];
                this.$nextTick(()=>{
                    this.statusList = cur;
                })
            },
            init(){
                Object.keys(this.searchData).forEach(key=>{
                    if(typeof this.searchData[key] === 'string'){
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let searchData = window.clone(this.searchData);
                Object.assign(searchData, {warehouse_id: this.warehouse_id});
                this.$emit('init-data', searchData);
            },
            init_warehouse(){
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_area(){
                this.$http(api_get_type).then(res=>{
                    this.areaList.push({label:'全部',value:''}, ...res);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            change_depot(){
                this.init();
            },
            change_status(select, item){
                this.searchData.status = item.value;
                this.init();
            },
            search(){
                this.init();
            },
            id_enter(){
                this.init();
            },
            sale_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            labelButtons:require('../../../components/label-buttons.vue').default,
            paramAccount:require('../../../api-components/param-account').default
        },
    }
</script>
