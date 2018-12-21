<template>
    <div>
        <label :style="labelStyle">{{label}}</label>
        <el-button :type="selectAll ? 'primary':'default'"
                   size="mini"
                   :disabled="moreSelect"
                   @click="all">全部{{allCount}}</el-button>
        <el-button v-for="(item, index) in filterButtonLists"
                   :key="index"
                   size="mini"
                   :type="button_item(item)"
                   @click="button_select(item)">
            {{item.label || item.name}}{{item.count | filterButton}}
        </el-button>
        <span v-if="buttonList.length>10" class="operate" @click="open_button_dialog">...全部账号</span>
        <el-checkbox v-model="moreSelect" v-if="buttonList.length > 0">启用多选</el-checkbox>
        <el-button type="primary" size="mini" v-if="moreSelect" @click="query">确定</el-button>
        <button-dialog v-model="buttonVisibility"
                       :selected-list="selectedList"
                       :more-select="moreSelect"
                       :title="label" @query="query"
                       @more-change="moreChange"
                       @replace-type="replaceType"
                       :is-close="true"
                       :button-list="buttonList"></button-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        name: 'select-more-button',
        data() {
            return {
                selectedList:[],//选中的列表
                selectAll:true,//全选
                moreSelect:false,//多选
                buttonVisibility:false
            }
        },
        filters:{
            filterButton(count){
                if (count > 0) {
                    return `(${count})`
                } else {
                    return ''
                }
            }
        },
        mounted(){},
        //添加新的变量时请用xxxXx
        //添加新方法时请用xxx_xx
        methods: {
            all(){
                this.selectAll = true;
                this.selectedList.length = 0;
                this.$emit('query', this.selectedList);
            },
            button_select(item){
                if(!this.moreSelect){
                    this.selectedList.length = 0;
                }
                let index = this.selectedList.findIndex(row=>{
                    return item.value === row.value;
                });
                if(index === -1){
                    this.selectAll = false;
                    this.selectedList.push(item);
                    if(!this.moreSelect){
                        this.query();
                    }
                } else {
                    this.selectedList.splice(index, 1);
                }
            },
            button_item(item){
                const select = 'primary';
                const def = 'default';
                if(this.selectedList.indexOfFun(row => item.value === row.value) >= 0){
                    return select;
                }
                return def;
            },
            query(){
                if(!this.moreSelect){
                    this.selectAll = false;
                }
                this.$emit('query', this.selectedList);
            },
            open_button_dialog(){
                this.buttonVisibility = true;
            },
            moreChange(val){
                this.moreSelect = val;
            },
            replaceType(){

            }
        },
        computed:{
            labelStyle(){
                let style = {
                    textAlign: this.labelAlign || 'right'
                };
                if (this.labelWidth) {
                    style.width = `${this.labelWidth}px`
                }
                return style;
            },
            filterButtonLists(){
                return this.buttonList.filter(row=>row.showSearch===true);
            },
            allCount(){
                let count = this.buttonList.reduce((sum,row)=>{
                    return sum+=row.count;
                },0);
                if(count>0){
                    return `(${count})`;
                }else {
                    return '';
                }
            }
        },
        watch: {
            moreSelect(val){
                if(val){
                    this.selectAll = false;
                } else {
                   this.all();
                   this.buttonList.forEach((row,index)=>{
                       if(index<10){
                           row.showSearch = true;
                       }else {
                           row.showSearch = false;
                       }
                   });
                }
            },
            clearSelect(){
                if(this.moreSelect){
                    this.moreSelect = false;
                }
                this.selectAll = true;
                this.selectedList.length = 0;
            }
        },
        props: {
            //传入的button数组[{label:'',value:''}]形式
            buttonList:{
                type: Array,
                required: true
            },
            label: {
                required: true,
                type: String
            },
            labelWidth: {},
            labelAlign: {},
            clearSelect:{
                required:true,
                type:Boolean
            }
        },
        components: {
            buttonDialog:require('./button-dialog').default,
        }
    }
</script>
