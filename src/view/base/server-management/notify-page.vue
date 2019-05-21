<template>
    <page-dialog :title="title" v-model="show" size="small" @close="close" :close-on-cilck-modal="false">
        <span class="mb-sm inline mt-sm ml-sm">通知内容 </span>
        <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="content">
        </el-input>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确 定</el-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_servers_notify} from '@/api/server-management'
    export default{
        data(){
            return{
                show:this.value,
                content:''
            }
        },
        methods:{
            close(){
                this.content = '';
            },
            keep(){
                let  parmes ={
                    content:this.content,
                    serverIds:this.batchids,
                    title:this.title,
                }
                if(!this.content){
                    this.$message({type: 'warning', message: '请输入内容!'});
                }else {
                    this.$http(api_servers_notify,parmes).then(res=>{
                        this.$message({type: "success", message: res.message || res});
                        this.$emit('submit')
                        this.show = false;
                    }).catch(code=>{
                        this.$message({type:'error', message:code.message || code})
                    })
                }

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
            value:{
                required:true,
                type:Boolean
            },
            title:{},
            batchids:{}

        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>