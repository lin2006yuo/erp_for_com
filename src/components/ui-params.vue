<template>
    <el-select v-model="value_"
               remote
               filterable
               clearable
               class="inline"
               :placeholder="placeholder"
               :remote-method="remotes">
        <el-option v-for="(option,index) in showOption"
                   :key="index"
                   :label="option.label"
                   :value="option.value">
        </el-option>
    </el-select>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {mapActions, mapGetters} from 'vuex';
    export default{
        data(){
            return {
                value_: this.value,
                query: '',
            }
        },
        mounted(){
                this.init();
        },
        computed:{
            ...mapGetters({accounts: 'params/channelAccount'}),
            getAccounts() {
                return this.accounts(this.type);
            },
            showOption(){
                let ret = [];
                for (let i = 0; i < this.getAccounts.length; i++) {
                    if (ret.length >= 30) {
                        break;
                    }
                    if (!this.query) {
                            ret.push(this.getAccounts[i]);
                    }else{
                        if(typeof this.query === 'number'){
                            if(this.getAccounts[i].value === this.query){
                                ret.push(this.getAccounts[i]);
                            }
                        }else{
                            if(this.getAccounts[i].label.toLocaleLowerCase().indexOf(this.query.toLocaleLowerCase()) >= 0){
                                ret.push(this.getAccounts[i]);
                            }
                        }
                    }
                }

                return ret;
                },
        },
        methods:{
            ...mapActions({load: 'params/setChannelAccount'}),
            init(){
                const callback = (options) =>{
                    this.load({type:this.type,channels:options})
                };
                if(this.type&&!this.getAccounts.length){
                        this.remote&&this.remote(callback);
                        !this.remote&&callback(this.options);
                }
            },
            remotes(query){
              this.query=  query;
            },
        },
        watch:{
                type(new_,old_){
                    console.log("typesssssssssssss",new_ )
                    this.init();
                },
                 value_(val){
                    this.$emit("input",val)
                },
                 value(val){
                    this.value_=val;
                },
        },
        props:{
            value:{},
            remote:{},
            type:{},
            force:{},//true|false
            placeholder:{},
            options:{}
        },
        components: {}
    }
</script>