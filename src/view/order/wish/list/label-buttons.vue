<template>
    <div class="wish-label-buttons" :class="disabled ? 'disabled' : ''">
        <label :style="labelStyle">{{label}}</label>
        <div style="flex:1">
            <el-button size="mini"
                       v-for="(item,index) in buttons"
                       :key="index"
                       @click.native="buttonClick(index,item)"
                       :type="index==current?'primary':'default'" class="button">
                {{item.name || item.label}}{{item.count | filterButton}}
            </el-button>
        </div>
        <slot v-if="$slots.default"></slot>
    </div>
</template>
<style lang="stylus">
    .wish-label-buttons{
        font-size:0;
        display: flex;
        >*{
            display: inline-block;
            vertical-align: middle;
            height:100%;
            line-height: 29px;
        }
        .button{
            margin-bottom:3px;
            margin-left: 0;
            margin-right: 5px;
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
            },
            refresh(){
                this.buttonClick(0, this.buttons[0]);
            }
        },
        watch:{
            current(newIndex){
                this.$emit("select", newIndex, this.item);
            },
            buttons(bts){
                if (bts.length >= 1) {
                    this.buttonClick(this.current, bts[this.current]);
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
