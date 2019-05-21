<template>
    <div class="c-batch-reissue-remark">
        <page-dialog :title="title" v-model="dialog" @open="open" size="small" :close-on-click-modal="false">
            <little-remark top="35px" right="90px" label="添加原因" v-if="isAdd" @submit="save_reason"
                           @cancel="cancel_reason"></little-remark>
            <el-form label-width="55px" :ref="remarkData">
                <el-form-item label="原因："
                              prop="reason" required
                >
                    <el-select class="inline width-super" v-model="remarkData.reason" placeholder="请选择">
                        <el-option
                            :key="item.value"
                            v-for="item in reasonList"
                            :label="item.label"
                            :value="item.value">
                            <span style="float: left;line-height: 26px !important">{{ item.label }}</span>
                            <span
                                v-if="item.value !==1&&item.value !==2&&item.value !==3&&item.value !==4&&item.value !==5"
                                style="float: right;line-height: 26px !important" class="el-icon-close"
                                @click="delete_reason(item)"></span>
                        </el-option>
                    </el-select>
                    <img class="inline" src="../../../assets/add2.png" @click="add_btn">
                </el-form-item>
                <el-form-item label="备注：" required>
                    <el-input type="textarea" v-model="remarkData.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click.native="submit"
                           :mintime="300"
                           req-key="url_manual_orders_batch_replacement"
                           class="inline">确定</el-button>
                <el-button size="mini"
                           @click.native="dialog = false"
                           class="inline">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-batch-reissue-remark {
        .el-textarea {
            display: inline-block;
            width: 99%;
            vertical-align: bottom;
        }
    }
</style>
<script>
    import {
        delete_reason,
        add_reason
    } from '@/api/after-sale';
    export default {
        data() {
            return {
                dialog:this.value,
                remarkData:{
                    reason:'',
                    remark:""
                },
                isAdd:false
            }
        },
        methods:{
            open(){
                this.remarkData.reason = '';
                this.remarkData.remark = '';
            },
//           备注   添加原因按钮
            add_btn() {
                this.isAdd = true;
            },
//            删除原因
            delete_reason(val) {
                this.$confirm('您将删除此条信息，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(delete_reason, val.value).then(res => {
                        this.remarkData.reason = '';
                        this.$emit('get-reason');
                        this.$message({type: "success", message: res.message || res})
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
//          保存/取消 新增原因
            save_reason(val) {
                if (!val) return this.$message({type: "warning", message: "请填写原因后再点击保存"});
                return this.$http(add_reason, {remark: val}).then(res => {
                    this.$message(res.message);
                    this.$emit('get-reason');
                    this.isAdd = false;
                    return Promise.resolve();
                }).catch(code => {
                    this.isAdd = true;
                    this.$message({type: "error", message: code.message || code})
                });
            },
            cancel_reason() {
                this.isAdd = false;
            },
            submit(){
                if(!this.remarkData.reason){
                    this.$reqKey('url_manual_orders_batch_replacement',false);
                    return this.$message({type:"warning",message:'请填写原因！'});
                }
                if(!this.remarkData.remark.trim()){
                    this.$reqKey('url_manual_orders_batch_replacement',false);
                    return this.$message({type:"warning",message:'请填写备注！'});
                }
                let data = {
                    reason:this.remarkData.reason,
                    remark:this.remarkData.remark.trim()
                };
                this.$emit('submit',data);
            },
        },
        watch:{
            dialog(val){
                this.$reqKey('url_batch_remark',false);
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
                required:true,
                type:String
            },
            reasonList:{
                required:true,
                type:Array
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog').default,
            littleRemark: require('@/components/little-remark').default,
        }
    }
</script>
