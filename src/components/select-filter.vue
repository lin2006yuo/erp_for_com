<template>
    <el-select class="inline"
               filterable
               :clearable="true"
               :filter-method="filterable"
               v-model="value_"
               :placeholder="placeholder">
        <el-option v-for="option in innerOptions"
                   :key="option.value"
                   :value="option.value"
                   :label="option.label"
        >

        </el-option>
    </el-select>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default{
        data(){
            return{
                value_:this.value,
                innerOptions:[],
            }
        },
        methods:{
            filterable(keyword){
                if(keyword){
                    this.innerOptions = this.options.filter(row => row.label.indexOf(keyword)>=0);
                }else{
                    this.innerOptions = this.options.split(1, 20);
                }
            },
        },
        watch:{
            value(val){
                this.value_ = val;
            },
            value_(val){
                this.$emit('input', val);
            },
            options(val){
                this.innerOptions = val.split(1, 20);
            }
        },
        props:{
            value:{},
            options:{},
            placeholder:{},
        },
        components:{

        }
    }
</script>