<template>
        <el-row class="c-remark-msg">
            <el-card class="box-card">
                    <label class="box-label">{{label}}</label>
                <el-table
                    class="scroll-bar"
                    border
                    :data="logForm"
                    style="width:100%"
                    height="300"
                >
                    <el-table-column label="操作时间" inline-template width="180" align="center">
                        <div>{{row.create_time}}</div>
                    </el-table-column>
                    <el-table-column label="操作人" prop="operator" width="180" align="center"></el-table-column>
                    <el-table-column label="操作类型" prop="process" width="180" align="center" show-tooltip-when-overflow></el-table-column>
                    <el-table-column label="备注" prop="remark" show-tooltip-when-overflow></el-table-column>
                </el-table>
            </el-card>
            <el-card>
                <label class="box-label">{{label2}}</label>
                <el-input type="textarea" placeholder="请输入内容" :autosize="{minRows: 4, maxRows: 5}" v-model="remark"></el-input>
                <request-button req-key="newRemarkMsg" class="primary-btn" @click="add_log(logForm[0].goods_id)">确认添加</request-button>
            </el-card>
        </el-row>
    </template>
    <style lang="stylus">
        .c-remark-msg{
            .box-card{
                margin-bottom:20px;
            }
            .primary-btn{
                float:right;
                margin:5px 0;
            }
        }
    </style>
    <script>
    import {product_add_log} from '../../../api/product';
        export default{
            data(){
                return{
                    remark:''
                }
            },
            methods:{
                add_log(id){
                    if(this.remark==="") return this.$message({message:"请添加描述后再提交！", type:'warning'});
                    this.$http(product_add_log,id,{remark:this.remark}).then(res=>{
                        this.$message(res.message);
                        this.remark="";
                        this.$emit("add-log",id);
                    }).catch(code=>{
                        this.$message({message:code.message,type:'error'});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('newRemarkMsg', false);
                        }, 300)
                    });
                }
            },
            props:{
                label:{
                    required:true,
                    type:String
                },
                label2:{
                    required:true,
                    type:String
                },
                logForm:{
                    required:true,
                    type:Array
                },
            },
            components:{}
        }
    </script>
