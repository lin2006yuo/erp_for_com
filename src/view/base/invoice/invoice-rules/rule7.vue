<template>
    <div>
        <el-checkbox v-model="check" :label="form.title" :class="form.title ? 'label-width':''"></el-checkbox>
        <span v-if="form.condition"
              v-for="item in form.condition">{{item}}</span>
        <el-input class="inline" v-model="value1"></el-input>
        <span v-if="form.unit">{{form.unit}}</span>
        <p class="rule-desc" v-if="form.desc">{{form.desc}}</p>
        <el-input class="inline" v-model="value2"></el-input>
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
        mounted(){
        },
        computed:{
            check(){
                return this.value_[0] !== '' || this.value_[1] !== '';
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
            value1:{
                get(){
                    return this.value_[0];
                },
                set(val){
                    this.value_.splice(0,1,val);
                }
            },
            value2:{
                get(){
                    return this.value_[1];
                },
                set(val){
                    this.value_.splice(1,1,val);
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