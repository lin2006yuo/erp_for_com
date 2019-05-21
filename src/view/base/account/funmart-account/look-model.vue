<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="listData"
                 label-width="210px"
                 ref="listData">
            <el-form-item label="简称：">
                <el-col :span="14">
                    <span>{{listData.code}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="账户名称：">
                <el-col :span="14">
                    <span>{{listData.account_name}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Fummart订单功能：">
                <el-col :span="14">
                    <span>{{listData.download_order | filterHour}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到Fummart功能：">
                <el-col :span="14">
                    <span>{{listData.sync_delivery | filterHour}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Listing数据：">
                <el-col :span="14">
                    <span>{{listData.download_listing | filterHour}}</span>
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
                Object.keys(this.listData).forEach(key=>{
                    this.listData[key] = "";
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
        filters:{
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
            downloadList:{},
            listData:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>