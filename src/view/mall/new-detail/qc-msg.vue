<template>
        <el-row class="c-qc-msg">
            <div v-if="qcForm.length>0">
                <card v-for="items in qcForm" :key="items.name" :label="items.name">
                    <table class="template">
                        <tr>
                            <th  v-if="qcEdit">是否启用</th>
                            <th>检测项目</th>
                            <th>描述</th>
                            <th>检具</th>
                        </tr>
                        <tbody>
                            <template>
                                <tr v-for="item in items.items"
                                    :key="item.name"
                                    v-if="qcEdit || item.enabled">
                                    <td v-if="qcEdit">
                                        <el-checkbox v-model="item.enabled"></el-checkbox>
                                    </td>
                                    <td>{{item.name}}</td>
                                    <td>{{item.content}}</td>
                                    <td>{{item.check_tool}}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </card>
                <div class="qc-msg-box" v-if="showRemark">
                    <el-form>
                        <el-form-item label="备注信息">
                            <el-input type="textarea" v-model="note"></el-input>
                        </el-form-item>
                        <div class="fr">
                            <button class="small-button submit" type="button" @click="sub_remarks(note)">质检未通过</button>
                            <button class="small-button cancel" type="button" @click="can_remarks">取消</button>
                        </div>
                    </el-form>
                </div>
                <div class="mt-xs inline" style="margin-left:60px">
                    <el-button v-if="!qcEdit" type="primary" size="mini" @click.native="edit">编辑</el-button>
                    <div v-else>
                        <el-button type="primary" size="mini" @click.native="save">确定</el-button>
                        <el-button size="mini" @click.native="cancel">取消</el-button>
                    </div>
                </div>
                <div class="fr inline mr-sm mt-xs" v-if="showQcBtn"  style="position:relative">
                    <el-button size="mini" type="primary"@click.native="success_qc">质检通过</el-button>
                    <el-button size="mini" @click.native="fail_qc">质检未通过</el-button>
                </div>
            </div>
            <div v-else class="ml-lg mt-sm">
                暂无质检项...
            </div>
        </el-row>
    </template>
    <style lang="stylus">
        .qc-msg-box{
            width:190px;
            height:115px;
            /*position:absolute;*/
            /*top:-115px;*/
            /*right:8px;*/
            position:relative;
            top:0;
            right:-911px;
            border:1px solid #ddd;
            border-radius: 5px;
            background: #fff;
            padding:0 5px;
            z-index:999;
        }
    </style>
    <script>
        import card from '../../../components/card.vue';
        import ulLi from '../../../components/ul-li.vue';
        import {process_handle} from '../../../api/product';
        export default{
            data(){
                return{
                    showRemark:false,
                    note:""
                }
            },
            methods:{
                edit(){
                    this.$emit("edit");
                },
                save(){
                    this.$emit("save");
                },
                cancel(){
                    this.$emit("cancel");
                },
                success_qc(){
                    this.$emit("success-qc",this.note);
                },
                sub_remarks(){
                    if(!this.note) return this.$message({type:"warning",message:"请完善备注信息..."});
                    this.$emit("fail-qc",this.note);
                },
                can_remarks(){
                    this.note = "";
                    this.showRemark = false;
                },
                fail_qc(){
                    this.showRemark = true;
                },
                api_process_handle(id,data){
                    this.$http(process_handle,id,data).then(res=>{
                        this.$message(res.message);
                        this.$emit("process-handle");
                    }).catch(code=>{
                        this.$message({message:code.message,type:'error'});
                        this.dialogVisible = true;
                    })
                },
            },
            props:{
               qcEdit:{
                   required:true,
                   type:Boolean,
               },
               qcForm:{
                   required:true,
                   type:Array,
               },
                showQcBtn:{
                    required:true,
                    type:Boolean,
                }
            },
            components:{
                card,
                ulLi
            }
        }
    </script>
