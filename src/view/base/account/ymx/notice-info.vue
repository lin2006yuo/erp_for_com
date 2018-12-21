<template>
    <page-dialog title="通知信息" v-model="show" size="small"
                 @open="open" @cloce="close" :close-on-cilck-modal="false">
        <el-checkbox v-for="(item, index) in checkData" :key="index" v-model="item.checked" class="mt-sm ml-lg">{{item.name}}</el-checkbox>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click.native="sync_notice" v-if="false">同步</el-button>
            <el-button size="mini" type="primary" @click.native="set_notice">设置</el-button>
            <el-button size="mini" @click.native="show=false">关闭</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        data(){
            return{
                show: false,
                checkData: []
            }
        },
        methods:{
            open(){
                this.checkData = this.noticeData.message.notice_type.map(row => {
                    return {
                        name: row.name,
                        checked: row.checked?true:false
                    }
                });
            },
            close(){

            },
            sync_notice(){//同步
                this.$emit('sync-notice')
            },
            set_notice(){//设置
                this.$emit('set-notice',this.noticeData.message.id,this.noticeData.message.account_id,this.checkData)
            }
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
            noticeData:{
                required:true,
                type:Object
            },
            value:{
                required:true,
                type:Boolean
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>

<style scoped>

</style>