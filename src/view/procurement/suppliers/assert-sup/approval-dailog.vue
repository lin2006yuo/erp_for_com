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
                <request-button req-key="url_change_states" @click.native="add_cause" :mintime="200">确定</request-button>
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
    import {api_publish_add_discuss_record,url_publish_add_discuss_record,url_change_states} from '@/api/purchase';
    import {api_change_states,api_supplier_disable} from '@/api/assert-sup';
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
            url_publish_add_discuss_record,
            url_change_states
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
            add_cause(){
                if (this.content){
                    if (this.content.length>200){
                        return  this.$message({type:'warning',message:this.title+"不能超过200字"})
                    }
                    if (this.execute === 1) {
                        let data = {
                            deactivate_reason: this.content,
                            supplier_ids: this.approvalId
                        };
                        this.$http(api_supplier_disable, data).then(res => {

                            this.content = '';
                            if (res.data.length&&res.no_disable_supplier) {
                                this.$message({type: 'success', message: res.message || res});
                                setTimeout(()=>{
                                    this.$message({type: 'warning', message: res.message || res});
                                },100)
                            }else{
                                if (res.data.length) {
                                    this.$message({type: 'success', message: res.message || res});
                                }
                                if (res.no_disable_supplier) {
                                    this.$message({type: 'warning', message: res.message || res});
                                }
                            }
                            this.$emit('updata-data', res.data);
                            this.show = false;
                        }).catch(code => {
                            this.$message({
                                type: "error",
                                message: message || code
                            })
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('url_change_states', false);
                            }, 200);
                        });
                    } else {
                        //------------------------------------------------------审批不通过
                        if (this.content.length>200){
                            return  this.$message({type:'warning',message:this.title+"不能超过200字"})
                        }
                        this.$confirm(`此操作为审批不通过，确认此操作吗？`, "提示", {
                            cancelButtonText: '取消',
                            confirmButtonText: '确定',
                            type: 'warning'
                        }).then(() => {
                            let data = {
                                id: this.approvalId,
                                status: 3,
                                no_pass_reason: this.content,
                            };
                            this.$http(api_change_states, data).then(res => {
                                this.$message({
                                    type: "success",
                                    message: res.message || res
                                });
                                // --------关闭同级弹框并刷新数据
                                this.$emit('updata-search', this.show)
                                this.show = false;
                            }).catch(code => {
                                this.$message({
                                    type: "error",
                                    message: code.message || code
                                })
                            }).finally(() => {
                                setTimeout(() => {
                                    this.$reqKey('url_change_states', false);
                                }, 200);
                            })
                        }).catch(() => {
                            this.$message({type: "info", message: `已取消操作`})
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('url_change_states', false);
                            }, 200);
                        });
                    }
                } else {
                    this.$message({type:'warning',message:this.title+"不能为空"})
                }
            },
            close() {
                this.show = false;
            },
            keep() {
                this.show = false;
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
            approvalId:{
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
