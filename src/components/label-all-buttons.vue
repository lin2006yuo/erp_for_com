<template>
    <div class="c-label-buttons" :class="disabled ? 'disabled' : ''">
        <label :style="labelStyle">{{label}}</label>
        <el-button size="mini"
                   v-for="(item,index) in buttons"
                   :key="index"
                   @click.native="buttonClick(index,item)"
                   :type="index==current?'primary':'default'" class="button">
            {{item.name || item.label}}{{item.count | filterButton}}
        </el-button>
        <slot v-if="$slots.default"></slot>
    </div>
</template>
<style lang="stylus">
    .c-label-buttons{
        font-size:0;
        >*{
            display: inline-block;
            vertical-align: middle;
            height:100%;
        }
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
    }

</style>
<script>

    export default{
        name: 'label-buttons',
        data(){
            return{
                current:'',
                item:0,
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
        mounted(){
            if(this.buttons.length >= 1){
                this.buttonClick(0, this.buttons[0]);
            }
        },
        methods:{
            buttonClick(index, item){
                  this.current = index;
                this.item = item;
            }
        },
        watch:{
            current(newIndex){
                this.$emit("select", newIndex, this.item);
            },
            buttons(bts){
                if(bts.length >= 1){
                    this.buttonClick(0, bts[0]);
                }
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
                let style = {
                    textAlign: this.labelAlign || 'right'
                };
                if(this.labelWidth){
                    style.width = `${this.labelWidth}px`
                }
                return style;
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
            labelWidth:{},
            labelAlign:{},
            max:{
                type:Number,
                default(){
                    return 10;
                }
            }
        },
        components:{
        }
    }
</script>
