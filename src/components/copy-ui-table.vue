<template>
    <div class="c-ui-table-important">
        <table class="template ui-table-head" ref="tableheader">
            <colgroup>
                <col v-for="head in cols" :width="head_width(head)">
            </colgroup>
            <tbody>
                <tr>
                    <th v-for="(item,index) in firstHeader"
                        :rowspan="item.rowspan"
                        :colspan="item.colspan">
                        {{item.label}}
                    </th>
                </tr>
                <tr>
                    <th v-for="(head,index) in heads" v-if="!head.colspan&&!head.rowspan">
                        <el-checkbox v-model="checkAll"  v-if="head.isCheck" @change="check_all" ></el-checkbox>
                        <span v-else :class="{'require-star':head.isRequired}">{{head_title(head)}}
                            <span class="caret-wrapper" v-if="head.isSort">
                                <i class="sort-caret ascending" @click="asc_click(head)"></i>
                                <i class="sort-caret descending" @click="desc_click(head)"></i>
                            </span>
                        </span>
                    </th>
                </tr>
            </tbody>
        </table>
        <div  ref="table"  class="ui-table-body"   v-resize="{height:bodyHeight}" v-if="!isFix">
            <table v-if="hasData" class="template secTable"    :style="table_resize()">
                <colgroup>
                    <col v-for="head in cols" :width="head_width(head)">
                </colgroup>
                <slot></slot>
            </table>
            <span class="no-data-reminder" v-else >
                <i></i>
                <span>{{firstLoading?'请查询数据！':'暂无数据'}}</span>
            </span>
        </div>
        <div  ref="table"  class="ui-table-body"  :style="bodyStyle"   v-else>
            <table class="template secTable"    :style="table_resize()">
                <colgroup>
                    <col v-for="head in cols" :width="head_width(head)">
                </colgroup>
                <slot></slot>
            </table>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-ui-table-important{
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, .12), 0px 0px 6px 0px rgba(0, 0, 0, .04);
        span.require-star:before{
            content:"*";
            margin-right:3px;
            color:red;
        }
        table.template thead tr{
            background-color: #EFF2F7;
            /*background-color: #444;*/
            font-weight: 600;
        }
        .caret-wrapper{
            position: relative;
            cursor: pointer;
            display: inline-block;
            vertical-align: middle;
            margin-left: 5px;
            margin-top: -2px;
            width: 16px;
            height: 34px;
            /*overflow: visible;*/
            overflow: initial;
            .sort-caret{
                display: inline-block;
                width: 0;
                height: 0;
                border: 0;
                content: "";
                position: absolute;
                left: 3px;
                z-index: 2;
                &.ascending {
                    top: 11px;
                    border-top: none;
                    border-right: 5px solid transparent;
                    border-bottom: 5px solid #99a9bf;
                    border-left: 5px solid transparent;
                    &:active{
                        border-bottom-color: #475669;
                    }
                }

                &.descending {
                    bottom: 11px;
                    border-top: 5px solid #99a9bf;
                    border-right: 5px solid transparent;
                    border-bottom: none;
                    border-left: 5px solid transparent;
                    &:active{
                        border-top-color: #475669;
                    }
                }
            }

        }
        .ui-table-head{
            width:100%;
            /*border-left:1px solid #ddd;*/
            /*color:#fff;*/
        }
        .ui-table-body{
            width:100%;
            overflow-x: hidden;
            overflow-y: auto;
            border-bottom:1px solid #ddd;
            border-right:1px solid #ddd;
            border-top:none;
            box-sizing: border-box;
            position: relative;
            background :#fff;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
            .no-data-reminder{
                position: absolute;
                top:15%;
                left:50%;
                transform: translate(-50%, -50%);
                color: rgb(94, 118, 130);
                display:flex;
                flex-direction :row;
                align-items :center;
                justify-content :center;
                i{
                    display:inline-block;
                    width :60px;
                    height :60px;
                    background-image:url(../assets/no-data.svg);
                    background-size :60px 60px;
                }
            }
        }
        .template.secTable{
            border-top:none;
            border-left:none;
        }
    }
