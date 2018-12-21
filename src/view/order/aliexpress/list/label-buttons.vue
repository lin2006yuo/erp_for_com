<template>
    <div class="c-label-buttons" :class="disabled ? 'disabled' : ''">
        <div style="display:flex;flex-wrap:wrap" class="box-wraps">
            <label :style="labelStyle" class="inline">{{label}}</label>
            <div class="inline" style="flex:1">
                <el-button size="mini"
                           v-for="(item,index) in display"
                           :key="index"
                           @click.native="buttonClick(index,item)"
                           :type="index==current?'primary':'default'" class="button">
                    {{item.name || item.label}}{{item.count | filterButton}}
                </el-button>
                <el-select v-if="showMoreMore" class="inline ml-xs" v-model="select"
                           filterable
                >
                    <el-option v-for="item in remains"
                               :label="item.label || item.name"
                               :value="item.value"
                               :key="item.value"
                    ></el-option>
                </el-select>
                <slot v-if="$slots.default"></slot>
            </div>
        </div>
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
        .box-wraps{
            >div{
                >.el-button{
                    margin-left:0 !important;
                    margin-right:5px;
                }
            }
        }
        .disabled{
            cursor: not-allowed;
            opacity: 0.7;
        }
        label{
            font-size:1.2rem;
            line-height: 29px;
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
                adds:[],
                select:''
            }
        },
        filters:{
            filterButton(count){
                return `(${count})`;
//                if(count>0){
//                    return `(${count})`
//                }else{
//                    return ''
//                }
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
            },
            select(sel){
                if(sel !== ''){
                    let find = this.remains.find(row=>{
                        return row.value === sel;
                    });
                    if(find){
                        this.adds.push(find)
                    }
                    this.$nextTick(()=>{
                        this.select = '';
                    });
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
                    textAlign: this.labelAlign || 'right',
                    fontWeight:this.fontWeight || 'normal',
                };
                if(this.labelWidth){
                    style.maxwidth = `${this.labelWidth}px`
                }
                return style;
            },
            display(){
                return [...this.rems,...this.adds];
            },
            rems(){
                return this.buttons.slice(0, this.max);
            },
            remains(){
                let ret = [];
                this.buttons.forEach(but=>{
                    if(this.display.indexOf(but) < 0){
                        ret.push(but);
                    }
                });
                return ret;
            },
            showMoreMore(){
                if(this.display.length < this.buttons.length){
                    return true;
                }else{
                    return false;
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
            labelWidth:{
                type:[String, Number],
                default(){
                    return 120;
                }
            },
            labelAlign:{},
            fontWeight:{},
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
