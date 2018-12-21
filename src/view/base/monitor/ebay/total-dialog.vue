<template>
    <page class="p-dialog">
        <page-dialog
                :title="viewDialogShow?'查看与编辑':'批量设置监控值'"
                v-model="totalDialogShow"
                size="small"
                :close-on-click-modal="false"
                @close="close"
                @open="open(currentData)">
            <h4 v-if="viewDialogShow">
                <span>ebay账号:{{ currentData.account_name }}</span>
                <span class="ml-sm">账号简称:{{ currentData.code}}</span>
            </h4>

            <el-table
                :data="tableData_.curTableData"
                class="mb-sm">
                <el-table-column :label="viewDialogShow?`当前级别:${currentData.current_seller_level}`:'当前级别'" align="left">
                    <el-table-column
                            prop="date"
                            label="">
                    </el-table-column>
                    <el-table-column
                            width="120"
                            label="分数"
                            v-if="viewDialogShow">
                        <template slot-scope="scope">
                            <span>{{ scope.row.grade }}</span>
                            <span v-if="scope.row.type!=='c_transactions'&&scope.row.type!=='c_sales'">%</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="监控值">
                        <template slot-scope="scope">
                            <div class="center">
                                <span>>=</span>
                                <el-input-number
                                        class="s-width-mini ml-sm mr-sm"
                                        :controls="false"
                                        v-model="scope.row.name"
                                        :max="100"
                                        :min="0"
                                        v-if="scope.row.type!=='c_transactions'&&scope.row.type!=='c_sales'"></el-input-number>
                                <el-input-number class="s-width-mini ml-sm mr-sm" :controls="false" v-model="scope.row.name" v-else></el-input-number>
                                <span v-if="scope.row.type!=='c_transactions'&&scope.row.type!=='c_sales'">%</span>
                                <span v-else style="visibility: hidden">%</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>

            <el-table
                :data="tableData_.evaTableData">
                <el-table-column :label="viewDialogShow?`按今日统计级别:${currentData.today_level}`:'按今日统计级别'" align="left">
                    <el-table-column
                            prop="date"
                            label="">
                    </el-table-column>
                    <el-table-column
                            width="120"
                            label="分数"
                            v-if="viewDialogShow">
                        <template slot-scope="scope">
                            <span>{{ scope.row.grade }}</span>
                            <span v-if="scope.row.type!=='t_transactions'&&scope.row.type!=='t_sales'">%</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="监控值">
                        <template slot-scope="scope">
                            <div class="center">
                                <span>>=</span>
                                <el-input-number
                                        class="s-width-mini ml-sm mr-sm"
                                        :controls="false"
                                        v-model="scope.row.name"
                                        :max="100"
                                        :min="0"
                                        v-if="scope.row.type!=='t_transactions'&&scope.row.type!=='t_sales'"></el-input-number>
                                <el-input-number class="s-width-mini ml-sm mr-sm" :controls="false" v-model="scope.row.name" v-else></el-input-number>
                                <span v-if="scope.row.type!=='t_transactions'&&scope.row.type!=='t_sales'">%</span>
                                <span v-else style="visibility: hidden">%</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>

            <el-table
                :data="tableData_.reTableData">
                <el-table-column
                        prop="date"
                        label="">
                </el-table-column>
                <el-table-column
                        width="120"
                        label="分数"
                        v-if="viewDialogShow">
                    <template slot-scope="scope">
                        <span>{{ scope.row.grade }}%</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="监控值">
                    <template slot-scope="scope">
                        <div class="center">
                            <span>>=</span>
                            <el-input-number
                                    class="s-width-mini ml-sm mr-sm"
                                    :controls="false"
                                    v-model="scope.row.name"
                                    :max="100" :min="0"></el-input-number>
                            <span class="">%</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                小提示：“监控值”留0，表示该项不列入监控范围。
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click.native="get_shift(tableData_)">确定</el-button>
                <el-button size="mini" @click.native="totalDialogShow = false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus" scoped>
    .center{
        display: flex;
        justify-content: center;
    }
</style>
<script>
    export default {
        name: "total-dialog",
        data(){
          return {
              totalDialogShow: this.value,
              tableData_: {
                  //----------------当前级别
                  curTableData: [
                      {
                          date: "当前不良交易率",
                          grade: '',
                          type: 'c_transaction_defect_rate',
                          name: ''
                      },
                      {
                          date: "当前运输超期率",
                          grade: '',
                          type: 'c_late_shipment_rate',
                          name: ''
                      },
                      {
                          date: "当前纠纷未解决关闭率",
                          grade: '',
                          type: 'c_case_closed_noresolve',
                          name: ''
                      },
                      {
                          date: "当前交易量",
                          grade: '',
                          type: 'c_transactions',
                          name: ''
                      },
                      {
                          date: "当前销售额",
                          grade: '',
                          type: 'c_sales',
                          name: ''
                      }
                  ],
                  //----------------按今日统计级别
                  evaTableData: [
                      {
                          date: "按今日统计不良交易率",
                          grade: '',
                          type: 't_transaction_defect_rate',
                          name: ''
                      },
                      {
                          date: "按今日统计运输超期率",
                          grade: '',
                          type: 't_late_shipment_rate',
                          name: ''
                      },
                      {
                          date: "按今日统计纠纷未解决关闭率",
                          grade: '',
                          type: 't_case_closed_noresolve',
                          name: ''
                      },
                      {
                          date: "按今日统计交易量",
                          grade: '',
                          type: 't_transactions',
                          name: ''
                      },
                      {
                          date: "按今日统计销售额",
                          grade: '',
                          type: 't_sales',
                          name: ''
                      }
                  ],
                  //----------------退货率
                  reTableData: [
                      {
                          date: "退货率",
                          grade: '',
                          type: 'return_rate',
                          name: ''
                      }
                  ]
              }
          }
        },
        methods: {
            open(obj){//---dialog打开时的回调
                for(let key in this.tableData_){
                    this.tableData_[key].forEach(row => {
                        if(this.viewDialogShow&&obj[row.type]){
                            row.grade = obj[row.type];
                            row.name = obj.goal[row.type]
                        }else{
                            return row.name = ''
                        }
                    })
                }
                // if(this.viewDialogShow){
                //     for(let key in this.tableData_){
                //         this.tableData_[key].forEach(row => {
                //             if(obj[row.type]){
                //                 row.grade = obj[row.type];
                //                 row.name = obj.goal[row.type]
                //             }
                //         })
                //     }
                // }else{
                //     for(let key in this.tableData_){
                //         this.tableData_[key].forEach(row => row.name = '')
                //     }
                // }
            },
            close(){//---dialog关闭时的回调
                if(!this.viewDialogShow) {
                    for(let key in this.tableData_){
                        this.tableData_[key].forEach(row => row.name = '')
                    }
                }
            },
            get_shift(val){//------确定
                if(this.viewDialogShow){
                    this.$emit('update',val)
                }else{
                    this.$emit('batch-set',val)
                }
            },
        },
        watch: {
            value(val){
                this.totalDialogShow = val;
            },
            totalDialogShow(val){
                this.$emit('input',val);
            }
        },
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            currentData: {
                type: Object
            },
            viewDialogShow:{
                type: Boolean
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default
        }
    }
</script>