<template>
    <page-dialog title="批量入库" v-model="dialog" size="small" class="p-batchto-warehouse">
        <div class="check-execute">
            <i></i>
            <span>将对勾选包裹执行批量入库，确认此操作吗？</span>
        </div>
        <el-input
            type="textarea"
            autosize
            placeholder="入库备注"
            v-model="textarea">
        </el-input>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="dialog = false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .check-execute{
        width :100%;
        height 50px;
        display :flex;
        flex-direction :row;
        align-items :center;
       i{
           width :32px;
           height :32px;
           padding:0 10px 0 10px;
           background:url('../../../assets/tooltip-icon.png') no-repeat center center;
       }
    }
</style>
<script>
    import {api_post_storage} from '@/api/package-return'
	export default{
		data(){
			return {
                textarea: '',
                dialog:this.value,
            }
		},
        methods:{
            keep(){
                typeof this.textarea === 'string' && (this.textarea = this.textarea.trim());
                let data = {
                    remark:this.textarea,
                    ids:this.checkData
                };
                this.$http(api_post_storage,data).then(res=>{
                    this.$message({type:"success",message:res.message || res});
                    this.dialog = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            }
        },
        watch:{
			dialog(){
				this.$emit('input',val);
            },
            value(val){
				this.dialog = val;
            }
        },
        props:{
            value:{},
            checkData:{}
        },
		components: {
		    pageDialog:require('@/components/page-dialog.vue').default,
        }
	}
</script>
