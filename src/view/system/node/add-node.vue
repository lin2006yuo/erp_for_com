<template>
    <el-row class="c-add-node">
        <page-dialog :title="addForm.fTitle" v-model="addDialog" size="small" :close-on-click-modal="false">
            <el-form label-width="120px" :model="addForm" ref="addForm" :rules="rules">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="节点类型：">
                            <el-select v-model="addForm.level" @change="change_level">
                                <el-option v-for="item in selectObject.levelList" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                    <el-form-item label="上级节点：">
                        <el-select v-if="selectObject.nodeList.length>0" v-model="addForm.pid">
                            <el-option v-for="item in selectObject.nodeList" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        <div v-else>无上级节点</div>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="节点名称：" prop="name">
                            <el-input v-model="addForm.name" :edit="isEdit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="节点标题：" prop="title">
                            <el-input v-model="addForm.title" :edit="isEdit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="addForm.level===0 || addForm.level===4">
                    <el-col :span="20">
                        <el-form-item label="表达式：">
                            <el-input v-model="addForm.expression" :edit="isEdit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注：">
                            <el-input type="textarea" v-model="addForm.remark" :edit="isEdit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="状态：">
                            <el-radio-group v-model="addForm.status" :disabled="!isEdit">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="0">停用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer">
                <div>
                    <el-button type="primary" size="mini" @click.native="add_save">保存</el-button>
                    <el-button size="mini" @click.native="cancel">取消</el-button>
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
                    callback(new Error("节点名称不能存在中文字符"));
                }else{
                    callback();
                }
            }
            return{
                addDialog:false,
                rules:{
                  name:[
                    {required:true,message:'节点名称不能为空',trigger:'blur'},
                    {validator:checkName,trigger:'blur'}
                  ],
                  title:[
                      {required:true,message:'节点标题不能为空',trigger:'blur'},
                  ]
                }
            }
        },
        mounted(){
            this.addDialog = this.value;
        },
        watch:{
           addDialog(val){
               this.$emit("input",val);
           },
            value(val){
               this.addDialog = val;
            },
        },
        methods:{
            add_save(){
                this.$refs.addForm.validate((res)=>{
                    if(res){
                        this.$emit("add-save");
                    }
                })
            },
            cancel(){
                this.addDialog = false;
            },
            close(){
                this.addDialog = false;
            },
            change_level(val){
                this.$emit("change-level",val)
            }
        },
        props:{
            value:{},
            addForm:{
               required:true,
               type:Object
            },
            selectObject:{
               required:true,
               type:Object
            },
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiInput:require('../../../components/ui-input.vue').default,
        }
    }
</script>