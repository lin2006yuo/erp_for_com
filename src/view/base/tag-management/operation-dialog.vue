<template>
    <page>
        <page-dialog    v-model="show"
                        :title="title"
                        :close-on-cilck-modal="false"
                        @close="close">
            <el-form    :model="formData"
                        label-position="right"
                        label-width="150px"
                        :rules="rules"
                        ref="ruleForm">
                <el-col :span="18">
                    <el-form-item label="code：" prop="code">
                        <el-input v-model="formData.code" :disabled="code"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item label="标签名称：" prop="name">
                        <el-input v-model="formData.name" :disabled="type==='view'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item label="类型：" prop="type">
                        <el-select v-model="formData.type" :disabled="type==='view'">
                            <el-option  v-for="type in typeOptions"
                                        :label="type.label"
                                        :value="type.value"
                                        :key="type.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item label="状态：" prop="status">
                        <el-select v-model="formData.status" :disabled="type==='view'">
                            <el-option   v-for="status in statusOptions"
                                         placeholder="请选择"
                                         :label="status.label"
                                         :value="status.value"
                                         :key="status.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="18 ">
                    <el-form-item label="描述：">
                        <el-input   v-model="formData.description"
                                    :disabled="type==='view'"
                                    type="textarea"
                                    :rows="3">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" v-if="type==='add'" @click.native="add">确定</el-button>
                <el-button size="mini" type="primary" v-if="type==='edit'" @click.native="edit">确定</el-button>
                <el-button size="mini" v-if="type!=='view'" @click.native="close">取消</el-button>
                <el-button size="mini" v-else @click.native="close">关   闭</el-button>
            </div>
        </page-dialog>
    </page>
</template>

<script>
    import {api_add_tag,api_edit_tag} from '@/api/tag-management'
    export default {
        data(){
            let codeValidator=(rule,value,callback)=>{
                if (!value) {
                    return callback(new Error('必填项不能为空'));
                }
                else if(!((new RegExp("^[0-9a-zA-Z_]+$")).test(value))){
                    return callback(new Error('只能输入英文、下划线、数字'));
                }
                else callback();
            };
            let nameValidator=(rule,value,callback)=>{
                if (!value) {
                    return callback(new Error('必填项不能为空'));
                }
                else if(this.find_duplicate_tag(this.formData.name)){
                    if(this.type==='add'){
                        return callback(new Error('该标签名已存在'));
                    }
                    else callback();
                }
                else callback();
            };
            let statusValidator=(rule,value,callback)=>{
                if (!value) {
                    return callback(new Error('必填项不能为空'));
                }
                else if(this.formData.isBind && this.formData.status==0){
                    return callback(new Error('该标签已被绑定，不可停用'));
                }
                else callback();
            };
            return{
                typeOptions:[
                    {label:'其他',value:'0'}
                ],
                statusOptions:[
                    {label:'已启用',value:'1'},
                    {label:'已停用',value:'0'}
                ],
                rules:{
                    code:[
                        {required:true,validator:codeValidator,trigger:'change'}
                    ],
                    name:[
                        {required:true,validator:nameValidator,trigger:'change'}
                    ],
                    type:[
                        {required:true,message:'必填项不能为空',trigger:'change'}
                    ],
                    status:[
                        {required:true,validator:statusValidator,trigger:'change'}
                    ]

                }
            }
        },
        methods:{
            close(){
                this.show=false;
            },
            add(){
                let data=clone(this.formData);

                if(this.validate()){
                    this.$http(api_add_tag,data)
                        .then(res=>{
                            this.$message({type:'success',message:res.message});
                            this.$emit("update-addition",res.data);
                            setTimeout(()=>{
                                this.close();
                            },300)
                        })
                        .catch(err=>{
                            this.$message({type:'error',message:err.message});
                        })
                }
            },
            edit(){
                let data=clone(this.formData);
                Reflect.deleteProperty(data,"create_time");
                Reflect.deleteProperty(data,"update_time");
                Reflect.deleteProperty(data,"statusText");
                Reflect.deleteProperty(data,"typeText");
                Reflect.deleteProperty(data,"isBind");

                if(this.validate()){
                    this.$http(api_edit_tag,this.tagId,data)
                        .then(res=>{
                            this.$message({type:'success',message:res.message});
                            this.$emit("update-edition",res.data);
                            setTimeout(()=>{
                                this.close();
                            },300)
                        })
                        .catch(err=>{
                            this.$message({type:'error',message:err.message});
                        })
                }
            },
            validate(){
                let isValid;
                this.$refs.ruleForm.validate(valid=>{
                    isValid = !!valid;
                });
                return isValid;
            },
            //验证是否重复添加
            find_duplicate_tag(tagName){
                let find=false;
                this.tableData.forEach(tag=>{
                    if(tag.name===tagName){find=true;}
                });
                return find;
            },
            // find_duplicate_code(code){
            //     let find=false;
            //     this.tableData.forEach(item=>{
            //         if(item.code===code){find=true;}
            //     });
            //     return find;
            // }
        },
        computed:{
            show:{
                get(){
                    return this.value;
                },
                set(val){
                    this.$emit("input",val);
                }
            },
            code(){
                //被绑定的标签不能编辑code，查看页面同理
                return(this.type==='edit' && this.formData.isBind===true || this.type==='view')
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{},
            formData:{
                required:true,
                type:Object
            },
            type:{  //添加/查看/编辑
                required:true,
                type:String
            },
            tagId:{},
            tableData:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog').default,
        }
    }
</script>

<style scoped>

</style>
