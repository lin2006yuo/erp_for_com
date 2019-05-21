<template>
    <div :class="disabled ? 'disabled' : ''">
        <label :style="labelStyle" style=" line-height:31px;">{{label}}</label>
        <el-button size="mini" @click.native="button_click(index)" v-for="(item,index) in buttons" :type="index==current?'primary':'default'" class="button">{{item.name}}{{item.count | filterButton}}</el-button>
    </div>
</template>
<style lang="stylus">
    .button{
        margin-bottom:3px;

    }
    .disabled{
        cursor: not-allowed;
        opacity: 0.7;
    }
    label{
        font-size:1.2rem;
    }
</style>
<script>
    
    export default{
        name: 'label-buttons',
        data(){
            return{
                current:0,
            }
        },
        filters:{
            filterButton(count){
                if(count>0){
                    return `(${count})`
                }else{
                    return ''
                }
            }
        },
        methods:{
            button_click(index){
                this.current = index;
            }
        },
        watch:{
            current(newIndex){
                this.$emit("select", newIndex, this.buttons[newIndex]);
            }
        },
        computed:{
            disabled(){
                if(this.todo != ''){
                    return true;
                }else{
                    return false;
                }
            },
            labelStyle(){
                if(this.labelWidth){
                    return {
                        width:`${this.labelWidth}px`,
                        display:'inline-block',
                        textAlign:'right'
                    };
                }else{
                    return {}
                }
            }
        },
        props:{
            buttons:{
                required:true,
                type:Array
            },
            label:{
                required:true,
                type:String
            },
            todo:{
                type:String,
                default:''
            },
            labelWidth:{}
        },
        components:{
        }
    }
</script>
