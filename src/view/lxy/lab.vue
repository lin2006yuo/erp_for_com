<template>
    <div>
        <h1>快递确认单</h1>
        <el-row>
            channel_id: <input type="text" v-model="deliverydata.channel_id">
            warehouse_id: <input type="text" v-model="deliverydata.warehouse_id">
            carrier_id: <input type="text" v-model="deliverydata.carrier_id">
            date_b: <input type="text" v-model="deliverydata.date_b">
            date_e: <input type="text" v-model="deliverydata.date_e">
            shipping_ids: <input type="text" v-model="deliverydata.shipping_ids">
            page: <input type="text" v-model="deliverydata.page">
            pageSize: <input type="text" v-model="deliverydata.pageSize">
        </el-row>
        <el-button @click="export_excel">导出汇总</el-button>
        <export-dialog v-model="visible"></export-dialog>
    </div>
</template>

<script>
    import {api_get_confirm,api_confirm_export,api_get_export_title,url_confirm_export,api_confirm_export_all,api_get_export_title_all} from '@/api/delivery-list';
    import {downloadFile} from '@/lib/http';
    export default {
        name: "lab",
        data() {
            return {
                visible: false,
                deliverydata: {
                    channel_id: 0,
                    warehouse_id: "",
                    carrier_id: '',
                    date_b: "",
                    date_e: datef('YYYY-MM-dd', Date.now() / 1000),
                    shipping_ids: "",
                    page: 1,
                    pageSize: 20
                }
            }
        },
        methods: {
            export_excel() {
                // channel_id: 0
                // warehouse_id:
                // carrier_id:
                // dateRange:
                // date_b:
                // date_e: 2019-01-12 14:30:11
                // shipping_ids:
                // page: 1
                // pageSize: 20
                // http://172.18.8.242/report/express-confirm/exports
                this.$http(api_confirm_export_all, this.deliverydata, {
                    contentType: 'application/x-www-form-urlencoded'
                }).then(res => {
                    //队列下载
                    if (res.join_queue === 1) {
                        this.visible = true;
                        this.$message({type: "success", message: res.message || res});
                        //直接下载
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.tableData.page,
                            pageSize: this.tableData.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            }
        },
        components: {
            exportDialog:require('./export-dialog.vue').default,
        }
    }
</script>

<style scoped>
    input {
        width: 120px;
    }
</style>
