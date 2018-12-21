<template>
    <draggable v-model="draggableData"
               :style="styleProp"
               :options="options">
        <el-tag type="primary"
                class="mr-sm"
                v-for="(item,index) in draggableData"
                :closable="true"
                @close="close_tag(item,index)"
                :key="index">
            <span @dblclick="dblclick(item)"
                  :class="[item.isSign?'required-sign':'','pointer']">{{item.name}}</span>
        </el-tag>
        <span>
            <span class="operate ml-sm mr-sm"
                  v-if="showSign"
                  @click="merge">合并单词</span>
            <span class="delete-icon"
                  v-if="draggableData&&draggableData.length>0"
                  @click="clear_all"
                  slot="footer" title="清空所有"></span>
        </span>
    </draggable>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                draggableData:this.value
            }
        },
        methods:{
            get_date(){
                return Date.now()
            },
            dblclick(item){
                item.isSign = !item.isSign;
                item.time = !!item.isSign?this.get_date():0;
            },
            close_tag(val,index){
                this.draggableData.splice(index,1);
                this.$emit('close-tag',val,index);
            },
            clear_all(){
                this.draggableData = [];
            },
            /*排序*/
            title_sort(list){
                let newValue = '';
                for(let i=0;i<list.length-1;i++){
                    for(let j=0;j<list.length-1-i;j++){
                        if(list[j].time>list[j+1].time){
                            newValue = list[j];
                            list[j] = list[j+1];
                            list[j+1] = newValue;
                        }
                    }
                }
                return list
            },
            merge(){
                let findIndex= this.draggableData.findIndex(row=>row.isSign);
                let list = this.draggableData.filter(row=>row.isSign);
                list = this.title_sort(list);
                let otherList = this.draggableData.filter(row=>!row.isSign);
                let newWord = list.map(row=>row.name).join(' ');
                let obj = {
                    name:newWord,
                    isSign:false
                };
                otherList.splice(findIndex,0,obj);
                this.draggableData = otherList;
            },
        },
        computed:{
            showSign(){
                let list =  this.draggableData.filter(row=>row.isSign);
                return !!(list.length>=2)
            }
        },
        watch:{
            draggableData(val){
                this.$emit('input',val);
            },
            value(val){
                this.draggableData = val
            }
        },
        props:{
            value:{},
            options:{},
            styleProp:{
                default(){
                    return {
                        minHeight:'26px',
                        width:'100%',
                    }
                }

            }
        },
        components:{

        }
    }
</script>