<template>
    <div class="mt-xs">
        <el-checkbox v-model="check" :label="form.title" :class="form.title ? 'label-width':''"></el-checkbox>
        <el-select class="inline condition" v-if="condition.length > 1" v-model="operator.sel">
            <el-option v-for="item in condition" :key="item_value(item)" :label="item_label(item)" :value="item_value(item)"></el-option>
        </el-select>
        <span v-if="condition.length === 1">
            {{item_label(condition[0])}}
        </span>
        <el-input class="inline" v-model="value_" @blur="blur_value()"></el-input>
        <span v-if="form.unit">{{form.unit}}</span>
        <p class="rule-desc" v-if="form.desc">{{form.desc}}</p>
    </div>
</template>
<style lang="stylus">
</style>
<script>

    export default{
        data(){
            return{
                value_:this.value,
            }
        },
        methods:{
            item_label(item){
                return Object.values(item)[0];
            },
            item_value(item){
                return Object.keys(item)[0];
            },
          blur_value(){
            if (Number(this.value_) < 0) {
              this.value_= 0;
            }else if(Number(this.value_) > 0){
              this.value_ = Number(this.value_).toFixed(0);
            }
          }
        },
        computed:{
            check:{
                get(){
                    return !!this.value_;
                }
            },
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
            value_(val){
                this.$emit('input', val);
            },
            value(val){
                this.value_ = val;
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
