<template>
    <el-select v-model="supplier"
               remote
               filterable
               clearable
               :remote-method="remote"
               placeholder="请选择"
    >
        <el-option v-for="option in options"
                   :key="option.id"
                   :label="option.company_name"
                   :value="option.id"
        >
        </el-option>
    </el-select>
</template>
<style lang="stylus">

</style>
<script>

    import {api_pack_getSupplier} from '../api/pack';
    import {mapGetters, mapActions} from 'vuex';
    export default{
        data(){
            return{
                supplier:this.value,
                filter:''
            }
        },
        mounted(){
            if(this.suppliers.length <= 0){
                this.$http(api_pack_getSupplier).then(res=>{
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
            ...mapActions({load:'api/suppliers'}),
            refresh_options(val){
                if(val === 0){
                    val = '';
                }
                this.supplier = val;
            }
        },
        watch:{
            supplier(val){
                this.$emit('input', val);
                this.refresh_options(val);
            },
            value(val){
                this.refresh_options(val);
            }
        },
        computed:{
            ...mapGetters({suppliers:'api/suppliers'}),
          options(){
            	let ret = [];
            	if(this.placeHolder){
                    if(this.filter && this.filter !== '全部'){
                        ret = this.suppliers.filter(row=>{
                            if(row.id === this.filter) {
                                return row.company_name;
                            }else{
                                return row.company_name.indexOf(this.filter) >= 0
                            }
                        });
                    }else{
                        ret = this.suppliers;
                        ret = [{company_name:"全部",id:""},...ret];
                    }
                    return ret.split(1, 20);
                }else{
                    if(this.filter){
                        ret = this.suppliers.filter(row=>{
                            if(row.id === this.filter) {
                                return row.company_name;
                            }else{
                                return row.company_name.indexOf(this.filter) >= 0
                            }
                        });
                    }else{
                        ret = this.suppliers;
                    }
                    return ret.split(1, 20);
                }

          }
        },
        props:{
            value:{
                required:true,
            },
            placeHolder:{
                default(){
                    return false;
                }
            }
        },
        components:{

        }
    }
</script>
