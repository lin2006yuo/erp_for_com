<template>
    <el-row class="p-attrEdit">
        <page-dialog :title="titleName" v-model="editFormVisible"
                     size="large"  @close="close" @open="open"
                     :close-on-click-modal="false" >
            <el-form ref="form"
                     :model="editData"
                     :rules="rules"
                     label-width="90px">
                <el-form-item label="属性名称：" prop="name" >
                    <el-col :span="8">
                        <el-input v-model="editData.name" @input="keyword"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="类型：" prop="type" >
                    <el-col :span="5">
                        <el-select v-model="editData.type">
                            <el-option v-for="type in types" :key="type.value" :label="type.label" :value="type.value"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="编码：" >
                    <el-col :span="5">
                        <el-select v-model="editData.code" clearable >
                            <el-option v-for="item in code" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="添加属性：">
                    <el-col :span="5" style="margin-right:10px">
                        <el-input v-model="newAttr"  placeholder="请输入属性值..." style="width:179px"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <label>图标：</label>
                        <el-select v-model="editData.radio" @change="change_radio" style="width: 95px;" class="inline">
                            <el-option v-for="item in radio" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <div v-if="editData.radio=='1'">
                        <el-col :span="4">
                            <el-input  v-model="color_val" readonly="readonly"></el-input>
                        </el-col>
                        <el-col :span="1" style="margin-left: 5px;">
                            <el-input  type="color" v-model="color" ></el-input>
                        </el-col>
                    </div>
                    <el-col :span="7" v-if="editData.radio=='2'">
                        <img-upload :thumbnail-mode="true" :multiple="false" :image="{width:'26px',height:'26px'}" v-model="image" :init="initImg"></img-upload>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="5" v-if="editData.code">
                        <el-input v-model="code_val"  placeholder="请输入编码" style="width:179px"></el-input>
                    </el-col>
                    <el-col :span="4" style="margin-left: 5px;">
                        <el-button size="mini" type="primary" @click.native="add_attr" :disabled="isAdd">确认添加</el-button>
                    </el-col>
                </el-form-item>

                <el-form-item label="属性值：">
                    <el-col :span="20">
                        <el-card class="box-card attr-card">
                            <table class="template">
                                <tr>
                                    <th>删除</th>
                                    <th>缩略图或色块</th>
                                    <th>属性</th>
                                    <th>编码</th>
                                </tr>
                                <draggable :list="editData.value" v-model="editData.value" class="tbody" tag="tbody">
                                    <tr title="双击可修改" v-for="item in editData.value"  :class="[item===activeData?'active-color':'','tag-css']" @dblclick="reduction(item)">
                                        <td width="100">
                                            <i class="el-icon-circle-close" @click.stop="handleClose(item)"  title="删除"></i>
                                        </td>
                                        <td class="drag-public drag-public-right">
                                            <div v-show="item.icon">
                                                <span class="p-span_color" :style="{backgroundColor:item.icon}" v-if="/^#/g.test(item.icon)"></span>
                                                <img  :src="item.icon"  width="26px" height="26px" style="vertical-align:middle;" v-else>
                                            </div>
                                        </td>
                                        <td>
                                            {{item.value}}
                                        </td>
                                        <td>
                                            {{item.code}}
                                        </td>
                                    </tr>
                                </draggable>
                                <tr v-if="editData.value.length<=0">
                                    <td colspan="4">暂无数据</td>
                                </tr>
                            </table>
                        </el-card>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key='addKey' @click="on_submit" v-if="editId==0" :disabled="isDisabled">提 交</request-button>
                <request-button req-key='updateAttr' @click="edit_attr" v-else :disabled="isDisabled">提 交</request-button>
                <el-button size="mini" @click.native="editFormVisible=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-attrEdit{
        .attr-card{
            height: 200px;
            overflow: auto;
            .el-card__body{
                padding: 15px 5px;
            }
            .tag-css{
              margin: 0 10px 5px 5px;
                &:hover{
                    cursor: pointer;
                    background: rgb(219, 235, 215);
                }
            }
            .active-color{
                background-color: rgba(22,22,22,0.1);
            }
            .p-span_color{
                padding: 4px 12px;
                border:1px solid gainsboro;
            }
           .el-icon-circle-close{
               padding-right: 5px;
               &:hover{
                   color: red;
               }
           }
        }
    }
