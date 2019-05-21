<template>
    <div class="p-add-args">
        <page-dialog :title="titleName" v-model="formVisible"
                     size="large" :close-on-click-modal="false">
            <el-form :model="argsForm" ref="argsForm" label-width="160px" :rules="rules">
                <el-form-item label="所属语言：" >
                    <el-select v-model="argsForm.lang_id" placeholder="请选择" style="width: 120px;">
                        <el-option
                            :key="item.value"
                            v-for="item in lang"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="所属分组：">
                    <el-select v-model="argsForm.group_id" placeholder="请选择" style="width: 120px;">
                        <el-option
                            :key="index"
                            v-for="(item,index) in groups"
                            :label="item"
                            :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="参数标识：" prop="name">
                    <el-input v-model="argsForm.name" style="width: 200px;"></el-input>
                </el-form-item>

                <el-form-item label="参数标题：">
                    <el-input v-model="argsForm.title" style="width: 200px;"></el-input>
                </el-form-item>

                <el-form-item label="参数类型：">
                    <el-select v-model="argsForm.type" placeholder="请选择" style="width: 100px;" class="inline">
                        <el-option
                            :key="index"
                            v-for="(item,index) in types"
                            :label="item"
                            :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择类型：" v-if="argsForm.type==='3'">
                    <el-select v-model="argsForm.choose_type" placeholder="请选择" style="width: 100px;" class="inline">
                        <el-option
                            :key="item.value"
                            v-for="item in data_choose"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参数值类型：">
                    <el-select v-model="argsForm.data_type" placeholder="请选择" style="width: 100px;" class="inline">
                        <el-option
                            :key="item.data_type"
                            v-for="(item,index) in data_types"
                            :label="item.remark"
                            :value="item.data_type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参数值：" v-if="argsForm.type==='3'">
                    <el-row v-for="(item,index) in argsForm.setting" :key="`${index}`">
                        <el-col >
                            <div class="mt-mini inline" @click="add_sibling">
                                <img src="../../../../assets/add2.png" title="添加同级" style="vertical-align: sub;">
                            </div>
                            <label>Key：</label><el-input v-model="item.key" class="inline input_width"></el-input>
                            <label>Value：</label><el-input v-model="item.value" class="inline input_width"></el-input>
                            <div class="mt-mini inline" title="删除同级" @click="remove_sibling(item,index)" style="vertical-align: sub;" v-if="index>0">
                                <img src="../../../../assets/delete(2).png">
                            </div>
                            <div class="mt-mini inline" @click="add_children(item,index)">
                                <img src="../../../../assets/add2.png" title="添加子级" style="vertical-align: sub;">
                            </div>
                            <el-row>
                                <el-col v-for="(subitem, subindex) in item.child" :key="subindex">
                                    <label style="margin-left: 25px;">Key：</label><el-input v-model="subitem.key" class="inline input_width"></el-input>
                                    <label>Value：</label><el-input v-model="subitem.value" class="inline input_width"></el-input>
                                    <label>参数类型：</label>
                                    <el-select v-model="subitem.type" placeholder="请选择" style="width: 95px;" class="inline">
                                        <el-option
                                            :key="index"
                                            v-for="(data,index) in types"
                                            :label="data"
                                            :value="index">
                                        </el-option>
                                    </el-select>
                                    <label v-if="subitem.type==='3'">选择类型：</label>
                                    <el-select  v-if="subitem.type==='3'" v-model="subitem.choose_type" placeholder="请选择" style="width: 95px;" class="inline">
                                        <el-option
                                            :key="data.value"
                                            v-for="data in data_choose"
                                            :label="data.label"
                                            :value="data.value">
                                        </el-option>
                                    </el-select>
                                    <label>参数值类型：</label>
                                    <el-select v-model="subitem.data_type" placeholder="请选择" style="width: 95px;" class="inline">
                                        <el-option
                                            :key="data.data_type"
                                            v-for="(data,index) in data_types"
                                            :label="data.remark"
                                            :value="data.data_type">
                                        </el-option>
                                    </el-select>
                                    <div class="mt-mini inline" title="删除子级" @click="removeSubChild(item, subindex)" style="vertical-align: sub;">
                                        <img src="../../../../assets/delete(2).png">
                                    </div>
                                    <div class="mt-mini inline" @click="add_children(item)">
                                        <img src="../../../../assets/add2.png" title="添加子级" style="vertical-align: sub;">
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        v-model="argsForm.remark" style="width: 360px;">
                    </el-input>
                </el-form-item>
                <el-form-item label="排序：">
                    <integer-input :min="0" v-model="argsForm.sort" style="width: 100px;"></integer-input>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-radio-group v-model="argsForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <permission tag="request-button" :route="apis.url_args_add" reqKey="addArgs"
                            @click="submit" v-if="markId==0">确定</permission>
                <permission tag="request-button" :route="apis.url_args_update" reqKey="updateArgs"
                            @click="update" v-else>确定</permission>
                <el-button size="mini" @click.native="formVisible = false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .input_width{
        width :80px;
    }
