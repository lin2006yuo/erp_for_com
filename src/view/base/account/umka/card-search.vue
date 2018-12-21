<template>
    <search-card :params="searchData" :clears="clears" @search="search">
        <label-buttons label='状态：' :buttons="buttons"  @select="change_select"></label-buttons>
        <label-item label="">
            <el-select
                    v-model="searchData.snType"
                    class="s-width-small"
                    v-sf.snType>
                <el-option
                        v-for="(res,index) in snTypeList"
                        :label="res.label"
                        :value="res.value"
                        :key="index"
                ></el-option>
            </el-select>
            <el-input
                    v-model="searchData.snText"
                    :placeholder="`请输入${changeLabel}...`"
                    class="ml-xs width-super"
                    v-sf.snText
                    @keydown.native="keyword"></el-input>
        </label-item>
        <label-item label="订单授权状态：" class="inline ml-sm">
            <el-select
                    class="inline width-xs"
                    v-sf.authorization
                    v-model="searchData.authorization"
                    placeholder="请选择">
                <el-option
                        v-for="item in authorList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item class="mr-lg">
            <el-select v-model="searchData.taskName"  class="s-width-middle ml-sm" v-sf.taskName>
                <el-option
                        v-for="(res,index) in taskNameList"
                        :label="res.label"
                        :value="res.value"
                        :key="index"
                ></el-option>
            </el-select>
            <el-select v-model="searchData.taskCondition" class='ml-xs mr-xs' v-sf.taskCondition
                       style="width:70px">
                <el-option
                        v-for="(res,index) in taskConditionList"
                        :label="res.label"
                        :value="res.value"
                        :key="index"
                ></el-option>
            </el-select>
            <el-select v-model="searchData.taskTime" class="s-width-default" v-sf.taskTime>
                <el-option
                        v-for="(res,index) in taskTimeList"
                        :label="res.label"
                        :value="res.value"
                        :key="index"
                ></el-option>
            </el-select>
        </label-item>
    </search-card>
</template>

<script>
    export default {
        data() {
            return {
                taskTimeList:[
                    {label:'全部',value:''},
                    {label:'未启用',value:0},
                    {label:'1小时',value:60},
                    {label:'2小时',value:120},
                    {label:'3小时',value:180},
                    {label:'5小时',value:300},
                    {label:'6小时',value:360},
                    {label:'8小时',value:480},
                    {label:'10小时',value:600},
                    {label:'12小时',value:720},
                    {label:'24小时',value:1440},
                ],
                taskConditionList:[
                    {label:'=',value:'eq'},
                    {label:'>',value:'gt'},
                    {label:'<',value:'lt'},
                ],
                authorList: [
                    {value: -1, label: '全部'},
                    {value: 0, label: '未授权'},
                    {value: 1, label: '已授权'},
                ],
                snTypeList:[
                    {label:'账户',value:'name'},
                    {label:'简称',value:'code'},
                ],
                taskNameList:[
                    {label:'同步发货状态',value:'sync_delivery'},
                    {label:'抓取订单数据',value:'download_order'},
                    {label:'抓取listing数据',value:'sync_listing'},
                ],
                buttons:[
                    {label:'全部',value:''},
                    {label:'已启用',value:true},
                    {label:'已停用',value:false},
                ],
            }
        },
        methods: {
            change_select(index){
                this.searchData.status = this.buttons[index].value;
                this.$emit('change-select');
            },
            keyword(val) {
                if(val.code==='Enter'){
                    this.$emit("key-word");
                }
            },
            search(){
                this.$emit('search');
            },
        },
        computed:{
            changeLabel() {
                if (this.searchData.snType === 'name') {
                    return `账户`;
                } else{
                    return `简称`;
                }
            },
        },
        props:{
            searchData:{},
            clears:{}
        },
        components:{
            searchCard:require('@/components/search-card.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>

<style scoped>

</style>