<template>
    <div class="mt-xs rule5">
        <el-checkbox v-model="check" :label="form.title" :class="form.title ? 'label-width':''"></el-checkbox>
        <el-select class="inline condition" v-if="condition.length > 1" v-model="operator.sel">
            <el-option v-for="item in condition" :key="item_value(item)" :label="item_label(item)" :value="item_value(item)"></el-option>
        </el-select>
        <span v-if="condition.length === 1">
            {{item_label(condition[0])}}
        </span>
        <integer-input :reg-rule="/[^0-9\-]/" class="inline" v-model="value_" :min="1"></integer-input>
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
                index:-1
            }
        },
        mounted(){
            let updateChilds = this.$parent.updateChilds;
            updateChilds && updateChilds();
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
            },
            hasCond(){
                return this.condition.length > 0;
            }
        },
        watch:{
            value_(val){
                this.$emit('input', val);
//                if(this.hasCond){
//                    this.$parent.$children((child, index) =>{
//                        if(child.index !== undefined && child.index !== index){
//
//                        }
//                    })
//                }
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
            integerInput:require('@/components/integer-input.vue').default,
        }
    }
</script>
