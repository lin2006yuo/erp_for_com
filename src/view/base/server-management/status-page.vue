<template>
    <page-dialog title="批量设置服务器状态" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="batchData"
                 label-width="190px"
                 ref="batchData">
            <el-form-item label="批量修改状态：">
                <el-col :span="14">
                    <el-select v-model="batchData.status"
                               filterable
                               placeholder="请选择">
                        <el-option
                                v-for="res in statusList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确 定</el-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_post_batch_status} from '@/api/server-management'
    export default{
        data(){
            return{
                show:this.value,
                statusList:[
                    {label: '启用', value: 0},
                    {label: '停用', value: 1},
                ],
                batchData:{
                    status:''
                }
            }
        },
        methods:{
            open(){
            
            },
            close(){
            
            },
            keep(){
                let data = {
                    ids:this.batchids,
                    status:this.batchData.status
                };
                this.$http(api_post_batch_status, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('submit')
                    this.show = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code,});
                })

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
            batchids:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>