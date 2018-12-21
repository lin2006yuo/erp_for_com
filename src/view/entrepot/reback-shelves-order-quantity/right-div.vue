<template>
    <ui-card class="p-return-shelves">
        <span slot="header" class="title">当前操作日志</span>
        <el-table :data="tableData"
                  v-resize="{height:45}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar"
                  highlight-current-row>
            <el-table-column
                    inline-template
                    align="left"
                    header-align="center"
                    label="操作事项">
                <div>
                    <ui-tip :content="row.message" :width="98" class="inline"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
    </ui-card>
</template>
<style lang="stylus">
    .p-return-shelves{
        .printer_title{
            display: inline-block;
            line-height: 32px;
            vertical-align: middle;
        }
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        data(){
            return {
                loading:false,
                tableData:[],
            }
        },
        filters:{
            filertTime(val){
                return val?datef('YYYY-MM-dd',val):'-- --'
            }
        },
        mounted(){
        },
        methods: {},
        computed: {},
        watch: {},
        props: {},
        components: {
            uiTip:require('../../../components/ui-tip.vue').default,
            uiCard:require('@/components/ui-card.vue').default,
        },
    }
</script>
