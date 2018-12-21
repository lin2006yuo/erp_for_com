<template>
    <div>
        <el-input type="number" v-model="number"></el-input>
    </div>
</template>

<script>

    export default{
        data(){
            return {
                number:''
            }
        },
        methods: {
            init(){

            }
        },
        computed: {

        },
        watch: {
            value(val){
                this.number = val;
            },
            number(val){
                if(val === 0){
                   val = '';
                }
                this.$emit('input', val);
            }
        },
        props: {
            value:{
                required:true,
                type:[Number,String,Null]
            }
        }
    }
</script>

