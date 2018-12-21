<template>
    <div class="p-wish-size">
        <page-dialog title="尺寸设置"  v-model="show"  size="large" :close-on-click-modal="false"  @change="change_dialog" >
                <div v-for="(item,index) in sizeData" class="inline ml-lg">
                    <el-button :type="item.show?'primary':'text'"
                               :key="index"
                               @click="size_click(index)">
                        {{item.zh_name}}</el-button>
                </div>
                <div v-if="singeData.can_define===0" class="ml-35 mt-sm mb-sm">
                    <el-row>
                        <el-col :span="6" v-for="item in singeData.size_val" :key="item" class="mb-sm">
                            <el-radio class="myradio" v-model="singeData.selected" :label="item"></el-radio>
                        </el-col>
                    </el-row>
                </div>
                <div  v-if="singeData.can_define===1" class="ml-35 mt-sm mb-sm">
                    <el-row>
                        <el-col :span="6" v-for="item in  singeData.size_val" :key="item" class="mb-sm">
                            <el-radio class="radio" v-model="singeData.selected" :label="item"></el-radio>
                        </el-col>
                    </el-row>
                    <div class="mb-xs"> 示例：{{singeData.example}}</div>
                    <div class="positions" v-if="singeData.name!=='Area Size'">
                        <el-input v-model="singeData.inputValue" class='inline' ></el-input>
                        <el-button  type="primary" size="mini"  class='inline' @click="add_tags" >添加</el-button>
                    </div>
                    <div v-else>
                        <el-input class="inline" v-model="singeData.input1" style="width:100px"></el-input>
                        <el-select class="inline" v-model="singeData.select1"  style="width:100px">
                            <el-option
                                    :key="item"
                                    v-for="item in singeData.unit.split(',')"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <span class="inline">*</span>
                        <el-input  class="inline" v-model="singeData.input2"  style="width:100px" ></el-input>
                        <el-select  class="inline" v-model="singeData.select2"  style="width:100px" >
                            <el-option
                                    :key="item"
                                    v-for="item in singeData.unit.split(',') "
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <el-button class="inline" type="primary" size="mini" @click="add_tags" >添加</el-button>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="keep_add" type="primary"  >确定</el-button>
                <el-button size="mini" @click.native="show=false" >关   闭</el-button>
                </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
.p-wish-size{
    .dialog__body{
        overflow-x: hidden;
        .el-col .el-col-6{
            .el-checkbox{
                width: 100%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
    }
    .ml-35{
        margin-left:35px;
    }
    .positions{
        position: relative;
        .outline{
            >input{
                outline-color: red!important;
            }

        }
        >span{
            display: block;
            width: 200px;
            color: red;
        }
    }
   .myradio{
       width: 95%;
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;
   }

}
</style>
<script>
    import {api_wish_size, api_joom_size} from "../../../../api/kandeng"
    export default{
        data(){
            return {
                show:false,
                sizeData:[],
                singeData:{},
                flag:false,
            }
        },
        created(){
        },
        mounted(){
            this.get_sizes();
        },
        computed: {},
        methods: {
            get_sizes(){
                if(this.isJoom){
                    this.$http(api_joom_size).then(res=>{
                        this.sizeData=res.map(row=>{
                            row.show=false;
                            row.selected="";
                            row.can_define = 0;
                            return row;
                        });
                        this.sizeData.push({
                            show:false,
                            selected:'',
                            can_define:1,
                            name: "Custom size",
                            size_val: null,
                            zh_name: "自定义尺码",
                            unit:[],
                            inputValue:''
                        })
                    });
                }else {
                    let data={};
                    if(!this.add){
                        data.status="edit"
                    }else {
                        data.status="";
                    }
                    this.$http(api_wish_size,data).then(res=>{
                        this.sizeData=res.data.map(row=>{
                            row.show=false;
                            row.selected="";
                            if(row.can_define===1){
                                if(row.name==="Area Size"){
                                    let arr=row.unit.split(",")
                                    row.input1="";
                                    row.select1=arr[0];
                                    row.input2="";
                                    row.select2=arr[0];
                                }else {
                                    row.inputValue="";
                                }
                            }
                            return row
                        });
                    }).catch(code=>{
                        console.log(code)
                    })
                }

            },
            size_click(index){
                this.sizeData.forEach(row=>{
                    row.show=false;

                });
                this.sizeData[index].show=true;
                this.singeData=this.sizeData[index];
                console.log("this.singeData",this.singeData);
            },
            keep_add(){
                if( this.singeData.selected===""){
                    this.$message({
                      type:"error",
                      message:"请选择尺寸"
                    });
                    return;
                }
                this.show=false;
                this.$emit("selected",this.singeData.selected)
            },

            add_tags(){
                switch (this.singeData.name){
                    case 'Area Size':
                        let num1=Number(this.singeData.input1);
                        let num2=Number(this.singeData.input2);
                         if(typeof num1==="number"&&!isNaN(num1)&&num1!==0&&typeof num2==="number"&&!isNaN(num2)&&num2!==0) {
                             let str=num1+this.singeData.select1+"*"+num2+this.singeData.select2;
                             if(!this.singeData.size_val){
                                 this.singeData.size_val=[];
                                 this.singeData.size_val.push(str)
                             }
                             if( this.singeData.size_val.indexOf(str)===-1){
                                 this.singeData.size_val.push(str)
                             }
                         }

                        break;
                    case 'Numbers':
                        let nums=Number(this.singeData.inputValue);
                        if(typeof nums==="number"&&!isNaN(nums)&&nums!==0){
                            if( this.singeData.size_val.indexOf(nums)===-1){
                                this.singeData.size_val.push(nums)
                            }
                        }
                        this.singeData.inputValue="";
                        break;
                    case 'Shoes':
                        let num=Number(this.singeData.inputValue);
                        if(typeof num ==="number"&&!isNaN(num)&&num!==0){
                            if( this.singeData.size_val.indexOf(num)===-1){
                                this.singeData.size_val.push(num)
                            }
                        }
                        this.singeData.inputValue="";
                        break;
                    default :
                        let flag=false;
                        let arr=this.singeData.unit.split(",");
                        arr.forEach(row=>{
                            let reg=new RegExp(row.trim()+"$" ,"gi");
                            let flag2=reg.test(this.singeData.inputValue);
                            let values=this.singeData.inputValue.replace(reg,"");
                            let flag3=!isNaN(values);
                            if(flag2&&flag3){
                                flag=true;
                            }
                        });
                        if(flag){
                            if(!this.singeData.size_val){
                                this.$set(this.singeData,"size_val",[]);
                                this.singeData.size_val.push(this.singeData.inputValue);
                                this.singeData.inputValue="";
                            } else{
                                if(this.singeData.size_val.indexOf(this.singeData.inputValue)>-1) return this.$message({type:"warning",message:"该参数已定义，请更换参数"})
                                this.singeData.size_val.push(this.singeData.inputValue);
                                this.singeData.inputValue="";
                            }
                        }else {
                            this.$message({
                                type:"warning",
                                message:"您输入有误，请重新输入"
                            });
                            this.singeData.inputValue="";
                        }
                        break;
                }

            },
            change_dialog(val){
                if(!val){
                    this.get_sizes();
                    this.singeData={};
                }
            },
        },
        filters: {},
        watch: {
            show(val){
                this.$emit("input", val)
            },
            value(val){
                this.show=val;
            }
        },
        props: {
            value:{},
            add:{
                required:true,
                type:Boolean
            } ,
            isJoom:{
                default(){
                    return false
                }
            }
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            uiTips:require("../../../../components/ui-tips.vue")
        }
    }
</script>
