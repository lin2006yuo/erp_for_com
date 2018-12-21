<template>
    <page-dialog :title="form.dtitle" v-model="dialogVisible" :close-on-click-modal="false">
        <el-form  label-width="100px"  :model="form"   :rules="rules" ref="ruleForm"  >
            <el-row>
                <el-col :span="16">
                    <el-form-item label="菜单名称：">
                        <ui-input :edit="form.edit" v-model="form.title"></ui-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="上级分类：">
                        <categories v-model="form.pid" :tree="tree" v-if="form.edit"  :styles="{minHeight:0}" :dbclick="true"></categories>
                        <div v-else>{{parentLabel}}</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="类型：">
                        <!--<select-text :edit="form.edit" v-model="form.type">-->
                            <!--<el-option v-for="item in type"-->
                                       <!--:label="item.label" :value="item.value">-->
                            <!--</el-option>-->
                        <!--</select-text>-->
                        <span v-if="!form.edit">{{form.type|typesFliter}}</span>
                        <el-select v-else  v-model="form.type">
                            <el-option v-for="(item,i) in type"
                                       :key="i"
                                       :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.type">
                <el-col :span="16">
                    <el-form-item label="路由："   required  prop="paths">
                        <ui-input :edit="form.edit" v-model="form.paths"></ui-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="排序：">
                        <ui-input :edit="form.edit" type="number" :min="0" v-model="form.sort"></ui-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="备注：">
                        <ui-input type="textarea" :edit="form.edit" v-model="form.remark"></ui-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="状态：">
                        <el-switch v-model="form.status"   v-if="form.edit"
                                   on-text="显示"
                                   off-text="隐藏"></el-switch>
                        <div v-else>{{form.status|statusFilter}}</div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <request-button req-key="addMenu" :mintime="300" @click="submit_add" v-if="form.edit">确 定</request-button>
            <el-button @click.native="dialogVisible = false"   size="mini">取 消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_setting,api_add} from '../../../api/menu';
    export default{
        data(){
            return {
                dialogVisible: this.value,
                type: [
                    {label: '菜单分类', value: 0},
                    {label: '菜单链接', value: 1},
                    {label: '系统内部', value: 2}
                ],
                rules:{
                    paths:[  {required:true,message:'请输入路径',trigger:'blur'}]
                }
            }
        },
        methods: {
            submit_add(){
                if(!this.form.edit){
                    this.dialogVisible = false;
                    return this.$reqKey('addMenu',false);
                }
                if(this.form.type===0){
                    if (this.form.id > 0) {
                        let params = {
                            id: this.form.id,
                            title: this.form.title,
                            pid: this.form.pid,
                            type: this.form.type,
                            status: this.form.status ? 1 : 0,
                            paths: this.form.paths,
                            remark: this.form.remark,
                            sort: this.form.sort,
                            group: this.form.group,
                        };
                        this.$http(api_setting, this.form.id, params).then(res => {
                            this.dialogVisible = false;
                            this.tree[params.id] = params;
                            this.$message({
                                type: 'success',
                                message: res.message || res
                            });
                            this.$emit('update', params);
                        }).catch(code => {
                            this.$message({
                                type:'error',
                                message:code.message || code
                            })
                        }).finally(()=>{
                            this.$reqKey('addMenu',false);
                        })
                    } else {
                        let params = {
                            title: this.form.title,
                            pid: this.form.pid,
                            type: this.form.type,
                            status: this.form.status ? 1 : 0,
                            paths: this.form.paths,
                            remark: this.form.remark,
                            sort: this.form.sort,
                            group: this.form.group,
                        };
                        this.$http(api_add, params).then(res => {
                            this.dialogVisible = false;
                            params.id = parseInt(res.data);
                            this.$set(this.tree, params.id, params);
                            this.$message({
                                type: 'success',
                                message: res.message || res
                            });
                            this.$emit("reflash");
                        }).catch(code => {
                            this.$message({
                                type:'error',
                                message:code.message || code
                            })
                        }).finally(()=>{
                            this.$reqKey('addMenu',false);
                        })
                    }
                }else {
                    this.$refs.ruleForm.validate((valid) => {
                        if (valid) {
                            if (this.form.id > 0) {
                                let params = {
                                    id: this.form.id,
                                    title: this.form.title,
                                    pid: this.form.pid,
                                    type: this.form.type,
                                    status: this.form.status ? 1 : 0,
                                    paths: this.form.paths,
                                    remark: this.form.remark,
                                    sort: this.form.sort,
                                    group: this.form.group,
                                };
                                this.$http(api_setting, this.form.id, params).then(res => {
                                    this.dialogVisible = false;
                                    this.tree[params.id] = params;
                                    this.$message({
                                        type: 'success',
                                        message: res.message || res
                                    });
                                    this.$emit('update', params);
                                }).catch(code => {
                                    this.$message({
                                        type:'error',
                                        message:code.message || code
                                    })
                                }).finally(()=>{
                                    this.$reqKey('addMenu',false);
                                })
                            } else {
                                let params = {
                                    title: this.form.title,
                                    pid: this.form.pid,
                                    type: this.form.type,
                                    status: this.form.status ? 1 : 0,
                                    paths: this.form.paths,
                                    remark: this.form.remark,
                                    sort: this.form.sort,
                                    group: this.form.group,
                                };
                                this.$http(api_add, params).then(res => {
                                    this.dialogVisible = false;
                                    params.id = parseInt(res.data);
                                    this.$set(this.tree, params.id, params);
                                    this.$message({
                                        type: 'success',
                                        message: res.message || res
                                    });
                                }).catch(code => {
                                    this.$message({
                                        type:'error',
                                        message:code.message || code
                                    })
                                }).finally(()=>{
                                    this.$reqKey('addMenu',false);
                                })
                            }
                        }else{
                            this.$reqKey('addMenu',false);
                        }
                    });
                }

            }
        },
        filters:{
            statusFilter(val){
                    if(val){
                        return "显示"
                    }else {
                        return  "隐藏"
                    }
                },
            typesFliter(val){
                 switch (val){
                     case 0:
                         return "菜单分类";
                     case 1:
                         return "菜单链接";
                     case 2:
                         return "系统内部";
                 }
            }
        },
        computed:{
            parentLabel(){
                let parent = [];
                let calc = function(index){
                    let node = this.tree[index];
                    if(node){
                        parent.push(node.title);
                        node.pid && calc.call(this, node.pid);
                    }
                };
                calc.call(this, this.form.pid);
                let title = parent.reverse().join(">>");
                console.log(`title:${title}`);
                return title;
            },
        },
        watch:{
            value(val){
                this.dialogVisible = val;
            },
            dialogVisible(val){
                this.$emit('input', val);
            }
        },
        props:{
            tree:{
                required:true,
                type:Object
            },
            value:{
                required:true,
                type:Boolean
            },
            form:{}
        },
        components:{
            uiInput:require('../../../components/ui-input.vue').default,
            pageDialog:require('../../../components/page-dialog.vue').default,
            nodeTreeSelect:require('../../../components/node-tree-select.vue').default,
            selectText:require('../../../components/select-text.vue').default,
            categories:require('../../product/manager/categories.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
