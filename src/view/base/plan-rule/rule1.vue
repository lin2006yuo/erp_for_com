<template>
    <span :class="!!$slots.default?'':'rule1'">
        <div>
        <label :class="$slots.default?'rule1-parent' : ''" :title="form.title">
           <!-- <input
                    v-model="input"
                    name="Fruit" type="checkbox" class="el-checkbox__inner"/>
            {{form.title}}-->
            <el-checkbox name="Fruit" v-model="input" :label="form.title"></el-checkbox>
        </label>
        <el-select class="inline condition" v-if="condition.length > 1" v-model="operator.sel">
            <el-option v-for="item in condition" :key="item_value(item)" :label="item_label(item)" :value="item_value(item)"></el-option>
        </el-select>
        <span v-if="condition.length === 1">
            {{item_label(condition[0])}}
        </span>
        <div class="rule1-child" v-if="$slots.default">
            <slot></slot>
        </div>
        <p class="rule-desc" v-if="form.desc">{{form.desc}}</p>
            </div>
    </span>
</template>
<style lang="stylus">
    .rule1-parent{
        font-size:16px;
        display: block;
        border-top:2px solid #4e92ce;
    }
    .rule1-child{
        padding:15px;
    }
    .rule1 + .rule1{
        width:33%;
        label{
            width: auto;
            /*overflow: hidden;*/
            text-overflow:ellipsis;
            white-space: nowrap;
        }
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
        watch:{
            input(val){
                this.$emit('input',val);
            },
            value(val){
                this.input = val;
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
