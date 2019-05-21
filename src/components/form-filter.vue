<template>
    <el-row class="c-form-filter">
        <el-col :span="2">
            <label>{{label}}</label>
        </el-col>
        <el-col :span="6">
            <el-select v-model="selected">
                <el-option v-for="option in filters" :label="option.label" :value="option.value"></el-option>
            </el-select>
        </el-col>
        <el-col :span="12">
            <el-select v-model="formValue" v-if="form.type === 'select'">
                <el-option v-for="option in form.options" :label="option.label" :value="option.value"></el-option>
            </el-select>
            <el-input v-model="formValue" v-if="form.type === 'input'">

            </el-input>
        </el-col>
        <el-col :span="4">
            <el-button @click.native="submit">筛选</el-button>
        </el-col>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                selected:0,
                formValue:0
            }
        },
        props:{
            label:{
                type:String,
                default:"筛选条件"
            },
            filters:{
                required:true,
                type:Array
            }
        },
        methods:{
            submit(){
                this.$emit('submit', this.selected, this.formValue);
            }
        },
        computed:{
            form(){
                return this.filters[this.selected].filter;
            }
        },
        components:{

        }
    }
</script>