<template>
    <div class="c-negative-reason">
        <page-dialog title="中差评原因" v-model="dialog" size="small" :close-on-click-modal="false">
            <div>
                <div class="inline">
                    <label class="inline">差评原因：</label><el-select class="inline" v-model="negative_neutral_reason_new">
                        <el-option
                            :key="item.value"
                            v-for="item in reasonLIst"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
                <div class="fr">
                    <label class="inline">是否重发订单：</label><el-select class="inline width-xs" v-model="is_need_re_dispatched_new">
                        <el-option
                            :key="item.value"
                            v-for="item in repeatList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <el-form class="mt-sm" label-width="60px">
                <el-form-item label="备注：">
                    <el-input type="textarea"  :autosize="{ minRows: 6, maxRows: 8}" v-model="negative_neutral_remark_new"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click.native="save" size="mini">确认</el-button>
                <el-button @click.native="cancel" size="mini">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_Feedback_Reason} from '../../../api/ymx-estimate';
    export default{
        data(){
            return {
                dialog:this.value,
                /*中差评原因*/
                reasonLIst:[
                    {label:"未收到货物",value:"未收到货物"},
                    {label:"描述不符",value:"描述不符"},
                    {label:"质量问题",value:"质量问题"},
                    {label:"发货错误",value:"发货错误"},
                    {label:"关税问题",value:"关税问题"},
                    {label:"运输途中损坏",value:"运输途中损坏"},
                    {label:"运输时间过长",value:"运输时间过长"},
                    {label:"客户个人原因",value:"客户个人原因"},
                    {label:"停产缺货",value:"停产缺货"},
                    {label:"延迟发货",value:"延迟发货"},
                    {label:"无理由",value:"无理由"},
                    {label:"其他",value:"其他"},
                ],
                negative_neutral_reason_new:"未收到货物",
                /*是否重发*/
                repeatList:[
                    {label:"是",value:1},
                    {label:"否",value:0},
                ],
                is_need_re_dispatched_new:0,
                /*备注*/
                negative_neutral_remark_new:"",
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
                this.negative_neutral_remark_new = this.negative_neutral_remark;
                this.is_need_re_dispatched_new = this.is_need_re_dispatched;
                if(this.negative_neutral_reason){
                    this.negative_neutral_reason_new = this.negative_neutral_reason;
                }
            }
        },
        methods:{
            save(){
                let params = {
                    feedback_id:this.id,
                    is_need_re_dispatched:this.is_need_re_dispatched_new,
                    negative_neutral_reason:this.negative_neutral_reason_new,
                };
                this.negative_neutral_remark_new&&(params.negative_neutral_remark = this.negative_neutral_remark_new);
                return this.$http(api_Feedback_Reason,params).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('save',this.negative_neutral_reason_new,this.negative_neutral_remark_new,this.is_need_re_dispatched_new);
                    this.dialog = false;
                    return Promise.resolve();
                }).catch(code=>{
                    this.dialog = false;
                    this.$message({type:"error",message:code.message || code})
                })
            },
            cancel(){
                this.dialog = false;
            },
        },
        props:{
            value:{},
            id:{
                required:true
            },
            negative_neutral_remark:{},
            negative_neutral_reason:{},
            is_need_re_dispatched:{},
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>
