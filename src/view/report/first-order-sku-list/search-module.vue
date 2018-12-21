<template>
    <el-row class="first-order-search">
        <search-card @search="search" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons class="inline"
                               label="平台："
                               v-sf.channel_id
                               :buttons="buttonList"
                               @select="select_button"></label-buttons>
            </el-row>
            <label-item class="mr-sm" label="开发员：">
                <param-account
                        class="s-width-default"
                        ref="paramDevelopment"
                        v-model="searchData.developer"
                        v-sf.developer
                        :fixResult="development_fix_result"
                        type="memberShipSales"
                        placeholder="请选择/输入..."
                        url="get|user/development/staffs">
                </param-account>
            </label-item>
            <label-item class="mr-sm" label="SKU：">
                <order-input v-model="searchData.sku"
                             class="inline width-super"
                             v-sf.sku
                             @keydown="submit"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
            </label-item>
            <label-item label="" class="mr-sm">
                <el-select class="inline s-width-default mr-xs"
                           v-sf.snDate
                           v-model="searchData.snDate">
                    <el-option v-for="item in dataTypeList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"></el-option>
                </el-select>
                <span>:</span>
                <el-date-picker type="date"
                                placeholder="开始时间"
                                v-sf.date_b
                                v-model="searchData.date_b"
                                :picker-options="pickerStart"
                                class="inline date mr-xs ml-xs"></el-date-picker>
                <span>--</span>
                <el-date-picker type="date"
                                placeholder="结束时间"
                                v-sf.date_e
                                v-model="searchData.date_e"
                                :picker-options="pickerEnd"
                                class="inline date ml-xs"></el-date-picker>
            </label-item>
        </search-card>
    </el-row>
</template>

<style lang="stylus" scoped>
.first-order-search {
    .el-card{
        overflow: inherit;
    }
}
</style>

<script>
    import {api_get_channel} from '../../../api/first-order-sku';
    export default {
        name: "search-module",
        data(){
            return {
                buttonList: [],
                dataTypeList: [
                    {label:"上架日期",value:'shelf_time'},
                    {label:"下单日期",value:'order_time'},
                ],
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return time.getTime()>this.searchData.date_e;
                        }else{
                            return false;
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return time.getTime()<this.searchData.date_b;
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        mounted(){
            this.get_channel()
        },
        methods:{
            development_fix_result(res){
                return res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            search(){
                this.$emit('search')
            },
            select_button(val, item){
                this.$emit('select-button',item.value)
            },
            submit(){
                this.$emit('submit')
            },
            get_channel(){
                this.$http(api_get_channel).then(res=>{
                    this.buttonList = [{label: "全部", value: ''},...res]
                }).catch(code=>{

                })
            }
        },
        props:{
            searchData:{
                required:true,
                type:Object
            },
            clears:{
                required:true,
                type:Object
            }
        },
        components:{
            labelItem:require('../../../components/label-item.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            labelButtons: require('../../../components/label-buttons.vue').default,
            orderInput:require('../../../components/order-input.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
        }
    }
</script>