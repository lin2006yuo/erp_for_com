<template>
    <page class="p-form-select">
        <page-dialog title="新建采购计划" v-model="dialog" :close-on-click-modal="false" @open="open">
            <div>
                <el-select class="inline" v-model="select" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click.native="submit">下一步</el-button>
                <el-button size="mini" @click.native="dialog=false">取 消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        page:{
            devinfo:{
                frontEnd:'徐梦娇',
                backEnd:'',
                createTime:'2017-5-10',
                updateTime:'2017-8-22'
            }
        },
        data(){
            return {
                dialog:false,
                select:'normal_purchasing',
                options:[
                    {
                        value: 'normal_purchasing',
                        label: '正常采购'
                    },
                    {
                        value: 'purchase_order_overcharged',
                        label: '供应商多送'
                    },
                    // {
                    //     value:'sample',
                    //     label:'样品'
                    // }
                ]
            }
        },
        methods: {
            open(){
                this.select = 'normal_purchasing';
            },
            submit(){
                this.$emit('submit',this.select)
            }
        },
        watch: {
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog = val;
            }
        },
        props: {
            value:{},
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default
        }
    }
</script>
