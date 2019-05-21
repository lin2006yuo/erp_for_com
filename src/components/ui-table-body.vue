<template>
    <div class="c-ui-table">
        <table class="template ui-table-head" ref="tableheader">
            <colgroup>
                <col v-for="head in cols" :width="head_width(head)" >
            </colgroup>
            <thead>
            <tr>
                <th v-for="head in heads" :colspan="colspan(head)" :style="get_width(head)">
                    <el-checkbox v-model="checkAll"  v-if="head.isCheck" @change="check_all" ></el-checkbox>
                    <span v-else>{{head_title(head)}}</span>
                </th>
            </tr>
            </thead>
        </table>
        <div  ref="table"  class="ui-table-body" :style="bodyStyle">
            <table class="template secTable"    :style="bodyWidth" cellpadding="0" cellspacing="0">
                <colgroup>
                    <col v-for="head in cols"  :width="head_width(head)">
                </colgroup>
                <slot></slot>
            </table>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-ui-table {
        table.template thead tr {
            background-color: #EFF2F7;
            font-weight: 600;
        }
        .ui-table-head {
            width: 100%;

        }
        .ui-table-body {
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
        }
        .template.secTable {
            border-top: none;
        }
    }


</style>
<script>

    export default{
        data(){
            return{
                tableRect:{},
                checkAll:false,
            }
        },
        methods:{
            get_width(head){
                if(head.colspan){
                    let widths=head.colspan*head.width+"%";
                    return {width:widths}
                }
            },
            colspan(head){
                    if(typeof head === 'string'){
                        return 1;
                    }else{
                        return head.colspan || 1;
                    }
            },
            head_width(head){
                if(typeof head === 'string'){
                    return `${1 / this.headsLen * 100}%`;
                }else{
                    if(head.size){
                        return `${head.size}px`;
                    }else{
                        return `${head.width}%`;
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
            }

        },
        computed:{
            bodyStyle(){
                return {
                    height:`${this.bodyHeight}px`,
                }
            },
            bodyWidth(){
                this.$nextTick(()=>{
//                   var  a= this.$refs.tableheader.getBoundingClientRect();
                    var b=window.getComputedStyle(this.$refs.tableheader);
                    this.$set(this.tableRect,"width",b.width) ;
                })
                return  this.tableRect
            },
            headsLen(){
                return this.heads.length;
            },
            cols(){
                let ret = [];
                this.heads.forEach(head=>{
                    if(typeof head === 'string'){
                        ret.push(head);
                        return;
                    }
                    if(head.colspan){
                        Array.prototype.seq(1,head.colspan).forEach(r=>ret.push(head));
                    }
                });
                return ret;
            }
        },
        watch:{
            checkAll(val){
                this.$emit("input",val)
            },
            value(val){
                this.checkAll=val;
            },

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
            value:{}

        },
        components:{

        }
    }
</script>