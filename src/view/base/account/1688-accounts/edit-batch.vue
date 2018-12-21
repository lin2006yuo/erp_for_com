<template>
    <page-dialog :title="batchTitle" v-model="show" size="small"
                 @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="batchData"
                 label-width="190px"
                 ref="batchData">
            <el-form-item  label="系统状态：">
                <el-col :span="14">
                    <!--<el-switch v-model="batchData.is_invalid"-->
                               <!--:on-text="status[0]"-->
                               <!--on-color="#20a0ff"-->
                               <!--:off-text="status[1]"-->
                               <!--off-color="#C0CCDA"-->
                               <!--@change="changStatus">-->
                    <!--</el-switch>-->
                    <label>
                        <input type="checkbox" :checked="batchData.is_stop" @click="stop">停用
                    </label>
                    <label>
                        <input type="checkbox" :checked="batchData.is_start" @click="start">启用
                    </label>
                </el-col>
            </el-form-item>
            <el-form-item label="会员身份：">
                <el-col :span="14">
                    <el-select v-model="batchData.membership">
                        <el-option v-for="item in memberOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="downloadAdd" @click.native="keep" type="primary">确定</request-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    input[type='checkbox']{
        vertical-align:middle;
    }
</style>
<script>

    export default{
        data(){
            return{
                // status:["启用","停用"],
                show:this.value,
                memberOptions:[//会员身份
                    {label:"企业单位",value:1},
                    {label:"事业单位或社会团体",value:2},
                    {label:"个体经营",value:3},
                    {label:"个人",value:4},
                ]
            }
        },
        methods:{
            open(){
                // this.batchData.is_invalid = this.batchData.is_invalid === 1;
            },
            close(){

            },
            start(){
                this.batchData.is_stop = false;
                this.batchData.is_start = !this.batchData.is_start
            },
            stop(){
                this.batchData.is_start = false;
                this.batchData.is_stop = !this.batchData.is_stop
            },
            keep(){
                this.$emit('set-clich',this.batchData);
            },
            // changStatus(){//-----------------------修改启用或禁用事件
            //     let statusTitle = this.batchData.is_invalid ? '停用' : '启用';
            //     this.$confirm('您将'+statusTitle+'，确认此操作吗？', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning',
            //         closeOnClickModal:false,
            //     }).catch((code) => {
            //         this.batchData.is_invalid = !this.batchData.is_invalid;
            //     });
            // },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            batchData:{
                required:true,
                type:Object
            },
            value:{
                required:true,
                type:Boolean
            },
            batchTitle:{
                type:String
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
