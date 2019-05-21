<template>
    <ui-select v-model="operator"
               remote
               filterable
               clearable
               :disabled="disabled"
               :remote-method="remote"
               placeholder="请选择/输入...">
        <el-option v-for="option in options"
                   :key="option.id"
                   :label="option.realname"
                   :value="option.id">
        </el-option>
    </ui-select>
</template>
<style lang="stylus">

</style>
<script>

    import {api_warehouse_staffs} from '../api/warehouse-cargo';
    import {mapGetters, mapActions} from 'vuex';
    export default{
        data(){
            return{
                operator:this.value,
                filter:'',
                data:this.value
            }
        },
        mounted(){
            if(this.warehouseStaffs.length <= 0){
                this.$http(api_warehouse_staffs).then(res=>{
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
            ...mapActions({load:'api/warehouseStaffs'}),
            refresh_options(val){
                this.operator = val;
                this.data = val;
            }
        },
        watch:{
            operator(val){
                this.$emit('input', val);
                this.refresh_options(val);
            },
            value(val){
                this.refresh_options(val);
            }
        },
        computed:{
            ...mapGetters({warehouseStaffs:'api/warehouseStaffs'}),
          options(){
            if(this.data){
            	return this.warehouseStaffs.filter(row=>row.id===this.data);
            }
            let ret = [];
            if(this.filter){
              ret = this.warehouseStaffs.filter(row=>{
                return row.realname.indexOf(this.filter) >= 0
              });
            }else{
              ret = this.warehouseStaffs;
            }
            return ret.split(1, 20);
          }
        },
        props:{
            value:{
                required:true,
            },
            disabled:{}
        },
        components:{
            uiSelect:require('../components/ui-select.vue').default,
        }
    }
</script>
