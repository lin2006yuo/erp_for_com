<template>
    <page class="p-index over-flow-auto">
        <search-table ref="search" @search="search"></search-table>
        <data-table :data-table="dataTable" class="mt-sm" :loading="isLoading"></data-table>
    </page>
</template>
<style lang="stylus">

</style>
<script>
import {api_get_trial} from '../../../api/freight-trial';
    export default{
    	page:{},
        refresh(){
           this.$refs.search.init();
        },
        data(){
            return {
                dataTable:[],
                isLoading:false,
            }
        },
        methods:{
            search(val){
            	if(val.search_type===1){
                    if(!val.country_code || !val.weight) return this.$message({type:"warning",message:`到达国家与重量是必填项`});
                    this.$delete(val,'package_number');
                    this.$delete(val,'sku');
                    this.api_get_trial(val);
                }else if(val.search_type===2){
                    if(!val.country_code || !val.package_number) return this.$message({type:"warning",message:`到达国家与包裹号是必填项`});
                    this.$delete(val,'length');
                    this.$delete(val,'width');
                    this.$delete(val,'height');
                    this.$delete(val,'weight');
                    this.$delete(val,'property');
                    this.$delete(val,'sku');
                    this.api_get_trial(val);
                }else{
                    if(!val.country_code || !val.sku) return this.$message({type:"warning",message:`到达国家与SKU是必填项`});
                    this.$delete(val,'length');
                    this.$delete(val,'width');
                    this.$delete(val,'height');
                    this.$delete(val,'weight');
                    this.$delete(val,'property');
                    this.$delete(val,'package_number');
                    this.api_get_trial(val);
                }
            },
            api_get_trial(data){
                this.isLoading = true;
                this.$http(api_get_trial,data).then(res=>{
                    this.dataTable = res;
                    this.isLoading = false;
                }).catch(code=>{
                    this.isLoading = false;
                   this.$message({type:'error',message:code.message || code});
                })
            }
        },
        components: {
            searchTable:require("./search-table.vue").default,
            dataTable:require("./data-table.vue").default,
        }
    }
</script>
