<template>
    <page-dialog :title="action.title"
                 class="c-single-picking"
                 size="large"
                 @open="open"
                 @close="close"
                 v-model="visible"
                 :close-on-click-modal="false">
        <div v-if="user.length > 0">
            <span>{{`参与该拣货单操作员（${user.length}）：`}}</span>
            <span v-for="name in user" :key="name" class="bold-font ml-sm single-picking-name">{{name}}</span>
        </div>
        <div v-for="item in boxData" :key="item.turnover_box_num">
            <p class="mb-xs mt-xs">周转箱：<span class="red bold-font">{{item.turnover_box_num}}</span> <span
                    class="ml-sm red" v-if="item.list.length > 0">{{item.message}}</span></p>
            <el-table :data="item.list" class="scroll-bar" max-height="550">
                <div class="t-center bold-font" slot="empty">{{item.message}}</div>
                <el-table-column
                        inline-template
                        width="100"
                        label="SKU">
                    <div>
                        {{row.sku}}
                    </div>
                </el-table-column>
                <el-table-column
                        width="60"
                        label="图片">
                    <template slot-scope="scope">
                        <div slot="reference">
                            <img :src="scope.row.thumb"
                                 v-if="scope.row.thumb"
                                 height="60px" width="60px"
                                 style="border:none">
                            <img src="/static/error-picture-128.png"
                                 v-else
                                 height="60px" width="60px"
                                 style="border:none">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="100"
                        label="名称">
                    <div>
                        {{row.spu_name}}
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        width="100"
                        label="数量">
                    <div>
                        {{row.quantity}}
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer">
            <request-button class="sure-button" type="default" :request="save">确定</request-button>
            <el-button ref="cancel" @click.native="visible = false" size="mini">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-single-picking {
        .el-dialog__body {
            padding-top: 10px;
            .single-picking-name {
                font-size: 16px;
            }
        }
        .sure-button {
            margin-right: 950px;
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                visible: false,
                newData: {}
            }
        },
        methods: {
            save() {
                this.$emit('save');
            },
            open() {
                this.$nextTick(() => {
                    this.$refs.cancel.$el.focus();
                });
            },
            close() {
                this.$emit('close');
            }
        },
        computed: {},
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value: {},
            action: {},
            boxData: {
                type: Array
            },
            user: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            uiTip: require('@/components/ui-tip').default,
        },
    }
</script>
