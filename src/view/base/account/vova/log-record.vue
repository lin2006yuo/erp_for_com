<template>
    <page class="p-dialog-error-info-search">

        <page-dialog :title="title" v-model="show" @open="open" width="765px" left="30%" size="full"
                     :close-on-click-modal="true" class="suppliers-edit">
            <el-row>
                <el-table
                    class="scroll-bar"
                    :data="operationLog"
                    :highlight-current-row="true"
                    element-loading-text="玩命加载中..."
                    v-resize="{height:41}"
                >
                    <div slot="empty" class="no-data-reminder">
                        <i></i>
                        {{emptyText}}
                    </div>
                    <el-table-column label="操作人" inline-template row-key="company_name" min-width="100">
                        <el-popover
                            placement="top-start"
                            trigger="hover"
                            :content="row.operator_dept">
                            <span slot="reference">{{row.operator|filterName}}</span>
                        </el-popover>
                    </el-table-column>
                    <el-table-column label="操作时间" inline-template row-key="company_name" min-width="130">
                        <div>
                            <ui-tip :content="row.create_time|filterDate" :width="130"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column label="操作内容" inline-template row-key="company_name" min-width="400">
                        <div class="opration_content">
                            <p v-for="(item,index) in JSON.parse(row.remark)" :key="index">
                                {{item}}
                            </p>
                        </div>
                    </el-table-column>
                </el-table>
            </el-row>
            <div slot="footer">
                <el-button size="mini" class="inline" @click.native="close">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .p-dialog-error-info-search {
        .page-dialog .dialog__body {
            padding: 0 10px 5px 10px;
            color: #475669;
            font-size: 1.2rem;
            overflow-x: hidden;
            overflow-y: hidden;
            box-sizing: border-box;
            height: 100%;
            max-height: 70%;
            .mt-sm {
                margin-bottom 60px;
                max--height: 520px;
            }
            .opration_content{
                word-break: break-all;
            }
        }
    }

</style>
<script>
    export default {
        page: {
            devinfo: {
                frontEnd: '付剑明',
                backEnd: '凌家文',
                createTime: '2019-4-20',
                updateTime: '2017-9-25'
            }
        },
        data() {
            return {
                show: this.value,
            }
        },
        methods: {
            open() {

            },
            close() {
                this.show = false;
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            },
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd HH:mm:ss', val):'-- --';
            },
            filterName(val){
                return val?val:'--';
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            operationLog:{
                required: true,
                type: Array
            },
            title:{
                required: true,
                type: String
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            searchCard: require('@/components/search-card').default,
            labelItem: require('@/components/label-item').default
        }
    }
</script>
