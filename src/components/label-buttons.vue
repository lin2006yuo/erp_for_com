<template>
    <div class="c-label-buttons">
        <div style="display:flex;flex-wrap:wrap" class="box-wraps">
            <label :style="labelStyle" class="inline">{{label}}</label>
            <div class="inline" style="flex:1">
                <el-button size="mini"
                           v-for="(item,index) in display"
                           :key="index"
                           :loading="index === current && loading"
                           :disabled="isDisabled(item,index)"
                           :style="{cursor: !loading ? 'not-allowed;' : '', marginRight:buttonGap}"
                           @click.native="buttonClick(index,item, true)"
                           :type="index==current?'primary':'default'" class="inline mb-mini">
                    {{item.name || item.label}}{{item.count | filterButton}}
                </el-button>
                <el-select v-if="showMoreMore" :class="selectClass" v-model="select" filterable>
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
        .box-wraps{
            >div{
                >.el-button{
                    margin-left:0 !important;
                }
            }
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
                curIndex:'',
                current:'',
                item:0,
                adds:[],
                select:'',
                remoteButtons:[],
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
            if(this.realButtons.length >= 1){
                if(this.defaultIndex){
                    this.buttonClick(this.defaultIndex, this.realButtons[this.defaultIndex])
                }else{
                    this.buttonClick(0, this.realButtons[0]);
                }
            }
            if(this.remote){
                const callback = (buttons) =>{
                    this.remoteButtons = buttons;
                    if(this.remoteButtons.length > 0){
                        this.buttonClick(0, this.remoteButtons[0]);
                    }
                };
                this.remote(callback);
            }
        },
        methods:{
            buttonClick(index, item, handle = false){
                if(this.loading && handle)return;
                this.current = index;
                this.item = item;
                this.curIndex = this.buttons.findIndex(row=>row.value===item.value);
            }
        },
        watch:{
            current(newIndex){
                this.$emit("select", newIndex, this.item);
            },
            buttons(bts){
                if(bts.length >= 1){
                    this.current = -1;
                    this.curIndex = -1;
                    if(this.def){
                        let index = this.def(bts);
                        this.buttonClick(index, bts[index]);
                    }else{
                        this.buttonClick(0, bts[0]);
                    }
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
            labelStyle(){
                let style = {
                    textAlign: this.labelAlign || 'right',
                    fontWeight:this.fontWeight || 'normal',
                };

                if(this.labelWidth){
                    let width = '';
                    switch (typeof this.labelWidth){
                        case 'number':
                            width = `${this.labelWidth}px`;
                            break;
                        case 'string':
                            width = this.labelWidth;
                            break;
                    }
                    style.width = width;
                }
                return style;
            },
            selectClass(){
                return ['inline', 'ml-xs', 'mb-mini',...this.className.split(',')]
            },
            display(){
                return [...this.rems,...this.adds];
            },
            rems(){
                return this.realButtons.slice(0, this.max);
            },
            remains(){
                return this.buttons.filter(but=>{
                    return this.display.indexOf(but) < 0;
                });
            },
            showMoreMore(){
                return this.display.length < this.realButtons.length;
            },
            realButtons(){
                if(this.buttons){
                    return this.buttons;
                }else{
                    return this.remoteButtons;
                }
            },
        },
        props:{
            buttons:{
                type:Array
            },
            remote:{
                type:Function
            },
            def:{
                type:Function
            },
            label:{
                required:true,
                type:String
            },
            labelWidth:{
                type:[String, Number],
            },
            labelAlign:{},
            fontWeight:{},
            max:{
                type:Number,
                default(){
                    return 10;
                }
            },
            isDisabled:{
                default(){
                    return ()=>false;
                }
            },
            loading:{
                default(){
                    return false;
                }
            },
            buttonGap:{
                default(){
                    return '5px';
                }
            },
            className:{
                default:""
            },
            defaultIndex:{//页面首次加载默认第几个按钮为选中状态，不传就是默认第一个，在mounted中判断
                default: false
            }
        },
        components:{
            requestButton:require('@/global-components/request-button.vue').default,
        }
    }

</script>
