<template>
    <div class="c-search-name">
        <search-card :params="searchData" :clears="clears" @search="search">
            <label>规则类型：</label>
            <el-select v-model="searchData.rule_type"
                       class="inline"
                       style="width:20%"
                       multiple filterable clearable>
                <el-option
                        v-for="(item, index) in ruleTypeList"
                        :value="item.id"
                        :label="item.name"
                        :key="index"
                ></el-option>
            </el-select>
            <label-item label="订单号：" class="mr-sm ml-sm">
                <el-input v-model="searchData.order_number" class="inline width-super"></el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-search-name{
        .el-select__tags{
            height: 30px!important;
            width: 300px;
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
    }
</style>
<script>
    import {api_get_rules_action} from '@/api/rule-try-run';
    export default {
        data() {
            return {
                ruleTypeList:[]
            }
        },
        mounted(){
            this.get_action();
        },
        methods:{
            search(){
                this.$emit('search');
            },
            get_action(){
                this.$http(api_get_rules_action).then(res => {
                    console.log(res,'res');
                    this.ruleTypeList = res;
                }).catch(code => {
                    console.log(code,'code');
                })
            },
        },
        props:{
            /**搜索数据
             * */
            searchData:{
                required:true,
                type:Object
            },
            clears:{
                required:true,
                type:Object
            }
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>