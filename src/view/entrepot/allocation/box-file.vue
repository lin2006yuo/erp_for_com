<template>
    <page-dialog v-model="visible" @open="open" @close="close" :title="trendAction.title">
        <div>
            <h3 class="t-left">商品条码附件(仅销售)：</h3>
            <el-row v-if="barcode_list">
                <el-col :span="20">
                    <el-tag class="mr-xs mb-xs"
                            type="primary"
                            v-for="(file, index) in barcode_list"
                            :key="index">{{file.name}}
                    </el-tag>
                </el-col>
                <!--<el-col :span="4">
                    <el-button type="primary" size="mini" @click="upload_file('barcode_list')">重新上传</el-button>
                </el-col>-->
                <el-col :span="4">
                    <el-button  type="primary" size="mini" @click="barcode_file">导出</el-button>
                </el-col>
            </el-row>
        </div>
        <div>
            <h3 class="t-left">仓库箱单附件(仅仓库)：</h3>
            <el-button v-if="!box_list"
                       type="primary" size="middle" @click="upload_file('box_list')">上传附件
            </el-button>
            <el-row v-else>
                <el-col :span="20">
                    <el-tag type="primary">{{box_list.name}}
                    </el-tag>
                </el-col>
                <!--<el-col :span="4">
                    <el-button type="primary" size="mini" @click="upload_file('box_list')">重新上传</el-button>
                </el-col>-->
                <el-col :span="4">
                    <el-button type="primary" size="mini" @click="download_file">导出</el-button>
                </el-col>
            </el-row>
        </div>
        <div>
            <h3 class="t-left">箱唛附件(仅销售)：</h3>
            <el-button v-if="box_title.length === 0" type="primary" size="middle"
                       :disabled="!box_list" @click="upload_title('box_title')">上传附件
            </el-button>
            <el-row v-else>
                <el-col :span="20">
                    <el-tag class="mr-xs mb-xs"
                            type="primary"
                            v-for="(file, index) in box_title"
                            :key="index">{{file.name}}
                    </el-tag>
                </el-col>
                <!--<el-col :span="4">
                    <el-button type="primary" size="mini" @click="upload_title('box_title')">上传附件</el-button>
                </el-col>-->
                <el-col :span="4">
                    <el-button type="primary" size="mini" @click="download_titles">导出</el-button>
                </el-col>
            </el-row>
        </div>
        <div>
            <h3 class="t-left">其他附件(公用)：</h3>
            <el-button v-if="other_title.length === 0" type="primary" size="middle"
                       :disabled="!other_title" @click="upload_title('other_title')">上传附件
            </el-button>
            <el-row v-else>
                <el-col :span="20">
                    <el-tag class="mr-xs mb-xs"
                            type="primary"
                            v-for="(file, index) in other_title"
                            :key="index">{{file.name}}
                    </el-tag>
                </el-col>
                <!--<el-col :span="4">
                    <el-button type="primary" size="mini" @click="upload_title('other_title')">上传附件</el-button>
                </el-col>-->
                <el-col :span="4">
                    <el-button type="primary" size="mini" @click="download_other">导出</el-button>
                </el-col>
            </el-row>
        </div>
        <div slot="footer">
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
        <importFile v-model="importVisible"
                    :import-action="importAction"
                    @search="init"
                    @upload="upload"></importFile>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {downloadFile} from '@/lib/http';
    import {api_get_allocation_attachment, api_delete_allocation_attachment} from "@/api/transfer-plan";

    export default {
        data() {
            return {
                visible: false,
                barcode_list: [],
                box_list: "",
                box_title: [],
                other_title: [],
                importVisible: false,
                importAction: {},
                file: 'download',
                actionList: {
                    barcode_list: {
                        title: '商品条码上传',
                        isMultiple: false,
                        accept: '.pdf',
                        type: 3,
                        isPDF: true,
                    },
                    box_list: {
                        title: '箱唛清单上传',
                        isMultiple: false,
                        accept: '.xls,.xlsx',
                        type: 1,
                        isPDF: 'Excel',
                    },
                    box_title: {
                        title: '箱唛标签上传',
                        isMultiple: true,
                        accept: '.pdf',
                        isPDF: 'PDF',
                        type: 2,
                    },
                    other_title: {
                        title: '其它附件上传',
                        isMultiple: true,
                        accept: '',
                        isPDF: '',
                        type: 4,
                    }
                }
            }
        },
        methods: {
            open() {
                this.init();
            },
            init() {
                this.$http(api_get_allocation_attachment, this.trendAction.id).then(res => {
                    this.box_list = res.packing_list_attachment;
                    this.box_title = res.shipping_mark_attachment;
                    this.barcode_list = res.goods_barcode_attachment;
                    this.other_title = res.other_attachment;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            sure() {

            },
            close() {
                this.importAction = {};
                this.box_list = "";
                this.box_title = [];
                this.importVisible = false;
            },
            upload(type, data) {
                this.box_list = data.packing_list_attachment;
                this.box_title = data.shipping_mark_attachment;
                this.barcode_list = data.goods_barcode_attachment;
                this.other_title = data.other_attachment;
            },
            upload_file(key) {
                this.importVisible = true;
                this.importAction = this.actionList[key];
                this.$set(this.importAction, 'id', this.trendAction.id);
            },
            upload_title(key) {
                this.importVisible = true;
                this.importAction = this.actionList[key];
                this.$set(this.importAction, 'id', this.trendAction.id);
            },
            barcode_file() {
                let url = `${config.apiHost}allocation/attachment`;
                this.barcode_list.forEach(title => {
                    downloadFile({
                        url: url,
                        get: {full_name: title.path},
                        fileName: title.name,
                        suffix: '',
                    });
                });
            },
            download_file() {
                let url = `${config.apiHost}allocation/attachment`;
                downloadFile({
                    url: url,
                    get: {full_name: this.box_list.path},
                    fileName: this.box_list.name,
                    suffix: '',
                });
            },
            download_other() {
                let url = `${config.apiHost}allocation/attachment`;
                this.other_title.forEach(title => {
                    downloadFile({
                        url: url,
                        get: {full_name: title.path},
                        fileName: title.name,
                        suffix: '',
                    });
                });
            },
            download_titles() {
                let url = `${config.apiHost}allocation/attachment`;
                this.box_title.forEach(title => {
                    downloadFile({
                        url: url,
                        get: {full_name: title.path},
                        fileName: title.name,
                        suffix: '',
                    });
                });
            },
            box_close(type, title) {
                this.$confirm(`你将删除文件${title.name},确认此操作吗？`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_allocation_attachment, this.trendAction.id, {
                        path_name: title.path,
                        type: type,
                    }).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        let index = 0;
                        switch (type) {
                            case 1:
                                this.box_list = "";
                            case 2:
                                index = this.box_title.findIndex(row => row.name === title.name);
                                this.box_title.splice(index, 1);
                            case 3:
                                this.barcode_list =  []
                            case 4:
                                index = this.box_title.findIndex(row => row.name === title.name);
                                this.box_title.splice(index, 1);
                        }
                        if (type === 1) {
                            this.box_list = "";
                        } else {
                        }
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                    })
                });
            },
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            trendAction: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            importFile: require('./import-file.vue').default,
        }
    }
</script>