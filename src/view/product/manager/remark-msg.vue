<template>
        <el-row class="c-remark-msg">
            <el-card class="box-card">
                <card label="操作日志">
                    <remark-history :history="logData"></remark-history>
                </card>
            </el-card>
            <el-card v-if="editAble">
                <card label="添加备注信息">
                    <el-input type="textarea"
                              v-model="textarea"
                              placeholder="请输入内容"
                              :autosize="{minRows: 4, maxRows: 5}"></el-input>
                    <request-button class='primary-btn' req-key='remarkMsg' @click="add"
                               :disabled="!textarea">确认添加</request-button>
                </card>
            </el-card>
            <div style="margin:10px 0  0 20px" v-if="!isAdd">
                <div v-if="editAble">
                    <el-button size="mini" type="primary" @click="keep_">保 存</el-button>
                    <el-button size="mini" @click="cancel_">取  消</el-button>
                </div>
                <el-button size="mini" v-else type="primary" @click="edit">编   辑</el-button>
            </div>
        </el-row>
    </template>
    <style lang="stylus">
        .c-remark-msg{
        .page-card .body{
            padding-left: 0;
        }
            .box-card{
                height:400px;
                overflow-y:auto;
                margin-bottom:20px;
            }
            .primary-btn{
                float:right;
                margin:5px 0;
            }
        }
    </style>
    <script>
        import card from '../../../components/card.vue';
        import remarkHistory from './remark-history.vue';
        import {publish_updata_addlog} from '../../../api/product-library'

        export default{
            data(){
                return{
                    textarea:''
                }
            },
            methods:{
                keep_(){
                    this.$emit("keep")
                },
                cancel_(){
                    this.$emit("cancel")
                },
                edit(){
                    this.$emit("edit")
                },
                add(){
                    this.$http(publish_updata_addlog,this.goodsId,{remark:this.textarea}).then(res=>{
                        this.$emit("addlog")
                        this.textarea="";
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('remarkMsg',false)
                        },200);

                    });
                }
            },
            props:{
                logData:{
                    required:true,
                    type:Array
                },
                goodsId:{
                    required:true,
                    type:Number
                },
                editAble:{
                    required:true,
                    type:Boolean
                },
                isAdd:{
                    default(){
                        return false;
                    }
                }
            },
            components:{
                card,
                remarkHistory,
            }
        }
    </script>