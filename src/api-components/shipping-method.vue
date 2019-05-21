<template>
    <el-select v-model="shipping"
               remote
               filterable
               clearable
               :remote-method="remote"
    >
        <el-option v-for="option in options"
                   :key="option.value"
                   :label="option.label"
                   :value="option.value"
        >
        </el-option>
    </el-select>
</template>
<style lang="stylus">

</style>
<script>

    import {api_get_postway} from '../api/after-sale';
    import {mapGetters, mapActions} from 'vuex';
    export default{
        data(){
            return{
                shipping:this.value,
                options:[]
            }
        },
        mounted(){
            if(this.shippings.length <= 0){
                this.$http(api_get_postway).then(res=>{
                    this.load(res);
                    this.refresh_options(this.value);
                });
            }else{
                this.refresh_options(this.value);
            }
        },
        methods:{
            remote(query){
                console.log(`query :${query}`);
                if(query){
                    return this.options = this.shippings.filter(row=>{
                        return row.label.indexOf(query) >= 0
                    });
                }
                return this.options = this.shippings.split(1,10);
            },
            ...mapActions({load:'api/shippings'}),
            refresh_options(val){
                const diff = (val || this.supplier);
                console.log(`refresh_options  ${diff}`);
                this.options = this.shippings.filter(row=>{
                    return row.value === diff;
                });
                this.supplier = val;
            }
        },
        watch:{
            shipping(val){
                this.$emit('input', val);
                this.refresh_options(val);
            },
            value(val){
                this.refresh_options(val);
            }
        },
        computed:{
            ...mapGetters({shippings:'api/shippings'})
        },
        props:{
            value:{
                required:true,
            }
        },
        components:{

        }
    }
</script>