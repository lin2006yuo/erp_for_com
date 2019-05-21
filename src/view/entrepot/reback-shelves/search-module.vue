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
                <el-input v-model="searchData.warehouse_cargo_code"
                          v-sf.warehouse_cargo_code
                          placeholder="请输入货位"
                          @keyup.enter.native="init">
                </el-input>
            </label-item>
            <label-item label="分区功能：" class="ml-sm mr-sm">
                <el-select v-model="searchData.warehouse_area_id" class="inline width-sm" v-sf.warehouse_area_id>
                    <el-option v-for="(item, index) in areaList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking, api_get_area} from '../../../api/return-shelves'
    export default {
        data(){
            return {
                warehouse_id:2,
                searchData:{
                    sku:'',
                    warehouse_cargo_code:'',
                    warehouse_area_id:'',
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
                areaList:[]
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
