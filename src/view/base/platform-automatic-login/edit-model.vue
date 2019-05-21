<template>
    <page-dialog :title="title" v-model="show" size="large"
                 @cloce="cloce"
                 @change="open_dialog"
                 :close-on-cilck-modal="false">
        <el-form :model="form"
                 label-width="190px"
                 ref="node-edit-form"
                 :rules="rules">
            <el-row class="account-title">登录信息</el-row>
            <template v-if="isEdit">
                <el-form-item label="添加时间：">
                    <span>{{form.create_time|fdatetime}}</span>
                </el-form-item>
                <el-form-item label="更新时间：" v-if="form.updater_id!=='-'">
                    <span>{{form.update_time |fdatetime}}</span>
                </el-form-item>
                <el-form-item label="添加人：" v-if="form.updater_id==='-'">
                    <span>{{form.creator_id}}</span>
                </el-form-item>
                <el-form-item label="更新人：" v-else>
                    <span>{{form.updater_id}}</span>
                </el-form-item>
            </template>
            <el-form-item label="平台类型：" prop="relation_module">
                <el-col :span="7">
                    <el-select v-model="form.relation_module" @change="relation_module_change">
                        <el-option v-for="type of relationType"
                                   :label="type.label"
                                   :value="type.value"
                                   :key="type.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="平台：" prop="channel_id">
                <el-select v-model="form.channel_id"
                           class="width"
                           clearable
                           filterable
                           @change="channel_change">
                    <el-option v-for="item in channelList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="站点：" prop="channel_site">
                <el-select :disabled="siteOptions.length===0"
                           class="width"
                           :placeholder="sitePlaceholder"
                           filterable clearable
                           v-model="form.channel_site">
                    <el-option v-for="item in siteOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="网站地址：" prop="website_url">
                <el-col :span="7">
                    <el-input v-model="form.website_url"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="类型：" prop="type">
                <el-col :span="7">
                    <el-select v-model="form.type">
                        <el-option v-for="type of types"
                                   :label="type.label"
                                   :value="type.value"
                                   :key="type.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <div>
                <el-row v-for="(item,index) in form.node_info||[]" :key="index">
                    <div class="innerbox mlf mb-mini">
                        <div class="innerbox">
                            <span class="red">*</span><span>节点：</span>
                            <el-input class="select-w" v-model="item.node"></el-input>
                        </div>
                        <div class="innerbox ml-sm">
                            <span class="red">*</span><span>节点值：</span>
                            <el-input class="select-w" v-model="item.node_value"></el-input>
                        </div>
                        <label class="inline ml-sm">解析类型：</label>
                        <el-select v-model="item.parsing_type" class="select-w">
                            <el-option v-for="item in typeList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <label class="inline ml-sm">节点类型：</label>
                        <el-select v-model="item.node_type" class="select-w">
                            <el-option v-for="item in sub"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <label class="inline ml-sm" v-if="index===0"><img src="../../../assets/add2.png" alt=""
                                                                          @click="add(1)"></label>
                        <label class="inline ml-sm" v-if="index!==0"><img src="../../../assets/delete.png" alt=""
                                                                          @click="del(index,1)"></label>
                    </div>
                </el-row>
            </div>
            <el-row class="account-title">验证信息</el-row>
            <el-form-item label="验证网站地址：">
                <el-col :span="7">
                    <el-input v-model="form.verification_website_url"></el-input>
                </el-col>
            </el-form-item>
            <div>
                <el-row v-for="(item,index) in form.verification_node_info" :key="index">
                    <div class="innerbox mlfx">
                        <div class="innerbox">
                            <span>验证节点：</span>
                            <el-input class="select-w" v-model="item.node"></el-input>
                        </div>
                        <div class="innerbox ml-sm">
                            <span>节点值：</span>
                            <el-input class="select-w" v-model="item.node_value"></el-input>
                        </div>
                        <label class="inline ml-sm">解析类型：</label>
                        <el-select v-model="item.parsing_type" class="select-w">
                            <el-option v-for="item in typeList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <label class="inline ml-sm">节点类型：</label>
                        <el-select v-model="item.node_type" class="select-w">
                            <el-option v-for="item in sub"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <label class="inline ml-sm" v-if="index===0"><img src="../../../assets/add2.png" alt=""
                                                                          @click="add(2)"></label>
                        <label class="inline ml-sm" v-if="index!==0"><img src="../../../assets/delete.png" alt=""
                                                                          @click="del(index,2)"></label>
                    </div>
                </el-row>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="sure">确定</el-button>
            <el-button size="mini" @click.native="cloce">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .error_box {
        color: #FF6A3C;
        width: 100%;
        margin-top: -10px;
        line-height: 14px;
        font-size: 14px;
        margin-left: 188px
    }

    .account-title {
        height: 20px;
        line-height: 20px;
        margin-bottom: 6px;
        padding: 0 10px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
    }

    .border {
        border: 1px solid #FF6A3C;
        border-radius: 2px;
    }

    .width {
        width: 260px;
    }

    .mlf {
        margin-left: 148px;
    }

    .mlfx {
        margin-left: 130px;
    }

    .innerbox {
        display: flex;
        align-items: center;
    }

    .select-w {
        width: 124px;
    }
