<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="lookData"
                 label-width="210px"
                 ref="lookData">
            <el-form-item label="添加人：">
                <el-col :span="14">
                    <span>{{lookData.creator}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="添加时间：">
                <el-col :span="14">
                    <span>{{lookData.create_time | filterDate}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="信用卡类别：">
                <el-col :span="14">
                    <span>{{lookData.card_category}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="卡号：">
                <el-col :span="14">
                    <span>{{lookData.card_number}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="卡主姓名：">
                <el-col :span="14">
                    <span>{{lookData.card_master}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="银行：">
                <el-col :span="14">
                    <span>{{lookData.bank}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="有效期：">
                <el-col :span="14">
                    <span>{{lookData.validity_date}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="安全码：">
                <el-col :span="14">
                    <span>{{lookData.security_code}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取店铺信用卡数据：">
                <el-col :span="14">
                    <span>{{lookData.synchronize_status | filterHour}}</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="show=false">关  闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                show:this.value,
            }
        },
        methods:{
            open(){
            
            },
            close(){
            
            },
            keep(){
            	
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
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd HH:mm:ss',val):'';
            },
            filterHour(val){
                if(!val)return '未启用';
                if(val === 30)return `${Number(val)}分钟`;
                return `${Number(val)/60}小时`
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{},
            lookData:{},
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>