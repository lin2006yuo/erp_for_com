<template>
    <el-form class="inline access-rule" label-width="50px">
        <el-form-item v-for="(rule,name) in rules" :key="name" :label="`${getname(name)}:`">
            <template v-if="ruletype(rule) === 'input' ">
                <el-input></el-input>
            </template>
            <template v-if="ruletype(rule) === 'select' ">
                <el-select v-model="rule.value" @change="(val)=>{console.log('val');change(rule, val)}">
                    <el-option v-for="opt in ruleoptions(rule)"
                               :label="opt.label"
                               :value="opt.value"
                               :key="opt.value"
                    ></el-option>
                </el-select>
            </template>
        </el-form-item>
    </el-form>
</template>
<style lang="stylus">
    .access-rule{
        vertical-align: text-top;
    }
</style>
<script>

    export default{
        data(){
            return{

            }
        },
        methods:{
            getname(name){
                let name2 = name.split('|');
                return name2[1] || name2[0];
            },
            ruletype(rule){
                let rules = rule.split('|');
                for(let i = 0; i < rules.length; i++){
                    let m = null;
                    if(m = /^type:(input|select|selects)$/i.exec(rules[i])){
                        return m[1];
                    }
                }
                return 'input';
            },
            ruleoptions(rule){
                let m = null;
                if(m = /select:([^|]+)/i.exec(rule)){
                    let opts = m[1].split(';');
                    let ret = [];
                    opts.forEach(opt=>{
                        opt = opt.split(',');
                        ret.push({label:opt[0],value:opt[1]||opt[0]});
                    })
                    return ret;
                }
            },
            change(rule, val){
                console.log(rule);
                console.log(val);
            }
        },
        props:{
            rules:{
                required:true
            }
        },
        components:{

        }
    }
</script>