</style>
<script>
    import draggable from '../../../components/drag-drop';
    import pageDialog from '../../../components/page-dialog.vue';
    import {add,attribute_update,api_get_attribute_code} from '../../../api/attribute';
    export default{
        data(){
            return {
                image:[],
                initImg:'',
                editFormVisible:false,
                types:[
                    {label:'单选',value:0},
                    {label:'多选',value:1},
                    {label:'输入框',value:2}
                ],
                code:[],
                radio:[
                    {label:'无',value:0},
                    {label:'色块',value:1},
                    {label:'缩略图',value:2}
                ],
                newAttr:'',
                code_val:'',
                color:'#000',
                color_val:'',
                rules:{
                    name:[
                        { required: true, message: '属性名不能为空', trigger: 'blur' }
                    ],
                    type:[
                        { required: true }
                    ]
                },
                index:"",
                activeData:{}
            }
        },
        methods:{
            open(){
                this.disc_init();
            },
            close(){
                this.newAttr = '';
                this.code_val = '';
                this.color_val = '';
                this.color = '';
                this.index = "";
            },
            keyword(){
                this.editData.name = trim(this.editData.name)
            },
            add_attr(){//-------------添加属性
                if (this.image.length > 0) {
                    this.initImg = this.image[0].url;
                }
                if (this.index === "") {
                    for (let i=0 ; i<this.editData.value.length ; i++) {
                        if (this.newAttr == this.editData.value[i].value) {
                            this.$message({
                                showClose: true,
                                message: '已存在该属性值...',
                                type: 'warning'
                            });
                            return;
                        }
                    }
                    this.editData.value.push({"value":this.newAttr,"icon":this.color_val||this.initImg,"code":this.code_val,"sort":0});

                }else {
                    let attrId = this.editData.value[this.index].id;
                    let flag = true;
                    this.editData.value.forEach(row=>{
                    	if(row.value == this.newAttr){
                    		flag = false;
                    		return;
                        }
                    })
                    if(!flag){
                        this.$message({
                            showClose: true,
                            message: '已存在该属性值...',
                            type: 'warning'
                        });
                        return ;
                    }else{
                        this.editData.value[this.index] = {"id":attrId,"value":this.newAttr,"icon":this.color_val||this.initImg,"code":this.code_val,"sort":0};
                        this.index = "";
                    }
                }
                this.newAttr = '';
                this.code_val = '';
                this.color_val = '';
                this.color = '';
                this.image = [];
                this.initImg = '';
            },
            handleClose(tag){//----------删除属性
                for (let i=0;i<this.editData.value.length;i++) {
                    if (tag.value == this.editData.value[i].value) {
                        if (this.index === i) {
                            this.index = ""
                        }
                        this.editData.value.splice(i, 1);
                    }
                }
            },
            change_radio(val){
                this.color = '';
                this.color_val = '';
                this.initImg = '';
                this.image = [];
            },
            on_submit() {//-----------保存
                this.editData.value.forEach((data,index)=>{
                    data.sort = index;
                });
                let params = {
                    code:this.editData.code,
                    name:this.editData.name,
                    type:this.editData.type,
                    attribute_value:this.editData.value
                };
                this.$http(add,params).then(res =>{
                    this.$message({
                        showClose: true,
                      type:"success",
                        message: res.message || res
                    });
                    this.editFormVisible = false;
                    this.$emit('on_submit',res.id,params);//-------事件抛出
                }).catch(code =>{
                    this.$message({message:code.message||code,type:'error'});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addKey', false);
                    }, 300)

                });
            },
            edit_attr(){//---------------提交
                this.editData.value.forEach((data,index)=>{
                    data.sort = index;
                });
                let params = {
                    code:this.editData.code,
                    name:this.editData.name,
                    type:this.editData.type,
                    attribute_value:this.editData.value
                };
                this.$http(attribute_update,this.editId,params).then(res=>{
                    this.$message({
                        showClose: true,
                        type:"success",
                        message: res.message || res
                    });
                    this.editFormVisible = false;
                    this.$emit('edit_attr',this.editId,params);//-------事件抛出
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        message: code.message,
                        type: 'error'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('updateAttr',false);
                    },300)
                })
            },
            // 请求编码
            disc_init(){
                this.$http(api_get_attribute_code).then(res=>{
                    this.code = res
                }).catch(code=>{
                   this.$message({message:code.message||code,type:'error'})
                })
            },
            //点击属性
            reduction(val){
                this.activeData = val;
                this.index = this.editData.value.indexOfFun(val);

                this.newAttr = val.value;
                this.code_val = val.code;
                if (val.icon) {
                    let reg = /^#/g
                    if (reg.test(val.icon)) {
                        this.editData.radio = 1;
                        this.$nextTick(() => {
                            this.color_val = val.icon;
                            this.color = val.icon;
                        })
                    } else {
                        this.editData.radio = 2

                        this.$nextTick(() => {
                            this.image.push({url:val.icon})
                            this.initImg = val.icon;
                        })
                    }

                } else {
                    this.editData.radio = 0
                }

            },
        },
        computed:{
            isDisabled(){
                if (!trim(this.editData.name)) {
                    return true
                }
                return false
            },
            isAdd(){
                if (!this.newAttr) {
                    return true
                }

                if (this.editData.code) {
                    if (!this.code_val) {
                        return true
                    }
                }
                return false
            }
        },
        watch:{
            editFormVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.editFormVisible = val;
            },
            color(val){
               this.color_val = val;
            }
        },
        props:{
            value:{},
            editData:{
                required:true,
                type:Object
            },
            editId:{
                required:true,
                type:Number
            },
            titleName:{
                required:true,
                type:String
            }
        },
        components: {
            pageDialog,
            draggable,
            imgUpload:require('./img-upload.vue').default
        }
    }
</script>
