<template>
    <page-dialog v-model="show" size="full" @open="open" :title='title'>
         <declare-set ref='declare'  title="默认申报设置" :default-data="defaultData" @refresh_set="refresh_set"></declare-set>
         <div slot='footer'>
             <el-button @click.native="sure" type='primary' size="mini">确定</el-button>
             <el-button @click.native="cancel" size="mini">取消</el-button>
         </div>
    </page-dialog>
</template>
<style lang="stylus">
    
</style>
<script>
    import declareSet from './declare-set.vue'        
    export default{
        data(){
            return{
                show: this.value,                            
            }
        },
        methods:{
           refresh_set() {
               this.$emit('refresh_set');
           },
           open() {},
           sure() {
               this.$refs.declare.save().then(res => {
                   if (res === 2) {
                       this.show = false;
                   }
               });
           },
           cancel() {
               this.show = false;
               this.$emit('refresh_set');
           },
        },
        watch:{
            // 监听值的变化。
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            title:{},
            defaultData:{}
        },
        components:{
            declareSet,
            pageDialog:require('../../../components/page-dialog.vue').default,          
        }
    }
</script>
