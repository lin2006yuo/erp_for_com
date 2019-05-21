<template>
    <page-dialog title="指定盘点人"
                 size="small"
                 @open="open"
                 v-model="visible"
                 :close-on-click-modal="false">
        <el-row :gutter="20">
            <el-col :span="12" :offset="6">
                <label-item label="指定盘点人：" class="mt-lg">
                    <super-select
                            v-model="checker_id"
                            class="width-sm"
                            storage-key="checkerPeople"
                            :options="peopleList">
                    </super-select>
                </label-item>
                <div class="mt-sm" style="margin-left: 75px">
                    <el-button type="primary" @click="submit" size="large">生成盘点单</el-button>
                </div>
            </el-col>
        </el-row>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_warehouse_user} from '@/api/warehouse-goods-check'
    export default {
        data(){
            return {
                checker_id: '',
                visible: false,
                peopleList: []
            }
        },
        mounted(){
            this.init_user();
        },
        methods: {
            open(){
                this.checker_id = ''
            },
            init_user(){
                this.$http(api_get_warehouse_user).then(res=>{
                    this.peopleList = res.map(row=>{
                        return {
                            label:row.realname,
                            value:row.id
                        }
                    })
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            submit(){
                if(!this.checker_id){
                    this.$message({type: 'warning', message: '请先指定盘点人'});
                    return
                }
                let realName = this.peopleList.find(row => row.value === this.checker_id).label;
                this.$emit('submit', this.checker_id, realName)
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        },
    }
</script>
