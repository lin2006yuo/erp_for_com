<template>
    <div class="extension-time">
        <page-dialog title="延长收货时间" size="small" v-model="visible" :close-on-click-modal="false" @change="close_dialog">
            <p>为防止货物在运输途中的突发因素，导致买家不能及时收到货物，您可以适当延长买家收货时间。</p>
            <div>
                <span class="inline">延长买家收货确认时间</span>
                <integer-input v-model="delivery_time" :min="1" class="inline width-mini"></integer-input>
                <span class="inline">天</span>
            </div>
            <div slot="footer">
                <el-button size="mini" type="primary" @click="extension_delivery_time">确 定</el-button>
                <el-button size="mini" @click="visible = false">取 消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    export default{
        data(){
            return {
                visible:false,
                delivery_time:''
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
            extension_delivery_time(){
            this.$emit('extension-time',this.delivery_time);
            },
            close_dialog(val){
                if (!val) {

                }
            }
        },
        filters: {},
        watch: {
            value(val){
                this.visible=val;
            },
            visible(val){
                this.$emit('input',val);
            }
        },
        computed: {},
        props: {
            value:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            integerInput:require('../../../components/integer-input.vue').default,
        }
    }
</script>
