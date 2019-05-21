<template>
    <div class="goods-delivery-search-page">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <div class="inline mr-sm">
                <label >状态：</label>
                <div class="inline">
                    <template v-for="item in btnList">
                        <el-button :key="item.type"
                                   :type="searchData.activeButton===item.type?'primary':''"
                                   size="mini"
                                   @click="changeBtn(item)">{{item.label}}</el-button>
                    </template>
                </div>
            </div>
            <div class="inline mr-sm">
                <el-select  v-model="searchData.snType" class="inline width-md">
                    <el-option
                        v-for="item in sku_type_options"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    ></el-option>
                </el-select>
                <order-input  v-if="searchData.snType === 'sku'" class="inline s-width-middle" style="width: 200px;" v-model="searchData.snText" v-sf.snText @keydown.enter.native="search" :placeholder="$t('ymx-list.searchTip')"></order-input>
                <el-input class="inline" v-else v-model="searchData.snText" v-sf.snText  @keydown.enter.native="search" :placeholder="$t('ymx-list.supportPreciseSearch')" ></el-input>
            </div>
            <div class="inline">
                <el-select v-model="searchData.time_type" class="inline width-xs">
                    <el-option
                        v-for="item in application_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker class="inline date"
                                v-model="searchData.start_time"
                                type="date"
                                :picker-options="pickerstart"
                                placeholder="开始时间">
                </el-date-picker>
                -
                <el-date-picker class="inline date mr-sm"
                                v-model="searchData.end_time"
                                type="date"
                                placeholder="结束时间"
                                :picker-options="pickerend">
                </el-date-picker>
            </div>
        </search-card>
    </div>
</template>

<style lang="stylus">
    .goods-delivery-search-page {
        .el-card{
            overflow :visible !important;
        }
    }
</style>

<script>

    export default {
        data(){
            return{
                pickerstart:{
                    disabledDate:(val)=>{
                        if(this.searchData.end_time){
                            return val.getTime()>this.searchData.end_time;
                        }else{
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(val)=>{
                        if(this.searchData.start_time){
                            return val.getTime()< this.searchData.start_time;
                        }else{
                            return false
                        }
                    }
                },
                value:"",
                sku_type_options:[
                    {label:'SKU',value:'sku'},
                    {label:'产品中文名称',value:'goods_name'}
                ],
                application_options:[
                    {label:"更新时间",value:1},
                    {label:"执行时间",value:2}
                ],
            }
        },
        created(){

        },
        methods:{
            search(){
                this.$emit("refresh");
            },
            changeBtn(item){
                // this.activeButton = item.type;
                // item.action.call(this);
                this.$emit('change-btn',item);
            },
        },
        props:{
            searchData:{
                type:Object,
                required:true
            },
            clears:{
                type:Object,
            },
            btnList:{

            }
        },
        components: {
            "search-card": require('@/components/search-card.vue').default,
            orderInput:require("@/components/order-input.vue").default,
        }
    }
</script>
