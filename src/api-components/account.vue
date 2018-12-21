<template>
    <el-select v-model="account"
               remote
               filterable
               clearable
               :remote-method="remote"
    >
        <el-option v-for="option in options"
                   :key="option.id"
                   :label="option.account_name"
                   :value="option.id"
        >
        </el-option>
    </el-select>
</template>
<style lang="stylus">

</style>
<script>

    import {api_get_account} from '../api/ebay-kandeng-public-module';
    import {mapGetters, mapActions} from 'vuex';
    export default{
        data(){
            return{
                account:this.value,
                options:[]
            }
        },
        mounted(){
            if(this.accounts.length <= 0){
                this.$http(api_get_account).then(res=>{
                    this.load(res.data);
                    this.refresh_options(this.value);
                });
            }else{
                this.refresh_options(this.value);
            }
        },
        methods:{
            remote(query){
                if(query){
                    return this.options = this.accounts.filter(row=>{
                        return row.account_name.indexOf(query) >= 0
                    });
                }
                return this.options = this.accounts.split(1,10);
            },
            ...mapActions({load:'api/getAccounts'}),
            refresh_options(val){
                const diff = (val || this.account);
                this.options = this.accounts.filter(row=>{
                    return row.id === diff;
                });
                this.account = val;
            }
        },
        watch:{
            account(val){
                this.$emit('input', val);
                this.refresh_options(val);
            },
            value(val){
                this.refresh_options(val);
            }
        },
        computed:{
            ...mapGetters({accounts:'api/getAccounts'})
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
