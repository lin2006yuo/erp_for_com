<template>
    <div class="c-table-data">
        <el-table
                class="mt-xs scroll-bar"
                border
                v-resize="{height:41}"
                :data="tableData.list"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                highlight-current-row>
            <el-table-column label="客服" inline-template width="160">
                <div>
                    <ui-tip :content="row.customer_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="待处理数" inline-template>
                <div>
                    <ui-tip :content="row.total" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="账号(站内信待处理数)" inline-template align="left">
                <div>
                    <div v-for="item in row.accounts">
                        {{item.account_code}}(<span @click="select_total(row,item)" class="operate">{{item.total}}</span>)
                    </div>
                </div>
            </el-table-column>
            <el-table-column label="销售员" inline-template align="left">
                <div>
                    <div v-for="item in row.accounts">
                        {{item.seller_name}}
                    </div>
                </div>
            </el-table-column>
        </el-table>
    </div>

</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {}
        },
        methods:{
            select_total(row,item){
                this.$emit('select-total',row,item);

            },
            keep(val){
                them.$emit('keep',val);
            },
        },
        props:{
            tableData:{
                required:true,
                type:Object
            },
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            },
            loading:{
                required: true,
                type:Boolean
            },
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,

        }
    }
</script>
