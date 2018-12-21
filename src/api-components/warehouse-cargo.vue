<template>
    <ui-select v-model="warehouse_cargo"
               remote
               filterable
               clearable
               :disabled="disabled"
               :remote-method="remote"
               placeholder="请选择/输入...">
        <el-option v-for="option in options"
                   :key="option.id"
                   :label="option.code"
                   :value="option.id">
        </el-option>
    </ui-select>
</template>
<style lang="stylus">

</style>
<script>

    import {warehouse_cargo_lists} from '../api/local';
    import {mapGetters, mapActions} from 'vuex';
    export default{
        data(){
            return{
                warehouse_cargo:this.value,
                filter:'',
                data:this.value
            }
        },
        mounted(){
            if(this.warehouseCargo.length <= 0&&!!this.paramsData){
                this.$http(warehouse_cargo_lists,this.paramsData).then(res=>{
                    this.load(res);
                    this.refresh_options(this.value);
                });
            }else{
                this.refresh_options(this.value);
            }
        },
        methods:{
            remote(query){
                this.filter = query;
            },
            ...mapActions({load:'api/warehouseCargo'}),
            refresh_options(val){
                this.warehouse_cargo = val;
                this.data = val;
            }
        },
        watch:{
            warehouse_cargo(val){
                this.$emit('input', val);
                this.refresh_options(val);
            },
            value(val){
                this.refresh_options(val);
            }
        },
        computed:{
            ...mapGetters({warehouseCargo:'api/warehouseCargo'}),
            options(){
                if(this.data){
                    return this.warehouseCargo.filter(row=>row.id===this.data);
                }
                let ret = [];
                if(this.filter){
                    ret = this.warehouseCargo.filter(row=>{
                        return row.code.indexOf(this.filter) >= 0
                    });
                }else{
                    ret = this.warehouseCargo;
                }
                return ret.split(1, 20);
            }
        },
        props:{
            value:{
                required:true,
            },
            disabled:{},
            paramsData:{}
        },
        components:{
            uiSelect:require('../components/ui-select.vue').default,
        }
    }
</script>
