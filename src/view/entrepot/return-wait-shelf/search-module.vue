<template>
    <div>
        <div class="mb-xs">
            <label-item label="请选择仓库：" class="mt-sm">
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
                     :clears="clears">
            <label-item label="SKU：">
                <el-input v-model="searchData.sku"
                          v-sf.sku
                          placeholder="请输入SKU"
                          class="inline"
                          @keyup.enter.native="init">
                </el-input>
            </label-item>

            <label-item label="货位：" class="ml-sm">
                <el-input v-model="searchData.warehouse_cargo"
                          v-sf.warehouse_cargo
                          placeholder="请输入货位"
                          @keyup.enter.native="init">
                </el-input>
            </label-item>
            <label-item label="分区功能：" class="ml-sm ">
                <el-select v-model="searchData.warehouse_area_id" class="inline width-sm" v-sf.warehouse_area_id>
                    <el-option v-for="(item, index) in areaList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="标记待入库时间：" class="ml-sm mr-sm">
                <el-date-picker
                        @keyup.enter.native="search"
                        type="date"
                        v-sf.date_start
                        placeholder="开始时间"
                        v-model="searchData.date_start"
                        class="inline date"
                        :picker-options="pickerStart"
                ></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        @keyup.enter.native="search"
                        type="date"
                        placeholder="结束时间"
                        v-sf.date_end
                        v-model="searchData.date_end"
                        class="inline date mr-sm"
                        :picker-options="pickerEnd"
                ></el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking, api_get_area} from '../../../api/return-shelves';
    import datef from "datef";
    export default {
        data(){
            return {
                warehouse_id:2,
                searchData:{
                    sku:'',
                    warehouse_cargo:'',
                    warehouse_area_id:'',
                    date_start:(Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    date_end:Date.now(),
                    page:1,
                    pageSize:20
                },
                clears:{
                    page:1,
                    pageSize:20
                },
                warehouses: [],
                typeList:[
                    {label:'SKU',value:'sku'},
                    {label:'商品名称',value:'name'}
                ],
                areaList:[],
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_end){
                            return  time.getTime() > this.searchData.date_end
                        }else {
                            return false
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_start){
                            return time.getTime() < this.searchData.date_start
                        }else {
                            return false
                        }
                    }
                },
            }
        },
        mounted(){
            this.init_warehouse();
            this.init_areaList();
            this.init();
        },
        methods: {
            init(){
                Object.keys(this.searchData).forEach(key=>{
                    if(typeof this.searchData[key] === 'string'){
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let searchData = window.clone(this.searchData);
                this.searchData.date_start&&(searchData.date_start=datef('YYYY-MM-dd', this.searchData.date_start));
                this.searchData.date_end&&(searchData.date_end=datef('YYYY-MM-dd', this.searchData.date_end));
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
            init_areaList(){
                this.$http(api_get_area, {warehouse_id:this.warehouse_id}).then(res => {
                    this.areaList.push({label:'全部', value:''}, ...res);
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            change_depot(){
                this.init();
            },
            search(){
                this.init();
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
        },
    }
</script>
