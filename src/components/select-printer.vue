<template>
    <el-select :placeholder="disabled ? '当前PC无打印机' : placeholder" v-model="printer"
               :disabled="disabled">
        <el-option v-for="printer in printers"
                   :key="printer.key"
                   :label="printer.label"
                   :value="printer.value">
        </el-option>
    </el-select>
</template>
<style lang="stylus">

</style>
<script>
    import {mapGetters} from 'vuex';
    export default{
        data(){
            return{
                printer:this.value,
            }
        },
        mounted(){
            if(this.printers.length <= 0){
                this.$printersInit();
            }
            if(!this.printer){
                this.autoSetDefaultPrinter();
            }
        },
        methods:{
            autoSetDefaultPrinter(){
                const printer = this.printers[0];
                if(printer){
                    this.printer = printer.value;
                }else{
                    this.unwatch = this.$store.watch((_, gets) =>{
                        return gets['printer/all'];
                    }, () =>{
                        this.autoSetDefaultPrinter();
                    })
                }
            }
        },
        computed:{
            ...mapGetters({
                printers:'printer/all'
            }),
            disabled(){
                return this.printers.length <=0;
            }
        },
        watch:{
            printer(val){
                this.$emit('input',val);
            },
            value(val){
                this.printer = val;
            }
        },
        props:{
            placeholder:{
                default:'请选择打印机'
            },
            value:{},
        },
        destroyed(){
            if(this.unwatch){
                this.$store.unwatch(this.unwatch);
                this.unwatch = null;
            }
        },
        components:{

        }
    }
</script>
