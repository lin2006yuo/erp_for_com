<template>
    <div class="c-delivery-country">
        <page-dialog v-model="dialog"
                     :title="title"
                     size="large"
                     :close-on-click-modal="false">
            <el-row style="margin-left:120px;">
                <el-checkbox-group v-model="checkList" @change="change_continent">
                    <el-col :span="8" v-for="row in continentList" :key="row.value">
                        <el-checkbox  :label="row.value">{{row.label}}</el-checkbox>
                        <span class="bold-font" v-if="cur_country(row.value).length>0">(<span class="red">{{get_child_number(row)}}</span>/<span>{{cur_country(row.value).length}})</span></span>
                        <el-popover placement="right"
                                    trigger="click"
                                    v-if="cur_country(row.value).length>0"
                                    :width="width"
                                    :key="row.value">
                            <el-checkbox-group class="ml-sm"
                                               @change="change_country(row.value,$event)"
                                               v-model="form.exclude">
                                <el-row>
                                    <el-col :span="8" v-for="(item,index) in cur_country(row.value)" :key="index">
                                        <el-checkbox class="normal-font local-hidden"
                                                     :disabled="item.is_all_location"
                                                     :label="item.Location">{{item.Description}}</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                            <span slot="reference" >
                                <span class="operate ml-lg get-more"></span>
                            </span>
                        </el-popover>
                    </el-col>
                </el-checkbox-group>
            </el-row>
            <el-row class="mt-sm box-localtion" v-if="showBriefCode&&form.exclude&&form.exclude.length>0">
                <el-col :span="24">
                    <span>已选择国家简码：</span>
                    {{form.exclude | filterLocation}}
                </el-col>
            </el-row>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-delivery-country{
        width:100%;
        .box-localtion{
            box-sizing:border-box;
            padding:5px 8px;
            background-color:#f2f2f5;
            word-break: break-word;
        }
        .width-percent-20{
            width:20%;
        }
        .width-percent-10{
            width:10%;
        }
        .width-percent-70{
            width:70%;
        }
        .hidden { display: none; }
        ul{
            width:100%;
            border-left:1px solid #d1dbe5;
            overflow hidden;
            >li{
                padding-left:10px;
                box-sizing:border-box;
                float:left;
                height:26x;
                line-height:26px;
                background-color:#eef1f6;
                border:1px solid #d1dbe5;
                border-left:transparent;
                display:inline-block;
            }
            .cur-active{
                color: #20a0ff;
                background-color:#fff;
                margin-bottom:-3px;
                border-bottom:transparent
            }
            div.unfold{
                cursor:pointer;
            }
            &.tab-body{
                >li{
                    padding:0;
                    border-top:transparent;
                    width:99.96%;
                    background-color:#fff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

</style>
<script>
    export default {
        data() {
            return {
                oldCheckList:[],
                checkList:[],
                dialog:this.value,
                continentList:[
                    {label:"Alaska/Hawaii",value:"Alaska/Hawaii",isShow:false},
                    {label:"US Protectorates",value:"US Protectorates",isShow:false},
                    {label:"APO/FPO",value:"APO/FPO",isShow:false},
                    {label:"Africa",value:"Africa",isShow:false},
                    {label:"Asia",value:"Asia",isShow:false},
                    {label:"Europe",value:"Europe",isShow:false},
                    {label:"Central America and Caribbean",value:"Central America and Caribbean",isShow:false},
                    {label:"North America",value:"North America",isShow:false},
                    {label:"Oceania",value:"Oceania",isShow:false},
                    {label:"Southeast Asia",value:"Southeast Asia",isShow:false},
                    {label:"South America",value:"South America",isShow:false},
                    {label:"Middle East",value:"Middle East",isShow:false},
                    {label:"PO Box",value:"PO Box",isShow:false},
                ],
            }
        },
        computed:{
            //全选
            checkAll:{
                get(){
                    let c1 = this.checkList.length;
                    let c2 = this.continentList.length;
                    return c1 === c2;
                },
                set(val){
                    console.log(val,'val');
                    this.checkList = val? clone(this.continentList).map(row=>row.value):[];
                    this.change_continent(this.checkList);
                }
            },
        },
        watch:{
            checkList:{
                handler(newValue,oldValue){
                    this.oldCheckList = oldValue;
                },
                deep:true
            },
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
        },
        filters:{
            filterLocation(val){
                if(val&&(val instanceof Array)){
                    return val.join('，')
                }
            },
        },
        methods:{
            get_child_number(row){
                let country = this.cur_country(row.value);
                let theSame = country.filter(row=>this.form.exclude.includes(row.Location));
                return theSame.length;
            },
            submit(){
                this.dialog = false;
                this.$emit('submit',this.form.exclude);
            },
            edit_set_continent(){//主要在编辑时使用
                this.continentList.forEach(row=>{
                    let curList = this.cur_country(row.value);
                    if(curList.length>0){
                        let findList = curList.filter(res=>!this.form.exclude.includes(res.Location));
                        if(findList.length<=0&&!this.checkList.includes(row.value))this.checkList.push(row.value);
                    }else{
                        let find = this.form.exclude.includes(row.value);
                        if(find&&!this.checkList.includes(row.value))this.checkList.push(row.value);
                    }
                })
            },
            change_continent(val){
//                let continentList = clone(this.continentList).map(row=>row.value);
                let difference = this.oldCheckList.filter(v =>!val.includes(v));
                val.forEach(row=>{
                    if(this.cur_country(row).length>0){
                        this.push_country(row);
                    }else{
                        if(!this.form.exclude.includes(row)) this.form.exclude.push(row);
                    }
                });
                difference.forEach(row=>{
                    if(this.cur_country(row).length>0){
                        this.splice_country(row);
                    }else{
                        let index = this.form.exclude.findIndex(res=>res===row);
                        if(index>-1)this.form.exclude.splice(index,1);
                    }
                });
            },
            change_country(value,val){//value 父层选择项,val 数组
                let curList = this.cur_country(value);
                let find = curList.filter(res=>!val.includes(res.Location));
                if(find.length>0){
                    let index = this.checkList.findIndex(res=>res===value);
                    if(index>-1)this.checkList.splice(index,1);
                }else{
                    if(!this.checkList.includes(value)){
                        this.checkList.push(value);
                    }
                }
            },
            /*计算属性  push国家*/
            push_country(num){
                let cur = [];
                let curList = [];
                this.locationList.forEach(row=>{
                    if(num==='Worldwide'){
                        if(!this.form.exclude.includes(row.Location)){
                            this.form.exclude.push(row.Location)
                        }
                    }else{
                        if(row.Region===num){
                            if(!this.form.exclude.includes(row.Location)){
                                this.form.exclude.push(row.Location)
                            }
                        }
                    }
                });
            },
            /*计算属性  splice国家*/
            splice_country(num){
                this.locationList.forEach(row=>{
                    if(num==='Worldwide'){
                        this.form.exclude = [];
                    }else{
                        if(row.Region===num){
                            let index = this.form.exclude.findIndex(res=>{
                                return res===row.Location
                            });
                            if(index!==-1){
                                this.form.exclude.splice(index,1);
                            }
                        }
                    }
                });
            },
            /*获得每个洲包含的国家*/
            cur_country(num){
                let cur = [];
                if(this.locationList.length>0){
                    this.locationList.map(row=>{
                        if(row.Region===num) cur.push(row);
                    })
                }
                return cur;
            },
        },
        props:{
            showBriefCode:{//主要使用与不送达地区展示被选择的国家代码
                default(){
                    return false
                },
            },
            title:{
                default(){
                    return "添加不送达地区"
                }
            },
            value:{},
            form:{},
            width:{
                type:Number,
                default(){
                    return 650
                },
            },
            locationList:{
                required:true,
                type:Array
            }
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
        }
    }
</script>
