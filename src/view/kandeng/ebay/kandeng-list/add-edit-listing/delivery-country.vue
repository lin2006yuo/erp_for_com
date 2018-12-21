<template>
    <div class="c-delivery-country">
        <el-checkbox class="inline ml-sm width-percent-10"
                     v-model="checkAll">Worldwide</el-checkbox>
        <el-row>
            <el-checkbox-group v-model="checkList" @change="change_continent">
                <el-col :span="8" v-for="row in continentList" :key="row.value">
                    <el-checkbox  :label="row.value">{{row.label}}</el-checkbox>
                    <span class="bold-font" v-if="cur_country(row.value).length>0">(<span class="red">{{get_child_number(row)}}</span>/<span>{{cur_country(row.value).length}}</span>)</span>
                    <el-popover placement="right"
                                trigger="click"
                                v-if="cur_country(row.value).length>0"
                                :width="width"
                                :key="row.value">
                        <el-checkbox-group class="ml-sm"
                                           @change="change_country(row.value,$event)"
                                           v-model="shiptolocation">
                            <el-row>
                                <el-col :span="8" v-for="(item,index) in cur_country(row.value)" :key="index">
                                    <el-checkbox class="normal-font local-hidden"
                                                 :disabled="item.is_all_location"
                                                 :label="item.Location">{{item.Description}}</el-checkbox>
                                </el-col>
                            </el-row>
                        </el-checkbox-group>
                        <span slot="reference" >
                            <span class="operate ml-mini get-more"></span>
                        </span>
                    </el-popover>
                </el-col>
            </el-checkbox-group>
        </el-row>
        <el-row class="mt-sm box-localtion" v-if="showBriefCode&&shiptolocation&&shiptolocation.length>0">
            <el-col :span="24">
                <span>已选择国家简码：</span>
                {{shiptolocation | filterLocation}}
            </el-col>
        </el-row>
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
                checkList:["Alaska/Hawaii","US Protectorates","APO/FPO","Africa","Asia","Europe","Central America and Caribbean","North America","Oceania",'Southeast Asia','South America','Middle East','PO Box'],
                shiptolocation:this.value,
                continentList:[
                    {label:"Alaska/Hawaii",value:"Alaska/Hawaii"},
                    {label:"US Protectorates",value:"US Protectorates"},
                    {label:"APO/FPO",value:"APO/FPO"},
                    {label:"Africa",value:"Africa"},
                    {label:"Asia",value:"Asia"},
                    {label:"Europe",value:"Europe"},
                    {label:"Central America and Caribbean",value:"Central America and Caribbean"},
                    {label:"North America",value:"North America"},
                    {label:"Oceania",value:"Oceania"},
                    {label:"Southeast Asia",value:"Southeast Asia"},
                    {label:"South America",value:"South America"},
                    {label:"Middle East",value:"Middle East"},
                    {label:"PO Box",value:"PO Box"},
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
                    this.checkList = val? clone(this.continentList).map(row=>row.value):[];
                    this.change_continent(this.checkList);
                }
            },
        },
        watch:{
            locationList(val){
                console.log(val,'val');
            },
            checkList:{
                handler(newValue,oldValue){
                    this.oldCheckList = oldValue;
                },
                deep:true
            },
            shiptolocation(val){
                this.$emit("input",val);
            },
            value(val){
                this.shiptolocation = val;
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
                let theSame = country.filter(row=>this.shiptolocation.includes(row.Location));
                return theSame.length;
            },
            edit_set_continent(){//主要在编辑时使用
                this.checkList = [];
                this.continentList.forEach(row=>{
                    let curList = this.cur_country(row.value);
                    if(curList.length>0){
                        let findList = curList.filter(res=>!this.shiptolocation.includes(res.Location));
                        if(findList.length<=0&&!this.checkList.includes(row.value))this.checkList.push(row.value);
                    }else{
                        let find = this.shiptolocation.includes(row.value);
                        if(find&&!this.checkList.includes(row.value))this.checkList.push(row.value);
                    }
                });
            },
            change_continent(val){
//                let continentList = clone(this.continentList).map(row=>row.value);
                let difference = this.oldCheckList.filter(v =>!val.includes(v));
                val.forEach(row=>{
                    if(this.cur_country(row).length>0){
                        this.push_country(row);
                    }else{
                        if(!this.shiptolocation.includes(row)) this.shiptolocation.push(row);
                    }
                });
                difference.forEach(row=>{
                    if(this.cur_country(row).length>0){
                        this.splice_country(row);
                    }else{
                        let index = this.shiptolocation.findIndex(res=>res===row);
                        if(index>-1)this.shiptolocation.splice(index,1);
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
                        if(!this.shiptolocation.includes(row.Location)){
                            this.shiptolocation.push(row.Location)
                        }
                    }else{
                        if(row.Region===num){
                            if(!this.shiptolocation.includes(row.Location)){
                                this.shiptolocation.push(row.Location)
                            }
                        }
                    }
                });
            },
            /*计算属性  splice国家*/
            splice_country(num){
                this.locationList.forEach(row=>{
                    if(num==='Worldwide'){
                        this.shiptolocation = [];
                    }else{
                        if(row.Region===num){
                            let index = this.shiptolocation.findIndex(res=>{
                                return res===row.Location
                            });
                            if(index!==-1){
                                this.shiptolocation.splice(index,1);
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
            value:{},
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
        components: {}
    }
</script>