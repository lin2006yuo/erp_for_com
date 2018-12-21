<template>
    <div class="c-add-logistics">
        <page-dialog title="选择邮寄方式" v-model="addLog"  left="10%" width="80%" size="full"  :close-on-click-modal="false">
            <el-table
                    class="scroll-bar"
                    :data="shipList"
                    highlight-current-row
                    height="550"
                    v-loading="isLoading"
                    element-loading-text="玩命加载中..."
            >
                <el-table-column width="35" inline-template>
                    <el-checkbox class="radio" v-model="row.isCheck" @change="check_log(row)"></el-checkbox>
                </el-table-column>
                <el-table-column label="运输方式名称" prop="shipping_method_name" show-overflow-tooltip></el-table-column>
                <el-table-column label="物流商名称" prop="carrier_name" show-overflow-tooltip></el-table-column>
                <el-table-column label="物流商编码" prop="carrier_code" show-overflow-tooltip  width="100px"></el-table-column>
                <el-table-column label="折扣" prop="shipping_fee_discount" show-overflow-tooltip width="60px"></el-table-column>
                <el-table-column label="币种" prop="currency_code" show-overflow-tooltip width="50px"></el-table-column>
                <el-table-column label="杂费前费用" prop="before_amount" show-overflow-tooltip  width="100px"></el-table-column>
                <el-table-column label="挂号费" prop="registered_fee" show-overflow-tooltip width="55px"></el-table-column>
                <el-table-column label="燃油费" prop="oli_additional_fee" show-overflow-tooltip width="55px"></el-table-column>
                <el-table-column label="最早到达天数" prop="earliest_days" show-overflow-tooltip width="100px"></el-table-column>
                <el-table-column label="最迟到达天数" prop="latest_days" show-overflow-tooltip width="100px"></el-table-column>
                <el-table-column label="折扣前总费用" prop="amount" show-overflow-tooltip width="100px"></el-table-column>
                <el-table-column label="折扣后费用" prop="after_discount_amount" show-overflow-tooltip width="100px"></el-table-column>
                <el-table-column label="转换成人民币费用" prop="cny_amount" show-overflow-tooltip width="110px"></el-table-column>
            </el-table>
            <div slot="footer">
                <el-button :disabled="isDisabled" size="mini" type="primary" @click.native="add">确定</el-button>
                <el-button size="mini"  @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-add-logistics{
        .category_title{
            box-sizing: border-box;
            display: block;
            width:100%;
            height:30px;
            line-height: 28px;
            padding-left:10px;
            background:#008BCE;
            border:1px solid #008BCE;
            color:#fff;
            -moz-user-select: none;
            user-select: none;
            &:hover{
                background:rgb(51, 162, 216);
                cursor: pointer;
            }
        }
    }
</style>
<script>
import {api_get_carrier,api_get_ship} from '../../../api/handwork'
    export default{
        data(){
            return {
                curSelect:[],
                isLoading:false,
                addLog:this.value,
                carrierList:[],
//                shipList:[],
                clickData:[],
                carrier_id:0,
                page:1,
                pageSize:20,
                total:0,
                addData:{},
                isDisabled:false
            }
        },
        mounted(){
            this.get_carrier();
            this.fix_list();
            for(let i=0;i<this.carrierList.length;i++){
                this.clickData.push(false)
            }
        },
        watch:{
            addLog(val){
                this.$emit("input",val);
            },
            value(val){
                this.addLog = val;
                if(val) {
                    this.page = 1;
                    this.pageSize = 20;
                    this.carrier_id = 0;
//                    this.get_ship();
                }
            },
        },
        methods:{
            check_log(val){
                if(val.isCheck){
                    this.shipList.forEach((data)=>{
                        data.shipping_id !== val.shipping_id&&(this.$set(data,'isCheck',false));
                    })
                }
                console.log("this.addData",this.addData);
                this.addData = val;
            },
            fix_list(){
                    this.carrierList.forEach((data,i)=>{
                    this.$set(this.carrierList[i], 'selected',false);
                });
            },
            addClass(data,index){
                this.clickData=this.clickData.map(()=>{
                    return  false
                })
                this.clickData[index]=true
                this.carrier_id = data.id;
            },
            get_all(){
                this.carrier_id = 0;
            },
            add(){
                this.addLog = false;
                this.$emit("add",this.addData);
            },
            cancel(){
                this.addLog = false;
            },
            get_carrier(){
                this.$http(api_get_carrier).then(res=>{
                    this.carrierList = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            value:{},
            id:{},
            shipList:{
                required:true,
                type:Array
            }

        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiTable:require('../../../components/ui-table.vue').default,
        }
    }
</script>
