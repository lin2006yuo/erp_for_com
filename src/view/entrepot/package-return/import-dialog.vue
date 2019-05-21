<template>
    <page-dialog class="p-dialog-import-order"
                 title="导入包裹退回"
                 @open="open"
                 v-model="dialog"
                 size="large"
                 :close-on-click-modal="false">
        <el-button
                class="ml-sm mt-sm"
                type="primary"
                size="mini"
                v-for="item in buttons"
                :key="item.label"
                @click.native="cur_click(item)"
                :disabled="disabled(item)">{{item.label}}</el-button>
        <import-file v-model="addEvent"
                     :submit-url="submitUrl"
                     @download-file="download_file"
                     @files-data="change_table"></import-file>

        <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="importData"
                height="400"
                border
                highlight-current-row
                @selection-change="select_change">
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column label="退回类型" inline-template>
                <div>
                    <ui-tip :content="row.reason_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="面单" inline-template>
                <div>
                    <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>
                    <ui-tip :content="row.status_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="邮寄方式" inline-template v-if="false">
                <div>
                    <ui-tip :content="row.rate_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
            <request-button @click.native="submit" req-key="click_native_keep">确认导入</request-button>
            <el-button size="mini" @click.native="dialog = false">关 闭</el-button>
        </div>
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
    import {api_package_return_save_import,api_package_return_import} from '@/api/package-return';
    import {downloadFile} from '@/lib/http';
    export default {
        data() {
            return {
                importData: [],
                submitUrl: api_package_return_import,
                dialog: this.value,
                buttons:[
                    {label:"添加",value:"add_item"},
                    {label:"删除",value:"delete_item"},
                ],
                addEvent:false,
                checkData: []
            }
        },
        computed:{

        },
        methods: {
            open(){
                this.importData = []
            },
            download_file(){//下载模板
                let url = config.apiHost+'downfile';
                let code={
                    code:'package_return'
                };
                downloadFile({
                    url:url,
                    get:code,
                    fileName:'下载模板',
                    suffix:'.xls',
                })
            },
            disabled(val){
                if(val.value==='delete_item'){
                    if(this.importData.length > 0 && this.checkData.length > 0){
                        return false;
                    }
                    return true;
                }
            },
            change_table(val){
                if(this.importData.length === 0){
                    this.importData = val;
                }else{
                    let numberArr = this.importData.map(row => row.shipping_number);
                    let arr = val.filter(row => {
                        return !numberArr.includes(row.shipping_number)
                    });
                    this.importData.push(...arr);
                }
            },
            select_change(val){
                this.checkData = val
            },
            // 确认导入
            submit(){
                if(this.importData.length === 0){
                    this.$message({type: 'warning', message: '请添加数据后再导入'});
                    return
                }
                this.$http(api_package_return_save_import, {data: this.importData}).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.$emit('batch-import')
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            cur_click(item){
                switch (item.value){
                    case "add_item":
                        this.addEvent = true;
                        break;
                    case "delete_item":
                        this.$confirm('此操作将删除选中选项, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.checkData.forEach(row => {
                                let index = this.importData.findIndex(item => item.shipping_number === row.shipping_number);
                                if(index > -1){
                                    this.importData.splice(index, 1)
                                }
                            });
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除！'
                            });
                        });
                        break;
                }
            },
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
            importFile:require('@/components/import-file.vue').default,
            uiTip:require('@/components/ui-tip').default
        }
    }
</script>