</style>
<script>
    import { addResizeListener, removeResizeListener } from '@/lib/resize';
    import {mapGetters} from 'vuex';
    export default{
        data(){
            return{
                tableRect:{},
                checkAll:false,
            }
        },
        created(){
            this.$nextTick(()=>{
                // let btn=document.getElementsByClassName("side-button changeTable")[0]
                // addResizeListener(btn,this.table_resize)
                addResizeListener(this.$refs.tableheader,this.table_resize)
            })
        },
        beforeDestroy() {
            // let btn=document.getElementsByClassName("side-button changeTable")[0]
            // removeResizeListener(btn, this.table_resize);
            removeResizeListener(this.$refs.tableheader, this.table_resize);
        },
        methods:{
            asc_click(val){
                this.$set(val,'order','asc');
                this.$emit("sort-click",val);
            },
            desc_click(val){
                this.$set(val,'order','desc');
                this.$emit("sort-click",val);
            },
            table_resize(){
                this.$nextTick(()=>{
//                    var  a= this.$refs.tableheader.getBoundingClientRect();
                    var b=window.getComputedStyle(this.$refs.tableheader);
                    this.$set(this.tableRect,"width",b.width) ;
                })
                return  this.tableRect
            },
            head_width(head){
                if(typeof head === 'string'){
                    return `${1 / this.headsLen * 100}%`;
                }else{
                    let parentWidth=parseInt(this.tableRect.width);
                    if(!!this.isFixLength){
                        if(head.size){
                            return `${head.size}`;
                        }else{
                            let width=0;
                            parentWidth&&(parentWidth-this.isFixLength)>0&&(width=(Math.round((parentWidth-this.isFixLength)*head.width/100)))
                            return `${width}`;
                        }
                    }else {
                        return `${Math.round(head.width*parentWidth/100)}`;
                    }
                }
            },
            head_title(head){
                if(typeof head === 'string'){
                    return head;
                } else{
                    return head.title || head.label;
                }
            },
            check_all(){
                this.$emit("check",this.checkAll)
            },
        },
        computed:{
            ...mapGetters({
                viewMode:'ui/viewMode',
            }),
            bodyStyle(){
                return {
                    maxHeight:`${this.bodyHeight}px`,
                }
            },
            headsLen(){
                let  heads = this.heads.filter(row=>{
                    return !row.notCount
                })
                return heads.length
//                return this.heads.length;
            },
            cols(){
                return this.heads.filter(row=>{
                    return !row.notCount
                })
            },
            firstHeader(){
                let list = this.heads.filter(row=>row.colspan||row.rowspan);
                return this.heads.filter(row=>row.colspan||row.rowspan)
            },
            isFixLength(){
                if(!this.heads[0]) return false;
                if(typeof this.heads[0] ==="string" ){
                    return false
                }else {
                    let find=this.heads.find(row=>row.size);
                    if(find){
                        let size=0;
                        this.heads.forEach(row=>{
                            row.size&& (size+=row.size)
                        })
                        return size
                    }else {
                        return  false
                    }
                }
            },
        },
        watch:{
            checkAll(val){
                this.$emit("input",val)
            },
            value(val){
                this.checkAll=val;
            },
            viewMode(){
                this.table_resize()
            }
        },
        props:{
            heads:{
                required:true,
                type:Array
            },
            bodyHeight:{
                type:Number
            },
            isCheck:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            isFix:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            value:{},
            hasData:{
                type:Boolean,
                default(){
                    return true;
                }
            },
            firstLoading:{
                default(){
                    return false
                }
            },
//            firstHeader:{
//                type:Array,
//                default(){
//                    return [];
//                }
//            },
        },
        components:{

        }
    }
</script>
