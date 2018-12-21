<template>
    <div class="p-button-dialog">
        <page-dialog v-model="show" width="900px" :title="title.trim()" :min-height="400" @open="open" :close-on-click-modal="isClose">
            <div class="ml-xs mb-xs" style="text-align: center">
                <el-radio-group size="small" fill="#20a0ff" text-color="#ffffff" v-model="selectLabel">
                    <el-radio-button v-for="(item,index) in selectLinks"
                                     v-if="item.isShow"
                                     :key="index"
                                     @click.native="selectCheck(item)"
                                     :label="item.label"></el-radio-button>
                </el-radio-group>
                <el-checkbox v-model="dialogMoreSelect" v-if="buttonList.length > 0">启用多选</el-checkbox>
            </div>
            <div v-if="filterButtons.length>0">
                <el-button  v-for="(item, index) in filterButtons"
                           v-if="item.showDialog"
                           class="mr-mini mt-mini"
                           style="margin-left: 0"
                           :key="index"
                           size="mini"
                           :type="button_item(item)"
                           @click="button_select(item)">
                    {{item.label || item.name}}{{item.count | filterButton}}
                </el-button>
            </div>
            <div v-if="moreSelect" class="mt-sm mb-xs">
                已选择的账号：
                <div v-if="selectedList.length>0">
                    <el-button  v-for="(item, index) in selectedList"
                                class="mr-mini mt-mini"
                                style="margin-left: 0"
                                :key="index"
                                size="mini"
                                :type="button_item(item)"
                                @click="button_select(item)">
                        {{item.label || item.name}}{{item.count | filterButton}}
                    </el-button>
                </div>
                <div v-else class="mt-lg" style="text-align: center">
                    <span>暂未选择</span>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="moreSelect" size="mini" class="mr-sm" type="primary" @click.native="queryMore">确认</el-button>
                <el-button size="mini" class="mr-sm" @click.native="show=false">关闭</el-button>
            </div>
        </page-dialog>
        <div style="position:fixed;left:0;top:0;right:0;bottom:0;background:#000;opacity:.4;z-index:999" v-if="false"></div>
    </div>
</template>
<style lang="stylus">
    .p-button-dialog {
        .span-link{
            padding: 2px 5px;
            border: 1px solid;
            border-color: white;
            margin 2px;
            font-size 16px;
        }
        .span-link:hover{
            border 1px solid #4b659a;
        }
    }
</style>

