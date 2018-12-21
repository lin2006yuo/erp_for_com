<template>
    <page-dialog :title="titleData" v-model="dialogVisible" :close-on-click-modal="false" >
        <el-form label-width="100px" :rules="rules" :model="form" ref="forms1">
            <el-row>
                <el-col :span="16">
                    <el-form-item label="分类名称：" required prop="title">
                        <el-input v-if="edit" v-model="form.title"></el-input>
                        <span v-else>{{form.title}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="上级分类：">
                        <tree-dialog v-model="form.pid"  v-if="edit" :tree="tree"  title="上级分类" :dbclick="true" ></tree-dialog>
                        <!--<node-tree-select v-if="edit" v-model="form.pid" :tree="tree"></node-tree-select>-->
                        <span v-else>{{parentName}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="分类编码：" required prop="code">
                        <el-input v-if="edit" v-model="form.code"></el-input>
                        <span v-else>{{form.code}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="状态：">
                        <el-select v-if="edit" v-model="form.status" style="width:100px">
                            <el-option v-for="item in statuses"
                                       :label="item.label" :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                        <span v-else>{{status}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="分类关键字：">
                        <el-input v-if="edit" v-model="form.keywords"></el-input>
                        <span v-else>{{form.keywords}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="分类描述：">
                        <el-input v-if="edit" v-model="form.description"></el-input>
                        <span v-else>{{form.description}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="中文报关名称：">
                        <el-input v-if="edit" v-model="form.ch_customs_title"></el-input>
                        <span v-else>{{form.ch_customs_title}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="英文报关名称：">
                        <el-input v-if="edit" v-model="form.en_customs_title" @input="change_english"></el-input>
                        <span v-else>{{form.en_customs_title}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="采购员：" >
                    <el-select class="inline" ref="purchaserId"
                               filterable clearable
                               v-model="form.purchaser_id"
                               v-if="edit"
                               placeholder="请选择">
                        <el-option
                                v-for="item in purchasers"
                                :key="item.id"
                                :label="item.realname"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <span v-else>{{purchaser}}</span>
                </el-form-item>
            </el-row>
            <el-row>
                    <el-form-item label="平台分类：">
                        <el-row v-for="(classify,i) in form.platform" :key="i">
                            <span class="platform" :title="classify.label">{{classify.label}}</span>
                            <el-button size="mini" type="primary" v-if="edit" class="inline" @click.native="platform_mdf(classify,i)">修改
                            </el-button>
                            <el-button size="mini" type="danger" v-if="edit" class="inline" @click.native="platform_del(i)">删除
                            </el-button>
                        </el-row>
                        <el-button type="primary" @click="platform_adds" v-if="edit" size="mini" class="mt-xs">添加</el-button>
                    </el-form-item>
            </el-row>
        </el-form>
        <add-classify v-model="classVisable" @getclass="mdf_classify" ref="classify" ></add-classify>
        <span  slot="footer">
            <request-button req-key="submitAdd" @click="submit_add" v-if="edit" size="mini">确 定</request-button>
            <el-button @click.native="dialogVisible = false" size="mini">取 消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus" scoped>
    .platform{
        display: inline-block;
        max-width: 255px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover{
                cursor: pointer;
         }
    }
</style>
<script>
    import {
        api_add,
        api_edit,
        api_update,
        api_get_channel_categories,
        api_get_channel_platform,
        api_get_channel_classify
    } from '../../../api/categories';
    import {api_get_purchase} from  "../../../api/product-library";
    import pageDialog from "../../../components/page-dialog.vue"
    export default{
        data(){
            var checkcode = (rule, value, callback) => {
                let check = /^[a-zA-Z]{1}$/
                setTimeout(() => {
                    if (check.test(value)) {
                        callback();
                    } else {
                        callback(new Error('请输入1位英文字符！'));
                    }
                }, 300);
            };
            return {
                purchasers:[],
                classify_index: "",
                todo: false,
                classVisable: false,
                dialogVisible: this.value,
                statuses: [
                    {label: '删除', value: -1},
                    {label: '禁用', value: 0},
                    {label: '正常', value: 1},
                    {label: '待审', value: 2},
                    {label: '草稿', value: 3},
                ],
                platforms: [],
                rules: {
                    title: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                    ],
                    code: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
                        {min: 1, max: 1, message: '请输入1个字符', trigger: 'blur'},
                        {validator: checkcode, trigger: 'blur'}
                    ],
                },
                isAdd: false,
            }
        },
        created(){
            this.get_purchasers();
        },
        methods: {
            get_purchasers(){//获取采购员名称数据
                this.$http(api_get_purchase,{content:""}).then(res=>{
                    this.purchasers=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            mdf_classify(mdf){
                let length=mdf.length;
                let label = mdf.map(lable=>lable.label);
                let data = {
                    label: label.join(">>"),
                    path: JSON.stringify(mdf),
                    channel_id: mdf[0].id,
                    channel_category_id: mdf[length-1].id
                };
                if(mdf[1].code){
                    data.site_id=mdf[1].id;
                }else {
                    data.site_id=0;
                }
                if (this.isAdd) {
                    this.form.platform.push(data);
                }else {
                    this.form.platform.splice(this.classify_index,1,data);
                }
            },
            change_english(val){
                let chinese = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;
                if (val.match(chinese)) {
                    this.form.en_customs_title = val.replace(chinese, "")
                }
            },
            platform_adds(){
                this.classVisable = true;
                this.isAdd = true;
                this.$refs.classify.isAdd=true;
                this.$refs.classify.plat=this.form.platform;
                this.$nextTick(() => {
                    this.$refs.classify.req = []
                });
            },
            platform_mdf(item, i){
                this.isAdd = false;
                this.classify_index = i;
                this.$refs.classify.index=i;
                this.$refs.classify.plat=this.form.platform;
                this.$refs.classify.isAdd=false;
                if (item.path && item.path !== "") {
                    this.$refs.classify.req = JSON.parse(item.path);
                } else {
                    this.$refs.classify.req = [];
                }
                this.classVisable = true;
                this.$nextTick(()=>{
                    this.$refs.classify.$refs.addclass.edit()
                })
            },

            platform_del(index){
                this.form.platform.splice(index, 1);
            },
            change_site(index){
                let platform = this.form.platform[index];
                let platformConfig = this.platforms.find(row => row.value === platform.plat);
                let site = platformConfig.sites.find(row => row.code === platform.site);
                this.$http(api_get_channel_classify, platform.plat, platform.site).then(res => {
                    console.log(res);
                })
            },
            submit_add(){
                this.$refs.forms1.validate((valid) => {
                    if (valid) {
                        if (this.form.index <= 0) {
                            console.log('触发1');
                            this.$http(api_add, this.form).then(res => {
                                this.$message({
                                    type: 'success',
                                    message: res.message || res
                                });
                                this.dialogVisible = false;
                                this.$emit('refresh',this.form);
                            }).catch(code => {
                                this.$message({
                                    type: 'error',
                                    message: code.message || code
                                })
                            }).finally(()=>{
                                this.$reqKey('submitAdd',false)
                            })
                        } else {
                            console.log('触发2');
                            this.$http(api_update, this.form.index, this.form).then(res => {
                                this.dialogVisible = false;
                                this.$message({
                                    type: 'success',
                                    message: res.message || res
                                });
                                this.$emit('refresh',this.form);
                            }).catch(code => {
                                this.$message({
                                    type: 'error',
                                    message: code.message || code
                                })
                            }).finally(()=>{
                                this.$reqKey('submitAdd',false)
                            })
                        }
                    } else {
                        this.$reqKey('submitAdd',false);
                        return;
                    }
                });


            },
        },
        computed: {
            parentName(){
                if (!this.tree[this.form.index]) {
                    return "";
                }
                let name = this.tree[this.form.index].parents.map(parent => {
                    return this.tree[parent].title;
                }).join(">>");
                return name;
            },
            status(){
                let s = this.statuses.find(row => {
                    return this.form.status === row.value
                });
                if (s) {
                    return s.label;
                } else {
                    return "";
                }
            },
            purchaser(){
                let find=this.purchasers.find(row=>{
                    return  row.id===this.form.purchaser_id
                });
                if(!!find){
                    return find.realname
                }
            }
        },
        watch: {
            value(val){
                this.dialogVisible = val;
            },
            dialogVisible(val){
                this.$emit('input', val);
            },
        },
        props: {
            tree: {},
            form: {},
            value: {},
            edit: {
                default(){
                    return false;
                }
            },
            titleData:{
                default(){
                    return "提示";
                }
            }

        },
        components: {
            pageDialog,
            nodeTreeSelect: require('../../../components/node-tree-select.vue').default,
            addClassify: require("./add-classify.vue").default,
            treeDialog:require("../../../api-components/tree-dialog.vue").default
        }
    }
</script>
