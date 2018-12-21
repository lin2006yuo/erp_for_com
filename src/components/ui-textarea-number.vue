<template>
    <div class="p-ui-textarea-number">
        <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="textarea"
                @change="change">
        </el-input>
        <span>还可以写{{count}}个字</span>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default{
        data(){
            return {
                textarea:"",
                temp:"",
            }
        },
        created(){
        },
        mounted(){
        },
        computed: {
            count(){
                return this.number-this.textarea.length
            }
        },
        methods: {
            change(){
                let length=this.textarea.length
                if(length<=this.number){
                    this.temp=this.textarea;
                }else {
                    this.textarea="";
                    this.$nextTick(()=>{
                        this.textarea=this.temp;
                    })
                }
            }
        },
        filters: {},
        watch: {
            value(val){
                this.textarea=val;
            },
            textarea(val){
                this.$emit("input",val)
            }
        },
        props: {
            value:{
            },
            number:{
                type: Number,
                default(){
                    return 100;
                },
            }
        },
        components: {}
    }
</script>