<script>
    export default {
        data(){
            return {
                show:this.value,
                selectAll:false,
                // selectedList:[],
                selectLabel:'全部',
                selectLinks:[
                    {label:'全部',value:0,active:true,isShow:true},
                    {label:'A',value:1,active:false,isShow:false},
                    {label:'B',value:2,active:false,isShow:false},
                    {label:'D',value:4,active:false,isShow:false},
                    {label:'E',value:5,active:false,isShow:false},
                    {label:'C',value:3,active:false,isShow:false},
                    {label:'F',value:6,active:false,isShow:false},
                    {label:'G',value:7,active:false,isShow:false},
                    {label:'H',value:8,active:false,isShow:false},
                    {label:'I',value:9,active:false,isShow:false},
                    {label:'J',value:10,active:false,isShow:false},
                    {label:'K',value:11,active:false,isShow:false},
                    {label:'L',value:12,active:false,isShow:false},
                    {label:'M',value:13,active:false,isShow:false},
                    {label:'N',value:14,active:false,isShow:false},
                    {label:'O',value:15,active:false,isShow:false},
                    {label:'P',value:16,active:false,isShow:false},
                    {label:'Q',value:17,active:false,isShow:false},
                    {label:'R',value:18,active:false,isShow:false},
                    {label:'S',value:19,active:false,isShow:false},
                    {label:'T',value:20,active:false,isShow:false},
                    {label:'U',value:21,active:false,isShow:false},
                    {label:'V',value:22,active:false,isShow:false},
                    {label:'W',value:23,active:false,isShow:false},
                    {label:'X',value:24,active:false,isShow:false},
                    {label:'Y',value:25,active:false,isShow:false},
                    {label:'Z',value:26,active:false,isShow:false},
                    {label:'数字',value:27,active:false,isShow:false},
                ],
                dialogMoreSelect:false,
                isReplace:false,
                replaceType:-1
            }
        },
        beforeUpdate(){
            if(this.buttonList.length>10){
                this.get_select_links();
            }
        },
        methods:{
            open(){
                if(this.isResetFilter&&this.selectLabel!=='全部'){
                    this.selectLabel = '全部';
                    this.selectCheck({label:'全部',value:0,active:false,isShow:true});
                }
            },
            get_select_links(){
                this.selectLinks.forEach(item=>{
                    if(item.value!==0){
                        if(item.value === 27){
                            let find = this.buttonList.find(row=>{
                                let first_letter = row.name?row.name.slice(0,1):row.label.slice(0,1);
                                return !isNaN(Number(first_letter));
                            });
                            if(find){
                                this.$set(item,'isShow',true);
                            }else{
                                this.$set(item,'isShow',false);
                            }
                        }else{
                            let find = this.buttonList.find(row=>{
                                let first_letter = row.name?row.name.slice(0,1):row.label.slice(0,1);
                                return first_letter.toUpperCase() === item.label;
                            });
                            if(find){
                                this.$set(item,'isShow',true);
                            }else{
                                this.$set(item,'isShow',false);
                            }
                        }
                    }
                });
            },
            button_select(item){
                if(!this.dialogMoreSelect){
                    this.selectedList.length = 0;
                }
                let index = this.selectedList.findIndex(row=>{
                    return item.value === row.value;
                });
                if(index === -1){
                    this.selectAll = false;
                    this.selectedList.push(item);
                    if(!this.dialogMoreSelect){
                        let index = this.buttonList.findIndex(row=>row.value === item.value);
                        if(index>9){
                            let isShow = this.buttonList.find((row,index)=>{
                                return row.showSearch===true&&index>=9;
                            });
                            isShow.showSearch = false;
                            item.showSearch = true;
                        }
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
                this.show = false;
                this.$emit('query', this.selectedList);
            },
            queryMore(){
                this.buttonList.forEach(row=>{
                    let find = this.selectedList.find(item=>item.value===row.value);
                    find?this.$set(row,'showSearch',true):this.$set(row,'showSearch',false);
                });
                this.query();
            },
            selectCheck(item){
                if(item.active){
                    return
                }
                this.selectLinks.forEach(row=>{
                    if(row.active){
                        row.active = false;
                    }
                });
                item.active = true;
                this.buttonList.forEach(row=>{
                    let innerText = row.name?row.name:row.label;
                    if(item.value===0){
                        row.showDialog = true;
                    }else if(item.value === 27){
                        if(innerText){
                            if(isNaN(Number(innerText.slice(0,1)))){
                                this.$set(row,'showDialog',false);
                            }else{
                                this.$set(row,'showDialog',true);
                            }
                        }
                    }else{
                        if(innerText){
                            if(innerText.slice(0,1).toUpperCase() !== item.label){
                                this.$set(row,'showDialog',false);
                            }else{
                                this.$set(row,'showDialog',true);
                            }
                        }
                    }
                });
            }
        },
        computed:{
            filterButtons(){
                return this.buttonList.filter(row=>row.showDialog===true);
            },
            indexes(){
                let find = this.selectLinks.find(row=>row.active===true);
                return find.value?find.label:'';
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
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input',val);
            },
            moreSelect(val){
                this.dialogMoreSelect = val;
            },
            dialogMoreSelect(val){
                this.$emit('more-change',val);
            }
        },
        props:{
            title:{
                required:true,
                type:String
            },
            isClose:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            buttonList:{
                type: Array
            },
            value:{
                type: Boolean
            },
            moreSelect:{
                type: Boolean
            },
            selectedList:{
                type:Array
            },
            isResetFilter:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        components:{
            pageDialog:require("../../../components/page-dialog.vue").default,
        }
    }
</script>

