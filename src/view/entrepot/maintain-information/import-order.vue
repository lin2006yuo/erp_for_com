<template>
    <page-dialog class="p-dialog-import-order" title="导入手工订单" @open="open" v-model="dialog"
                 size="full" :close-on-click-modal="false">
        <el-button
            class="ml-sm mt-sm"
            type="primary"
            size="mini"
            v-for="item in buttons"
            :key="item.label"
            @click.native="cur_click(item)"
            :disabled="disabled(item)"
        >{{item.label}}</el-button>

        <el-table class="mt-sm"
            :data="tableData"
            ref="table"
            @selection-change="handle_select_change"
            @row-click="handle_row_click"
        >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="包裹号" prop="number"></el-table-column>
            <el-table-column label="物流商称重" prop="providers_weight"></el-table-column>
            <el-table-column label="物流商运费" prop="providers_fee"></el-table-column>
            <el-table-column label="物流商实际运费币种" prop="providers_currency_code"></el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
            <request-button @click.native="submit" req-key="click_native_keep">确认导入</request-button>
            <el-button size="mini" @click.native="dialog=false">关 闭</el-button>
        </div>
        <import-file v-model="addEvent"
            :submit-url="submitUrl"
            @download-file="download_file"
            @files-data="change_table"></import-file>
    </page-dialog>
</template>
<style lang="stylus">
    .el-message-box {
        width: 630px !important;
        max-height 90% !important;
        overflow-y scroll !important;
    }
</style>
<script>
    import {api_import, api_import_save} from '@/api/package-carriers';
    import {downloadFile} from '@/lib/http';
    import _ from 'lodash'
    // import {add_order,api_get_channel,api_get_account,api_get_country,api_get_warehouse } from '@/api/handwork';
    export default {
        data() {
            return {
                submitUrl:api_import,
                dialog: this.value,
                params:{},
                curChannel:"",
                buttons:[
                    {label:"添加",value:"add_tian"},
                    {label:"删除",value:"delete_shan"},
                ],
                addEvent:false,
                options: [],
                tableData:[],
                selectOptions:[],
            }
        },
        methods: {
            open(){
                // this.tableData = [];
            },
            download_file(){//下载模板
                let url = config.apiHost+'downfile';
                let code={
                    code:'packageCarrier'
                };
                downloadFile({
                    url:url,
                    get:code,
                    fileName:'下载模板',
                    suffix:'.xls',
                })
            },
            disabled(val){
                if(val.value==='delete_shan'){
                    if(this.tableData.length>0){
                        return false;
                    }
                    return true;
                }
            },
            change_table(val){
                this.tableData = val;
                this.tableData.forEach(row=>{
                    this.$set(row,'isRed',false);
                })
            },
            // 确认导入
            submit(){
                if(this.selectOptions.length <= 0) return this.$message({type: 'warning', message: '请选择要到导出的记录'})
                this.$http(api_import_save, {data: this.selectOptions})
            },



            handle_select_change(val){
                this.selectOptions = val;
            },
            handle_row_click(row) {
                this.$refs.table.toggleRowSelection(row)
            },
            cur_click(item){
                switch (item.value){
                    case "add_tian":
                            this.addEvent = true;
                        break;
                    case "delete_shan":
                        this.$confirm('此操作将删除该选项, 是否继续?', '提示').then(() => {
                            const retTabel = _.pullAllBy(this.tableData, this.selectOptions, 'number');
                            this.$set(this.tableData, retTabel)
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });
                        }).catch();
                        break;
                }
            },
        },
        computed: {
            
        },
        watch: {
            dialog(val) {
                this.$reqKey('click_native_keep',false);
                this.$emit('input', val);
            },

            value(val) {
                this.dialog = val;
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            labelSelect:require('@/components/label-select.vue').default,
            // dataTable:require('./select-table.vue').default,
            importFile:require('@/components/import-file.vue').default,
        }
    }
</script>
