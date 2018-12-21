<template>
    <page class="p-mdf-evaluate-status">
        <page-dialog title="修改评价状态"  v-model="dialog" size="small" :close-on-click-modal="false">
            <div style="height:200px">
                <div style="margin-left: 40px">
                    <label>处理状态：</label>
                    <el-select v-model="modify_status_id">
                        <el-option
                            :key="item.value"
                            v-for="item in handleStatus"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div  style="margin-left: 40px" class="mt-sm" v-if="modify_status_id===1">
                    <label>是否移除：</label>
                    <el-select v-model="is_remove_negative_feedback">
                        <el-option
                            :key="item.value"
                            v-for="item in removeSearch"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="save">保存</el-button>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
import {api_dealing_status} from '../../../api/ymx-estimate';
    export default{
        data(){
            return {
                dialog:this.value,
                /*处理状态*/
                handleStatus:[
                    {label:"未处理",value:0},
                    {label:"已处理",value:1},
                    {label:"等待对方处理",value:2},
                    {label:"已过期",value:3},
                ],
                modify_status_id:0,
                /*是否移除*/
                removeSearch:[
                    {label:"已移除",value:1},
                    {label:"未移除",value:0},
                ],
                is_remove_negative_feedback:1,
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
                this.modify_status_id = this.handling_status;
                this.is_remove_negative_feedback = this.remove_negative_feedback;
            }
        },
        methods:{
            save(){
                let params = {
                    feedback_id:this.id,
                    modify_status_id:this.modify_status_id,
                    is_remove_negative_feedback:this.is_remove_negative_feedback
                };
                return this.$http(api_dealing_status,params).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('save-status',this.modify_status_id,this.is_remove_negative_feedback);
                    this.dialog = false;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code})
                })
            },
            cancel(){
                this.dialog = false
            },
        },
        props:{
            value:{},
            id:{
                required:true
            },
            handling_status:{},
            remove_negative_feedback:{},
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>
