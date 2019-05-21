<template>
    <page>
        <search-module :search-data="searchData"
                       :clears="clears"
                       :status-btn="statusBtn"
                       :type-btn="typeBtn"
                       @search="search"
                       @enter="search"
                       @select-type="select_type"
                       @select-status="select_status"></search-module>
        <div class="mb-xs mt-xs ml-sm">
            <el-button type="primary" @click.native="add_but" size="mini">添加</el-button>
        </div>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @edit-item="edit_item"
                      @release-version="release_version"
                      @historical-record="historical_record"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @handle-selection-change="handle_selection_change"></table-module>
        <add-module v-model="addDialog"
                    @add="add"
                    :title="title"
                    :uploadShow="uploadShow"
                    :process="process"
                    :form-data="formData"
                    :type-options="typeOptions"
                    :software-list="softwareList"
                    :edit-code="editCode"></add-module>
        <files-module v-model="uploadFiles" :type-options="typeOptions"
                      :uploadShow="uploadShow"
                      :process="process"
                      :title="title" :add-data="addData" @release="add" :software-list="softwareList"></files-module>
        <history-module v-model="historyList" :history-data="historyData" :title="title" :loading="loading"></history-module>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_get_software_list,api_get_software_type,api_post_add_form,api_get_software_version,api_get_software_edit,
        api_upload_software,
        api_post_software_version,
        api_put_software} from '../../../api/software-management';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '李佰敏',
                createdTime: '2018-12-14',
                updateTime: '2018-12-14'
            }
        },
        data() {
            return {
                searchData: {
                    page: 1,
                    pageSize: 20,
                },
                software_type: '',
                status: '',
                clears: {},
                statusBtn: [//状态
                    {label: '全部', value: ''},
                    {label: '已启用', value: 0},
                    {label: '已停用', value: 1},
                ],
                typeBtn: [],
                typeOptions: [],
                loading: false,
                firstLoading: true,
                tableData: [],
                addDialog: false,
                uploadFiles: false,
                historyList: false,
                addData: {},
                historyData: [],
                title: '',
                softwareList: [],
                formData: {},
                editCode: true,
                blockSize: 1024 * 1024,  // 1m
                bucket:-1,
                total: 0,
                uploadShow:false,  // 控制文件上传的进度显示。
                process:"0%",
                flag:'',   // 用来标记是发布 or 新增
            }
        },
        mounted() {
            this.init();
            this.get_type()
        },
        methods: {
            init() {
                this.loading = true;
                let data = clone(this.searchData);
                if (this.status !== '') {
                    this.$set(data, 'status', this.status)
                }
                if (this.software_type !== '') {
                    this.$set(data, 'run_environment', this.software_type)
                }
                this.$http(api_get_software_list, data).then(res => {
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            search() {
                this.init();
            },
            //添加
            add_but() {
                this.addDialog = true;
                this.editCode = true;
                this.title = '上传文件';
                this.formData = {
                    version: '',
                    run_environment: '',
                    upgrade_address: '',
                    remark: '',
                    md5: '',
                    status: 0,
                    file: '',
                    code: '',
                    software_name: '',
                }
            },
            //编辑
            edit_item(row) {
                this.$http(api_get_software_edit, row.id).then(res => {
                    this.formData = {
                        version: res.data.version,
                        run_environment: res.data.run_environment,
                        upgrade_address: res.data.upgrade_address,
                        remark: res.data.remark,
                        md5: res.data.md5,
                        status: res.data.status,
                        file: res.data.file,
                        code: res.data.code,
                        software_name: res.data.software_name,
                        id: row.id
                    };
                    this.title = `编辑软件名：${row.software_name+res.data.version} 信息`;
                    this.addDialog = true;
                    this.editCode = false;
                })
            },
            /** 提交 - 分成三种情况，1. 新增上传 2. 编辑修改上传文件 3. 编辑不修改上传文件 */
            add(row, flag) {
                debugger;
                if (row.file instanceof Array) {
                    let file = row.file[0];
                    this.uploadShow = true;
                    this.bucket = -1;
                    this.process = "0%";
                    this.flag = flag;  // 确认是  发布 or 发布新增。
                    // 先上传文件，之后在上传其它内容。
                    this.getSize(file);
                    this.addEditParams = row;
                } else {
                    // 编辑不修改上传的文件。
                    let params = {...row, upgrade_address: row.file};
                    delete params.file;
                    this.eitSubmit(row.id, params);
                }
            },
            /** 新增提交文件 */
            addSubmit(params) {
                this.$http(api_post_add_form, params).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.addDialog = false;
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            /** 编辑提交文件 */
            eitSubmit(id, params) {
                this.$http(api_put_software, id, params).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.addDialog = false;
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            /** 发布请求 */
            release(id, params) {
                this.$http(api_post_software_version, id, params).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.uploadFiles = false;
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            /** 在table中得到发布管理的细节 */
            release_version(row) {
                this.$http(api_get_software_edit, row.id).then(res => {
                    this.addData = {
                        version: '',
                        run_environment: res.data.run_environment,
                        upgrade_address: '',
                        remark: '',
                        md5: '',
                        status: res.data.status,
                        file: '',
                        code: res.data.code,
                        software_name: res.data.software_name,
                        id: row.id
                    };
                    this.title = `软件名：${row.software_name} 发布新版本`;
                    this.uploadFiles = true;
                });
            },
            //历史记录
            historical_record(row) {
                this.loading = true;
                this.title = `软件名：${row.software_name} 发布版本的历史记录`;
                this.$http(api_get_software_version, row.id).then(res => {
                    this.historyList = true;
                    this.historyData = res;
                    this.loading = false;
                });
            },
            //切换状态
            select_status(val) {
                this.status = val;
                this.init()
            },
            //切换类型
            select_type(val) {
                this.software_type = val;
                this.init()
            },
            //获取类型
            get_type() {
                this.$http(api_get_software_type).then(res => {
                    this.typeBtn = [{label: '全部', value: ''}, ...res.run_environment];
                    this.typeOptions = res.run_environment;
                    this.softwareList = res.software_name;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            handle_selection_change() {

            },
            /** 不是真的md5值。 */
            getMd5() {
                return ((Math.random()) * (Math.random()) * 100000).toFixed(0) + "";
            },
            /** 得到初始值 */
            getSize(file) {
                this.totalConent= file.file;
                this.total = Math.ceil(file.size / this.blockSize);  // 总块数。
                this.params = {
                    bucket: -1,
                    total: this.total,
                    file_name:file.name,
                    content:"",
                    unique_code: this.getMd5(),
                };
                this.bucket = 0;
            },
            /** 上传文件 */
            uploadFile() {
                let header = {
                   "contentType":"multipart/form-data"
                };
                this.$http(api_upload_software, this.params, header).then(res => {
                    // 分段上传成功，且知道当前的进度。
                    if (res.status === 1 && this.bucket < this.total - 1) {
                        this.process = res.percent + "%";
                        this.bucket++;
                    } else if (res.status === 0 && this.bucket === this.total -1) {
                       //  拿到文件上传的路径之后，作内容提交。
                       this.process = res.percent + "%";
                       this.uploadShow = false;   // 这里没有暂停项---和文件一起提交的就没有暂停项。
                       this.process = "0%";
                       delete this.addEditParams.file;
                       let params = {...this.addEditParams, upgrade_address:res.path};
                       /** 上传完成文件之后进行提交  分三种提交 新增 / 编辑 / 发布 */
                       if (this.flag === "add") {
                           if (this.addEditParams.id) {
                               // 编辑提交
                               this.eitSubmit(this.addEditParams.id, params);
                           } else if (!this.addEditParams.id) {
                               //   新增提交
                               this.addSubmit(params);
                           }
                       } else if (this.flag === "release") {
                           this.release(params.id, params);
                       }
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.uploadShow = false;   // 这里没有暂停项---和文件一起提交的就没有暂停项。
                });
            },
            /** 加载分段上传的内容 */
            loadFile(val) {
                this.params.bucket = val;
                if (val < this.total - 1) {
                    this.params.content = this.totalConent.slice((val * this.blockSize), (val + 1) * this.blockSize);
                } else if(val === this.total - 1) {
                    this.params.content = this.totalConent.slice((val * this.blockSize));
                }
                this.uploadFile();
            },
        },
        watch:{
            bucket(val) {
                if (val > -1) {
                    this.loadFile(val);
                }
            }
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            addModule: require('./add-module').default,
            filesModule: require('./files-module.vue').default,
            historyModule: require('./history-module.vue').default,
        }
    }
</script>