</style>
<script>
    import {
        api_get_channel,
        api_account_list,
        api_automatic_update,
        api_channel_type,
        api_available_list,
        api_automatic_save
    } from '../../../api/platform-automatic-login'

    export default {
        refresh() {
            this.siteOptions = [];
        },
        data() {
            return {
                node: [{
                    node: '',
                    node_value: '',
                    parsing_type: 0,
                    node_type: 0
                }],
                channelList: [],
                siteOptions: [],
                show: this.value,
                typeList: [
                    {label: '正常解析', value: 0},
                    {label: 'JQ解析', value: 1},
                    {label: 'Xpath解析', value: 2}
                ],
                types: [
                    {label: '登录', value: '1'},
                    {label: '验证', value: '2'},
                ],
                rules: {
                    channel_id: [
                        {required: true,message:"平台为必填项", trigger: 'change',type:'number'}
                    ],
                    type: [
                        {required: true, message: '类型为必填项', trigger: 'change'}
                    ],
                    channel_site: [
                        {required: true, message: '站点为必填项', trigger: 'change', type: 'string'}
                    ],
                    relation_module: [
                        {required: true, message: '平台类型为必填项', trigger: 'change', type: 'number'}
                    ],
                    website_url:[
                        {required: true, message: '网站地址为必填项', trigger: 'change'}
                    ]
                },
                relationType: []
            }
        },
        methods: {
            open_dialog(isOpen) {
                if (isOpen) {
                    this.channel_type();
                    if (this.form.relation_module === 2) {
                        this.available_list();
                    } else {
                        this.channel_remote();
                    }
                };
            },
            cloce() {
                this.show = false;
                this.form.node_info = [{
                    node: '',
                    node_value: '',
                    parsing_type: 0,
                    node_type: 0
                }];
                Object.keys(this.form).forEach(key => {
                    this.form[key] = "";
                });
            },
            add(val) {
                if (val === 1) {
                    this.form.node_info.push({node: '', node_value: '', parsing_type: 0, node_type: 0})
                } else {
                    this.form.verification_node_info.push({node: '', node_value: '', parsing_type: 0, node_type: 0})
                }
            },
            del(index, val) {
                if (val === 1) {
                    this.form.node_info.splice(index, 1)
                } else {
                    this.form.verification_node_info.splice(index, 1)
                }
            },
            sure() {
                this.$refs['node-edit-form'].validate(valid => {
                    if (valid) {
                        let data = {
                            channel_id: this.form.channel_id,
                            channel_site: this.form.channel_site,
                            website_url: this.form.website_url,
                            relation_module: this.form.relation_module,
                            verification_website_url: this.form.verification_website_url,
                            type: this.form.type,
                            node_info: this.form.node_info,
                            verification_node_info: this.form.verification_node_info
                        };
                        if (data.node_info.some(row => !row.node || !row.node_value)) {
                            return this.$message(({message: '节点和节点值必填', type: 'error', duration: 1500}));
                        }
                        if(this.title === '编辑'){
                            this.$http(api_automatic_update, this.form.id, data).then(res => {
                                this.$message(({message: res.message || message, type: 'success', duration: 1500}));
                                this.show = false;
                                this.$emit('search');
                            }).catch(code => {
                                this.$message(({message: code.message || message, type: 'error', duration: 1500}))
                            })
                        }else {
                            this.$http(api_automatic_save,data).then(res=>{
                                this.$message(({message:res.message||message,type:'success',duration:1500}))
                                setTimeout(()=>{
                                    this.show = false;
                                    this.$emit('search');
                                },1500);
                            }).catch(code=>{
                                this.$message(({message:code.message||message,type:'warning',duration:1500}))
                            })
                        }

                    }
                });
            },
            relation_module_change(){
                this.form.channel_id = '';
                this.form.channel_site = '';
            },
            channel_change(){
                this.form.channel_site = '';
            },
            channel_type() {
                this.$http(api_channel_type).then(res => {
                    this.relationType = res.data.map(row => {
                        return {
                            label: row.name,
                            value: row.value
                        }
                    });
                }).catch(code => {
                    this.$message({message: code.message, type: 'error'});
                });
            },
            channel_remote() {
                this.$http(api_get_channel, {}).then(res => {
                    this.channelList = res;
                }).catch(code => {
                    this.$message({message: code.message, type: 'error'});
                });
            },
            available_list() {
                this.$http(api_available_list).then(res => {
                    this.channelList = res.map(row => {
                        return {
                            label: row.post,
                            value: row.id
                        }
                    });
                    console.log("平台列表：",this.channelList);
                }).catch(code => {
                    this.$message({message: code.message, type: 'error'});
                });
            },
            get_site(channel_id) {
                if (!channel_id) return this.siteOptions = [];
                this.$http(api_account_list, {channel_id: channel_id}).then(res => {
                    if (res.site.length <= 0) {
                        this.siteOptions = [];
                    } else {
                        this.siteOptions = res.site;
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
        },
        computed: {
            sitePlaceholder() {
                return this.siteOptions.length ? '请选择站点' : '该平台无站点'
            }
        },
        filters: {
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            },
            "form.relation_module"(val) {
                if (val === 0) {
                    this.channel_remote();
                    this.rules.channel_id = [
                        {required: true, message: '平台为必填项', trigger: 'change', type: 'number'}
                    ];
                }
                if (val === 2) {
                    this.available_list();
                    // this.rules.channel_id = [];
                    this.rules.channel_id = [
                        {required: true, message: '平台为必填项', trigger: 'change', type: 'number'}
                    ];
                } else {
                    this.channel_remote();
                    // this.rules.channel_id = [];
                }
            },
            "form.channel_id"(val) {
                this.siteOptions = [];
                if (val) {
                    this.get_site(val);
                }
            },
            siteOptions: {
                immediate: true,
                handler(val) {
                    if (val.length) {
                        this.rules.channel_site = [
                            {required: true, message: '站点为必填项', trigger: 'change', type: 'string'}
                        ];
                    } else {
                        this.rules.channel_site = [];
                    }
                }
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            title: {
                type: String
            },
            form: {
                type: Object,
                required: true
            },
            isEdit: {
                type: Boolean,
                required: true
            },
            sub: {
                required: true,
                type: Array
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            selectRemote: require('@/components/select-remote.vue').default,
        }
    }
</script>
