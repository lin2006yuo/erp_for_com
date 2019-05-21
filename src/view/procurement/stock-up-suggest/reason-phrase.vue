<template>
    <page class="p-dialog-error-info-search">
        <page-dialog :title="title" v-model="show" size="large" :width="'40%'" @open="open"
                     :close-on-click-modal="true">
            <el-input
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 10}"
                :placeholder="playcehoder"
                v-model="content">
            </el-input>
            <el-row slot="footer" style="line-height: 27px;" class="dialog-footer">
                <request-button req-key="url_batch_develop_rejecet" @click.native="dismiss" :mintime="200">确定</request-button>
                <el-button size="mini" class="inline" @click.native="close">取消</el-button>
            </el-row>
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
        }
    }
</style>
<script>
    import {api_batch_develop_rejecet,url_batch_develop_rejecet} from '@/api/purchasing';
    import {api_change_states} from '@/api/assert-sup';
    export default {
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '蓝术术',
                createTime: '2018-10-18',
                updateTime: '2018-10-19'
            }
        },
        permission: {
            url_batch_develop_rejecet,
        },
        data() {
            return {
                content:'',
                show: this.value,
                checkedAll: false,
                tableData: [],
                firstLoading: true,
                loading: false,
                total: 0,
                page: 1,
                pageSize: 50,
            }
        },
        methods: {
            open() {
                this.content=''
            },
            dismiss(){
                this.$confirm(`此操作为驳回，确认此操作吗？`, "提示", {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.dismissRequest()
                }).catch((code) => {
                    console.log(code);
                    this.$message({type: "info", message: `已取消操作`})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_batch_develop_rejecet', false);
                    }, 200);
                });
            },
            close() {
                this.show = false;
            },
            keep() {
                this.show = false;
            },
            dismissRequest() {
                if (!this.content) {
                    this.$message({type: "warning", message: `请填写驳回内容`});
                    this.$reqKey('url_batch_develop_rejecet', false);
                } else {
                    if (this.content.length>200){
                        this.$message({type: "warning", message: `驳回内容不可超过200个字节`});
                        this.$reqKey('url_batch_develop_rejecet', false);
                        return
                    }
                    let data = {
                        review_list: this.addId,
                        type: this.execute,
                        remark: this.content,
                    };
                    this.$http(api_batch_develop_rejecet, data).then(res => {
                        this.$message({
                            type: "success",
                            message: res.message || res
                        });
                        this.show = false;
                        this.$emit('update-data', data.sku_ids);
                    }).catch(code => {
                        console.log(code)
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('url_batch_develop_rejecet', false);
                        }, 200);
                    })
                }
            }
        },
        filters: {

        },
        computed: {
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
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
        props: {
            value: {
                required: true,
                type: Boolean
            },
            addId:{
                required:true
            },
            playcehoder:{
                type:String
            },
            title:{
                required:true,
                type:String
            },
            execute:{}
        },
        components: {
            requestButton: require('@/global-components/request-button').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            searchCard: require('@/components/search-card').default,
            labelItem: require('@/components/label-item').default
        }
    }
</script>
