<template>
    <page-dialog :title="title" v-model="show" size="small"
                 @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="joomData"
                 label-width="190px"
                 ref="joomData">
            <el-form-item  label="系统状态：">
                <el-col :span="14">
                    <el-switch v-model="joomData.status"
                               :on-text="status[0]"
                               on-color="#20a0ff"
                               :off-text="status[1]"
                               off-color="#C0CCDA"
                               @change="changStatus">
                    </el-switch>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Listing数据：">
                <el-col :span="14">
                    <el-select v-model="joomData.download_listing">
                        <el-option v-for="item in dowloadLists"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Joom订单功能：">
                <el-col :span="14">
                    <el-select v-model="joomData.download_order">
                        <el-option v-for="item in crawl"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到Joom功能：">
                <el-col :span="14">
                    <el-select v-model="joomData.sync_delivery">
                        <el-option v-for="item in crawl"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
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

</style>
<script>

    export default{
        data(){
            return{
                status:["启用","停用"],
                show:this.value,
                crawl:[
                    {label:"未启用",value:0},
                    {label:"15分钟",value:15},
                    {label:"30分钟",value:30},
                    {label:"60分钟",value:60}
                ],
                dowloadLists:[
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                    {label:"5小时",value:300},
                    {label:"6小时",value:360},
                    {label:"8小时",value:480},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440}
                ],
            }
        },
        methods:{
            open(){
                this.joomData.status = this.joomData.status === 1;
            },
            cloce(){

            },
            keep(){
                this.$emit('set-clich',this.joomData);
            },
            changStatus(){//-----------------------修改启用或禁用事件
                let statusTitle = this.joomData.status ? '停用' : '启用';
                this.$confirm('您将'+statusTitle+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).catch((code) => {
                    this.joomData.status = !this.joomData.status;
                });
            },
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
            joomData:{
                required:true,
                type:Object
            },
            value:{
                required:true,
                type:Boolean
            },
            title:{
                type:String
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
