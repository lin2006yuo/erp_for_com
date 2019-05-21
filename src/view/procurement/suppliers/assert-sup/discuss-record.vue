<template>
    <page class="p-dialog-error-info-search">
        <page-dialog :title="'洽谈记录'" v-model="show" size="large" :height="'90%'" @open="open"
                     :close-on-click-modal="true">
            <div class="mb-sm">
                <div>
                    <el-row>
                        <label class="ml-sm">供应商：{{recordData.company_name}}</label>
                    </el-row>
                </div>
                <el-row class="mt-xs">
                    <el-button size="mini" type="info" class="inline" @click.native="openRecord(1)">新增洽谈记录</el-button>
                </el-row>
                <el-table class="mt-sm"
                          border :data="tableData"
                          highlight-current-row
                          v-resize="{height:120}"
                          v-loading="loading"
                          @selection-change="selection_change"
                          element-loading-text="玩命加载中...">
                    <div slot="empty" class="no-data-reminder">
                        <i></i>
                        {{emptyText}}
                    </div>
                    <el-table-column label="洽谈人" min-width="50" inline-template>
                        <div class="p-table-list-td-text" :title="row.discuss_people_name||row.discuss_people_text">{{row.discuss_people_name||row.discuss_people_text}}</div>
                    </el-table-column>
                    <el-table-column label="洽谈日期" min-width="50" inline-template>
                        <times :time="row.discuss_time"></times>
                    </el-table-column>
                    <el-table-column label="洽谈详情" min-width="250" inline-template>
                        <ui-tip :content="row.content" :width="98"></ui-tip>
                    </el-table-column>
                    <el-table-column label="操作" min-width="50" inline-template>
                        <span title="点击可查看洽谈详情" class="operate" @click="openRecord(2,row.id)">查看详情</span>
                    </el-table-column>
                </el-table>
            </div>
            <el-row slot="footer" style="line-height: 27px;" class="dialog-footer">
                <el-pagination
                    class="inline"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
                <el-button size="mini" class="inline" @click.native="close">关 闭</el-button>
            </el-row>
        </page-dialog>
        <add-look-record v-model="editLookRecordDialog"
                         :title="editLookRecordTitle"
                         :look-edit-data="lookEditData"
                         :remove-expense-reimbursement-voucher="removeExpenseReimbursementVoucher"
                         :remove-scene-picture="removeScenePicture"
                         @update-discuss-data="update_discuss_data"
                         :is-add="look"
        ></add-look-record>
    </page>
</template>
<style lang="stylus">
    .p-dialog-error-info-search {
        .page-dialog .dialog__body {
            padding: 0 10px 5px 10px;
            color: #475669;
            font-size: 1.2rem;
            overflow-x: hidden;
            overflow-y: auto;
            box-sizing: border-box;
            height: 100%;
            max-height: 70%;
            .mt-sm {
                margin-bottom 60px;
                max--height: 520px;
            }
            .p-table-content{
                word-break: break-all;
            }
        }
    }
</style>
<script>
    import {api_supplier_discuss_record,api_supplier_discuss_record_id,api_add_discuss_record,url_supplier_discuss_record} from '../../../../api/assert-sup'
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
            url_supplier_discuss_record
        },
        data() {
            return {
                show: this.value,
                checkedAll: false,
                tableData: [],
                firstLoading: true,
                loading: false,
                lookEditData:{},
                look:false,
                total: 0,
                page: 1,
                pageSize: 50,
                editLookRecordTitle:'',
                editLookRecordDialog:false,
                removeScenePicture:[],
                removeExpenseReimbursementVoucher:[],
            }
        },
        methods: {
            open() {
                this.search();
            },
            selectable(row, index) {

                return !this.checkedall;
            },
            selection_change(val) {

            },
            search() {
                let data = {
                    page: this.page,
                    pageSize: this.pageSize,
                    supplier_id: this.recordData.supplier_id
                };
                this.loading = true;
                this.$http(api_supplier_discuss_record, data).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.search()
            },
            handleCurrentChange(val) {
                this.page = val;
                this.search();
            },
            close() {
                this.show = false;
            },
            openRecord(val,id) {
                if (val==1){
                    this.editLookRecordTitle='新增洽谈记录';
                    this.editLookRecordDialog=true;
                    this.look=false;
                    this.removeExpenseReimbursementVoucher=[];
                    this.removeScenePicture=[];
                    this.lookEditData={
                        supplier_id:this.recordData.supplier_id,
                        content:'',
                        discuss_time:'',
                        discuss_way:'',
                        make_project:[],
                        expense_reimbursement_voucher:[],
                        scene_picture:[],
                        other_discuss_way:'',
                        other_make_project:'',
                    }
                } else{
                    this.editLookRecordTitle='查看洽谈记录';
                    this.editLookRecordDialog=true;
                    this.look=true;
                    this.removeExpenseReimbursementVoucher=[];
                    this.removeScenePicture=[];
                    this.$http(api_supplier_discuss_record_id, id).then(res => {
                        this.lookEditData=res
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }

            },
            update_discuss_data(val){
                let updateData = window.clone(val);
                updateData.discuss_time = datef('YYYY-MM-dd', updateData.discuss_time / 1000)
                if (!!updateData.expense_reimbursement_voucher) {
                    updateData.expense_reimbursement_voucher = updateData.expense_reimbursement_voucher.map(row => {
                        return {
                            name: row.file.name,
                            size: row.file.size,
                            is_delete: row.path === '' && !!row.id,
                            id: row.id || '',
                            image: row.file.image
                        }
                    });
                }
                if (!!updateData.scene_picture) {
                    updateData.scene_picture = updateData.scene_picture.map(row => {
                        return {
                            name: row.file.name,
                            size: row.file.size,
                            is_delete: row.path === '' && !!row.id,
                            id: row.id || '',
                            image: row.file.image
                        }
                    });
                }
                this.$http(api_add_discuss_record,updateData).then(res => {
                    this.editLookRecordDialog=false;
                    this.$emit('update-change', res.data);
                    this.$message({type:'success',message:res.message});
                    this.total+=1;
                    this.tableData.push(res.data);
                    this.$reqKey('url_add_discuss_record', false);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_add_discuss_record', false);
                    }, 200);
                });

            }

        },
        filters: {
            filterNumber(val) {
                if (Number(val) > 0) {
                    return Number(val).toFixed(3);
                } else {
                    return '-- --';
                }
            },
            filterTrackingNumber(val) {
                return val === '' ? '-- --' : val;
            }
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
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            recordData: {
                required: true
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button').default,
            searchCard: require('@/components/search-card').default,
            labelItem: require('@/components/label-item').default,
            addLookRecord:require('./add-look-record').default
        }
    }
</script>
