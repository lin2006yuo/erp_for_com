    <template>
    <div class="p-package-handling">
        <div class="table_head">
            <span class="ml-sm table_title">当前操作日志</span>
        </div>
        <el-table :data="tableData"
                  v-resize="{height:40}"
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
            <el-table-column
                inline-template
                label="操作时间">
                <div>
                    <ui-tip :content="row.created_at | filertTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">
    .p-package-handling{
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
                printer:'',
                token:'',
                numberList:[]
            }
        },
        updated(){
            console.log('this.tableData',this.tableData)
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
            uiTip:require('@/components/ui-tip.vue').default,
            selectPrinter:require('@/components/select-printer').default
        },
    }
</script>
