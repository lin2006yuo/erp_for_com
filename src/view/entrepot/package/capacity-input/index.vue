<template>
    <page class="capacity-input">
            <el-card>
                <el-form
                    @keyup.enter.native="search"
                    ref="searchForm"
                    :model="searchData"
                    :rules="formRules"
                    <!--label-width="80px">-->
                    <!--<el-form-item label="仓库：" prop="warehouse_id">-->
                        <!--<select-remote-->
                            <!--class="width-md"-->
                            <!--v-model="searchData.warehouse_id"-->
                            <!--:remote="get_warehouse"-->
                            <!--:clearable="false" :all="false"-->
                        <!--&gt;</select-remote>-->
                    <!--</el-form-item>-->
                    <el-row>
                        <el-form-item label="贴标人：" class="inline" prop="operator_id">
                            <select-remote
                                class="width-md"
                                placeholder="请先选择仓库"
                                v-model="searchData.operator_id"
                                :remote="get_operatorlist"
                                :clearable="false" :all="false"
                            ></select-remote>
                        </el-form-item>
                        <el-form-item label="贴标日期：" class="inline">
                            <el-date-picker
                                v-model="searchData.label_date"
                                type="date"
                                class="width-sm"
                                placeholder="选择日期"
                                :picker-options="pickerOptions"
                                format="yyyy-MM-dd"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-row>
                    <el-row>
                            <el-form-item class="inline" label="来源单号：" prop="source_id">
                                <el-input ref="input" class="width-super" v-model="searchData.source_id"></el-input>
                            </el-form-item>
                            <span class="error" v-show="showError">系统没有此单号</span>
                            <el-button type="primary" size="mini" class="submit-btn" @click="submit">提交</el-button>
                    </el-row>
                </el-form>
            </el-card>
        <div class="split">录入记录</div>
        <table-module
            :search-data.sync="searchData"
            :table-columns="columnList"
            :table-data="tableData"
            :total="count"
            :loading="loading"
            :row-key="(row) => row.source_id"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
        ></table-module>
    </page>
</template>
<script>
    import { api_checkinfo,  api_postinfo, api_operator } from '@/api/capacity-input'
    import * as store from '@/lib/localStorage'
    import _ from  'lodash'


    const STORAGEKEY = 'capacity_input_record'
    const ERROR_NONE = '查询不到数据'
    const ERROR_REPEAT = '已经扫描过该标签'
    export default {
        page:{
            devinfo:{
                frontEnd:'林学裕',
                backEnd:'黄伟杰',
                createTime:'2019-2-28',
                updateTime:'2019-2-28'
            }
        },
        data() {
            return {
                searchData: {
                    operator_id: '',
                    label_date: datef('YYYY-MM-dd', Date.now() / 1000 ),
                    source_id: '',
                    pageSize: 50,
                    page: 1
                },
                operatorList: [],
                totalData: [],
                loading: false,
                showError: false,
                pickerOptions: {
                    disabledDate: time => {
                        return time > Date.now()
                    }
                },
                formRules: {
                    operator_id: [
                        {required: true, message: '请选择贴标人', trigger: 'change', type: 'number'}
                    ],
                    source_id: [
                        {required: true, message: '请填写来源单号', trigger: 'blur'}
                    ]
                },
                columnList: [
                    { label: '仓库', value: 'warehouse_name' },
                    { label: '贴标人', value: 'label_user_name' },
                    { label: '贴标日期', value: 'label_date' },
                    { label: '来源单号', value: 'source_id' },
                    { label: 'SKU', value: 'sku' },
                    { label: '数量', value: 'num' },
                ],
            }
        },
        mounted() {
            this.totalData = store.getItem(STORAGEKEY, [])
        },
        computed: {
            count() {
                return this.totalData.length
            },
            tableData() {
                const { page, pageSize } = this.searchData
                const start = (page - 1) * pageSize;
                const end = page * pageSize;
                return this.totalData.slice(start, end);
            }
        },
        methods: {
             search() {
                this.$refs.searchForm.validate( async valid => {
                    if(valid) {
                        try {
                            const { source_id } = this.searchData
                            const result = await this.$http(api_checkinfo,source_id)
                            const data = this.get_params(result)
                            this.totalData.unshift(data)
                            store.setItem(STORAGEKEY, this.totalData)
                        } catch (ex) {
                            if(ex.message === ERROR_NONE) {this.showError = true}
                            else if(ex.message === ERROR_REPEAT) { this.$message({ type: 'warning', message: '已经录入过此单号' }) }
                            else { console.log(ex) }
                        }
                    } else {
                        return false
                    }
                })
            },
            submit() {
                const params = store.getItem(STORAGEKEY)
                    if(!store.getItem(STORAGEKEY)) return this.$message({ type: 'warning', message: '没有录入记录，请录入信息' })
                    this.$http(api_postinfo, {statistics: params}).then(({ status }) => {
                        if(status === 1) {
                            this.$message({ type: 'success', message: '提交成功' })
                            store.delItem(STORAGEKEY)
                            this.totalData = []
                        } else {
                            this.$message({ type: 'error', message: '提交失败' })
                        }
                    }).catch(error => {
                        console.log(error)
                        this.$message({ type: 'error', message: '已经录入过此单号' })
                    })
            },
            get_params({ sku, num,  warehouse_name, warehouse_id}) {
                const { operator_id: label_user_id} = this.searchData
                const { label: label_user_name } = _.find(this.operatorList, { value: this.searchData.operator_id })
                const data = {
                    //拿到searchData里面source_id, label_data,然后对label_date格式化
                    ..._.set(_.pick(this.searchData, ['source_id', 'label_date']), 'label_date', datef('YYYY-MM-dd' ,+new Date(this.searchData.label_date) / 1000 )),
                    sku,
                    num,
                    label_user_id,
                    label_user_name,
                    warehouse_name,
                    warehouse_id
                }
                return data
            },
            get_operatorlist(callback) {
                this.$http(api_operator).then(res => {
                    const operatorList = res.map(r => ({ label: r.realname, value: r.id }))
                    this.operatorList = operatorList
                    callback(operatorList)
                })
            },
            handle_size_change(val) {
                this.searchData.pageSize = val
            },
            handle_current_change(val) {
                this.searchData.page = val
            },
            input_focus() {
                this.$refs.input.$el.querySelector('input').focus();
            },
            hideError() {
                 this.showError = false
            }
        },
        watch: {
            'searchData.source_id'() {
                this.hideError()
            },
            'searchData.operator_id'() {
                this.input_focus()
                this.hideError()
            },
            'searchData.label_date'() {
                this.input_focus()
                this.hideError()
            },

        },
        components: {
            selectRemote: require('@/components/select-remote.vue').default,
            tableModule: require('./table-module').default
        }
    }
</script>
<style lang="stylus" scoped>
    .capacity-input {
        .split {
            font-weight: bold;
            margin: 5px 0 ;
            font-size: 14px;
        }
        .info {
            display: inline-block;
            margin-bottom: 12px;
            vertical-align: middle
            color: #9e9e9e;
            margin-left: 10px;
        }
        >>> .el-table th > .cell {
            line-height 27px
        }
        .error {
            display: inline-block;
            margin-bottom: 12px;
            vertical-align: middle
        }
        .submit-btn {
            float: right;
            vertical-align: top;
            margin-right: 64%;
            padding: 6px 30px;
        }
    }
</style>
