<template>
    <div class="inline">
        <span v-for="param in params" :key="param.title">
            <label >{{param.title}}</label>
            <el-input v-if="param.type === 'input'"
                      v-model="param.param"
                      class="inline"></el-input>
            <el-select v-else-if="param.type==='muiSelect'"
                       v-model="param.param"
                       multiple
                       size="mini"
                       class="inline"
            >
                <el-option v-for="opt in param.opts"
                           :label="opt.label"
                           :value="opt.value"
                           :key="opt.value"
                ></el-option>
            </el-select>
            <el-select v-else
                       v-model="param.param"
                       class="inline"
                       size="mini"
            >
                <el-option v-for="opt in param.opts"
                           :label="opt.label"
                           :value="opt.value"
                           :key="opt.value"
                >
                </el-option>
            </el-select>
            <node-param :params="param_sub(param)"></node-param>
        </span>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        name:'node-param',
        data(){
            return{

            }
        },
        methods:{
            isEmpty(obj){
                return !isEmpty(obj);
            },
            param_sub(param){
                if(param.type === 'select'){
                    if(param.subs[param.param]){
                        return param.subs[param.param];
                    }else{
                        return [];
                    }
                }else{
                    return [];
                }
            }
        },
        props:{
            params:{}
        },
        components:{

        }
    }
</script>