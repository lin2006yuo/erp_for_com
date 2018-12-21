<template>
    <page-dialog v-model="dialog" size="small" :close-on-click-modal="false" :title="title">
        <el-form :model="form" label-width="200px"  ref="form">
            <el-form-item label="简称：" >
                <el-col :span="14">
                    <el-input  v-model="form.code" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号名称：" >
                <el-col :span="14">
                    <el-input   v-model="form.name" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Umka订单功能：">
                <el-col :span="14">
                    <el-select  v-model="form.download_order"   disabled>
                        <el-option
                                v-for="res in timeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到Umka功能：">
                <el-col :span="14">
                    <el-select  v-model="form.sync_delivery" disabled  >
                        <el-option
                                v-for="res in timeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取listing功能：">
                <el-col :span="14">
                    <el-select  v-model="form.sync_listing" disabled >
                        <el-option
                                v-for="res in timeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button size="mini" class="inline" @click.native="dialog = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                dialog:this.value,
                timeList:[
                    {label:'未启用',value:0},
                    {label:'1小时',value:60},
                    {label:'2小时',value:120},
                    {label:'3小时',value:180},
                    {label:'5小时',value:300},
                    {label:'6小时',value:360},
                    {label:'8小时',value:480},
                    {label:'10小时',value:600},
                    {label:'12小时',value:720},
                    {label:'24小时',value:1440},
                ],
            }
        },
        methods:{
            submit(){
                this.$emit('update');
            },
        },
        computed:{
            isDisabled(){
                return !this.title.includes('添加');
            }
        },
        filters: {
            filterHour(val){
                if(!val)return '未启用';
                return `${Number(val)/60}小时`
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val
            },
            // curPage(val){
            //     console.log(val,'wocaini')
            // }
        },
        props:{
            value:{},
            form:{
                type:Object,
                required:true,
            },
            title:{
                type:String,
                required:true,
            },
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>