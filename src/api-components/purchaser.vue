<template>
    <ui-select v-model="purchaser"
               remote
               filterable
               clearable
               :disabled="disabled"
               :remote-method="remote"
               placeholder="选择/搜索..."
               default-first-option>
        <el-option v-for="option in options"
                   :key="option.id"
                   :label="option.realname"
                   :value="option.id">
        </el-option>
    </ui-select>
</template>d
<style lang="stylus">

</style>
<script>

    import {api_get_publish} from '../api/procurement-plan';
    import {mapGetters, mapActions} from 'vuex';
    export default{
        data(){
            return{
                purchaser:this.value,
                filter:'',
                data:this.value
            }
        },
        mounted(){
            if(this.purchasers.length <= 0){
                this.$http(api_get_publish).then(res=>{
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
            ...mapActions({load:'api/purchasers'}),
            refresh_options(val){
                this.purchaser = val;
                this.data = val;
            }
        },
        watch:{
            purchaser(val){
                this.$emit('input', val);
                this.refresh_options(val);
            },
            value(val){
                this.refresh_options(val);
            }
        },
        computed:{
            ...mapGetters({purchasers:'api/purchasers'}),
          options(){
            if(this.data){
            	return this.purchasers.filter(row=>row.id===this.data);
            }
            let ret = [];
            if(this.filter){
              ret = this.purchasers.filter(row=>{
                return row.realname.indexOf(this.filter) >= 0
              });
            }else{
              ret = this.purchasers;
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
