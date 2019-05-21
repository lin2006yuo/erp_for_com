<template>
    <el-select
            remote
            v-model="select"
            filterable
            :multiple="multiple"
            placeholder="请输入Sku"
            :remote-method="remoteMethod"
            :loading="loading"
    >
        <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value"></el-option>
    </el-select>
</template>
<style lang="stylus" scoped>

</style>
<script>

    import http from '../lib/http';
    export default{
        data(){
            return{
                loading:false,
                select:'',
                options:[],
            }
        },
        mounted(){
            if(this.value){
                this.select = this.value
            }
        },
        methods:{
            remoteMethod(query){
                if(query !== ''){
                    this.loading = true;
                    let req = null;
                    switch (typeof this.request){
                        case 'string':
                            req = this.$http(http('GET',config.apiHost+this.request, {keyword:query}));
                            break;
                        case 'function':
                            req = this.request(query);
                            break;
                    }
                    req.then(res=>{
                        let temp = [];
                        res.forEach(row=>{
                            temp.push(this.fixResult(row));
                        });
                        this.options = temp;
                        this.loading = false;
                    }).catch(code=>{
                        this.loading = false;
                    })
                }{
                    this.options = [];
                }
            },
        },
        watch:{
            value(val){
                this.select = val;
            },
            select(val){
                this.$emit('input', val);
            }
        },
        props:{
            value:{},
            request:{
                type:[String, Function],
                default:'goods/goods_sku/query'
            },
            fixResult:{
                type:Function,
                default(ret){
                    return {label:ret,value:ret};
                }
            },
            multiple:{
                type:Boolean,
                default(){
                    return false;
                }
            }
        },
        components:{

        },
    }
</script>