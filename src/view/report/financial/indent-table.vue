<template>
    <div class="c-joom-table">
        <table class="template ui-table-head" :style="isHidden" ref="tableheader">
            <tbody>
            <tr>
                <th v-for="(head,index) in heads" :width="head_width(head)">
                    <span>{{head_title(head)}}</span>
                </th>
            </tr>
            </tbody>
        </table>
        <div ref="table" class="ui-table-body" :style="isHidden" v-resize="{height:bodyHeight}">
            <table v-if="hasData" class="template secTable" :style="table_resize()">
                <!--<colgroup>-->
                <!--<col v-for="head in cols" :width="head_width(head)">-->
                <!--</colgroup>-->
                <slot></slot>
            </table>
            <span class="no-data-reminder" v-else>
                <i></i>
                <!--<span>请查询数据！</span>-->
                <span>{{firstLoading?'请查询数据！':'暂无数据'}}</span>
            </span>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-joom-table{
        overflow-x: scroll;
        table .template thead tr{
            background-color: #EFF2F7;
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
            width:auto;
            border-left:1px solid #ddd;
        }
        .ui-table-body{
            width:auto;
            overflow-x: hidden;
            overflow-y: auto;
            border:1px solid #ddd;
            border-top:none;
            box-sizing: border-box;
            position: relative;
            .no-data-reminder{
                position: fixed;
                top:50%;
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
                    background-image:url(../../../assets/no-data.svg);
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
    import {mapGetters} from 'vuex';
    export default{
        data(){
            return{
                tableRect:{},
                checkAll:false,
            }
        },
        created(){
            window.addEventListener('resize', ()=>{
                setTimeout(()=>{
                    if(this.$refs.tableheader){
                        this.table_resize()
                    }
                },100)
            });
        },
        mounted(){
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
                    var b=window.getComputedStyle(this.$refs.tableheader);
                    this.$set(this.tableRect,"width",b.width) ;
                })
                return this.tableRect
            },
            head_width(head){
                return `${head.size}px`;
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
                return this.heads.length;
            },
            cols(){
                return this.heads;
            },
            isHidden(){
                if(this.width){
                    return {
                        width:this.width+"px"
                    }
                }
            }
        },
        watch:{
            checkAll(val){
                this.$emit("input",val)
            },
            value(val){
                this.checkAll=val;
            },
            bodyHeight(val){
                console.log(val);
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
            width:{
                type:Number,
                default(){
                    return 100;
                },
            },
            firstLoading:{
                default(){
                    return false
                }
            }

        },
        components:{

        }
    }
</script>