</style>
<script>
    import pageDialog from '../../../../components/page-dialog.vue'
    import {system_getGroups,args_add,args_update,args_type,url_args_add,url_args_update} from '../../../../api/system'
    export default{
        permission:{
            url_args_add,
            url_args_update
        },
        data(){
            var checkcode = (rule, value, callback) => {
                let check=/^[a-zA-Z\d_]+$/;
                setTimeout(() => {
                    if (check.test(value)) {
                        callback();
                    }else {
                        callback(new Error('请输入英文或数字！'));
                    }
                }, 300);
            };
            return {
                formVisible:false,
                subtypes:[],
                lang:[
                    {
                        value:0,
                        label: '公用'
                    },
                    {
                        value:1,
                        label: '中文'
                    }
                ],
                data_choose:[
                    {
                        value:0,
                        label: '单选'
                    },
                    {
                        value:1,
                        label: '多选'
                    }
                ],
                groups:{},
                types:{},
                data_types:[],
                rules:{
                    name:[{validator: checkcode, trigger: 'blur' }]
                },
            }
        },
        created(){
        },
        mounted(){
            this.$http(system_getGroups).then(res=>{
                this.groups = res.groups;
                this.types = res.types;
            }).catch(code=>{
                this.$message({message:code.message||code,type:'error'});
            });
            this.argsType();
        },
        methods: {
            add_sibling(){
                this.argsForm.setting.push({key:'',value:'',child:[]});
            },
            remove_sibling(index){
                this.argsForm.setting.splice(index,1);
            },
            add_children(item){
                item.child.push({key:'',value:'',choose_type:'',type:'',data_type:''});
            },
            removeSubChild(item, subitem){
                item.child.splice(subitem,1);
            },
            //参数值类型
            argsType(){
                this.$http(args_type).then(res=>{
                    this.data_types = res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            submit(){
                this.$refs.argsForm.validate((valid) => {
                    if (valid) {
                        this.$http(args_add,this.argsForm).then(res=>{
                            this.$message({type: "success", message: res.message || res})
                            this.formVisible = false;
                            for(let key in this.groups){
                                if(this.argsForm.group_id===key){
                                    this.$set(this.argsForm,'group',this.groups[key]);
                                }
                            }
                            this.$emit('add-update',res.id,this.argsForm);
                        }).catch(code=>{
                            this.$message({type: "error", message: code.message || code})
                        }).finally(()=>{
                            this.$reqKey('addArgs',false)
                        })
                    } else {
                        this.$reqKey('addArgs',false)
                    }
                });

            },
            update(){
                if(this.argsForm.type!=='3'){
                    this.argsForm.choose_type = '';
                    this.argsForm.setting = [
                        {
                            key:'',
                            value:'',
                            child:[]
                        }
                    ];
                }
                this.$refs.argsForm.validate((valid) => {
                    if (valid) {
                        this.$http(args_update,this.markId,this.argsForm).then(res=>{
                            this.$message({type: "success", message: res.message || res})
                            this.formVisible = false;
                            for(let key in this.groups){
                                if(this.argsForm.group_id===key){
                                    this.$set(this.argsForm,'group',this.groups[key]);
                                }
                            }
                            this.$emit('edit-update',this.markId,this.argsForm);
                        }).catch(code=>{
                            this.$message({type: "error", message: code.message || code})
                        }).finally(()=>{
                            this.$reqKey('updateArgs',false);
                        })
                    } else {
                        return this.$reqKey('updateArgs',false);
                    }
                });
            }
        },
        filters: {},
        watch: {
            value(val){
                this.formVisible = val;
            },
            formVisible(val){
                this.$emit('input',val)
            }
        },
        computed: {
        },
        props: {
            value:{},
            argsForm:{},
            markId:{},
            titleName:{}
        },
        components: {
            pageDialog,
            integerInput:require('../../../../components/integer-input.vue').default,
            requestButton:require('../../../../global-components/request-button').default,
        }
    }
</script>
