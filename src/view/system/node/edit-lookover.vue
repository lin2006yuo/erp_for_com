<template>
    <el-row class="c-add-node">
        <page-dialog :title="editForm.fTitle" v-model="editDialog" size="small" :close-on-click-modal="false">
            <el-form label-width="120px" :model="editForm" ref="editForm" :rules="rules">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="节点类型：">
                            <ui-select v-model="editForm.level" @change="change_level" :edit="isEdit">
                                <el-option v-for="item in selectObject.levelList" :label="item.name" :value="item.id"></el-option>
                            </ui-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="上级节点：">
                            <ui-select v-if="selectObject.nodeList.length>0" v-model="editForm.pid" :edit="isEdit">
                                <el-option v-for="item in selectObject.nodeList" :label="item.name" :value="item.id"></el-option>
                            </ui-select>
                            <div v-else>无上级节点</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="节点名称：" prop="name">
                            <ui-input v-model="editForm.name" :edit="isEdit"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="节点标题：" prop="title">
                            <ui-input v-model="editForm.title" :edit="isEdit"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="editForm.level===0 || editForm.level===4">
                    <el-col :span="20">
                        <el-form-item label="表达式：">
                            <ui-input v-model="editForm.expression" :edit="isEdit"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注：">
                            <ui-input type="textarea" v-model="editForm.remark" :edit="isEdit"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="状态：">
                            <el-radio-group v-model="editForm.status" :disabled="!isEdit">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="0">停用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer">
                <el-button v-if="!isEdit" type="primary" size="mini" @click.native="close">关闭</el-button>
                <div v-else>
                    <el-button type="primary" size="mini" @click.native="edit_save">确定</el-button>
                    <el-button size="mini" @click.native="editDialog=false">取消</el-button>
                </div>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import {chinese} from '../../../define/validator_reg'
    export default{
        data(){
            let checkName = (rule,value,callback)=>{
                if(chinese.test(value)){
                    callback(new Error('节点名称不能存在中文字符'));
                }else{
                    callback();
                }
            }
            return{
                editDialog:false,
                rules:{
                    name:[
                        {required:true,message:'节点名称不能为空',trigger:'blur'},
                        {validator:checkName,trigger:'blur'}
                    ],
                    title:[
                        {required:true,message:'节点标题不能为空',trigger:'blur'},
                    ],
                }
            }
        },
        mounted(){
            this.editDialog = this.value;
        },
        watch:{
            editDialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.editDialog = val;
            },
        },
        methods:{
            edit_save(){
                this.$refs.editForm.validate((bool)=>{
                    if(bool){
                        this.$emit("edit-save");
                    }
                })
            },
            close(){
                this.editDialog = false;
            },
            change_level(val){
                this.$emit("change-level",val)
            },
        },
        props:{
            value:{},
            editForm:{
                required:true,
                type:Object
            },
            isEdit:{
                required:true,
                type:Boolean
            },
            selectObject:{
                required:true,
                type:Object
            },
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiInput:require('../../../components/ui-input.vue').default,
            uiSelect:require('../../../components/ui-input.vue').default,
        }
    }
</script>
