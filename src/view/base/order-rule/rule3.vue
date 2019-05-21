<template>
    <div class="rule3">
        <label>{{form.title}}</label>
        <el-select class="inline condition" v-if="condition.length > 1" v-model="operator.sel">
            <el-option v-for="item in condition" :key="item_value(item)" :label="item_label(item)" :value="item_value(item)"></el-option>
        </el-select>
        <span v-if="condition.length === 1">
            {{item_label(condition[0])}}
        </span>
        <input v-if="form.key=='strL'" style="width:100px" class="inline el-input__inner" v-model="input" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" type="number" min="0">
        <el-input type='textarea' v-model="input" v-else-if="form.key==='bnO'||form.key==='biO'"></el-input>
        <el-input class='inline' v-model="input" v-else></el-input>
        <p class="rule-desc" v-if="form.desc">{{form.desc}}</p>
    </div>
</template>
<style lang="stylus">
.condition{
    width:80px;
    text-align: center;
}
</style>
<script>

    export default{
        data(){
            return{
                input:this.value,
            }
        },
        methods:{
            item_label(item){
                return Object.values(item)[0];
            },
            item_value(item){
                return Object.keys(item)[0];
            }
        },
        watch:{
            input(val){
                this.$emit('input',val);
            },
            value(val){
                this.input = val;
            }
        },
        computed:{
            condition(){
                if(typeof this.form.condition === 'array'){
                    return this.form.condition;
                }else{
                    return objToArray(this.form.condition, (val,key) =>{
                        let obj = {};
                        obj[key] = val;
                        return obj;
                    });
                }
            }
        },
        props:{
            form:{},
            value:{},
            operator:{}
        },
        components:{

        }
    }
</script>
