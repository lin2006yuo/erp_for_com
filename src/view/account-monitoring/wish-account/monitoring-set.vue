<template>
  <page-dialog class="p-mon-set" :title="status===1?`一键设置监控值`:`查看与编辑`" v-model="visible" size="large" :close-on-click-modal="false">
      <el-card>
        <div slot="header">诚信店铺表现</div>
        <table class="set-table" cellspacing="0" border="1" width="100%" style="border-color:#ddd">
          <thead>
            <tr style="height: 30px;">
              <th style="width: 600px"></th>
              <th style="width: 100px" v-if="status===2">Rate</th>
              <th>监控值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>仿品率（目标≤0.50%）</td>
              <td v-if="status===2" :style="isRed(rowData.monitor.counterfeit_rate_aim,rowData.counterfeit_rate)">
                {{!!rowData.counterfeit_rate?rowData.counterfeit_rate*100+'%':''}}
              </td>
              <td>目标><el-input class="inline" v-model="searchData.counterfeit_rate_aim"></el-input>%</td>
            </tr>

            <tr>
              <td>有效跟踪率（目标≥95.00%）</td>
              <td v-if="status===2" :style="isRed(rowData.valid_tracking_rate,rowData.monitor.valid_tracking_rate_aim)">
                {{!!rowData.valid_tracking_rate?rowData.valid_tracking_rate*100+'%':''}}
              </td>
              <td>目标<<el-input class="inline" v-model="searchData.valid_tracking_rate_aim"></el-input>%</td>
            </tr>

            <tr>
              <td>延迟发货率（目标≤10.00%）</td>
              <td v-if="status===2" :style="isRed(rowData.monitor.late_confirmed_fulfillment_rate_aim,rowData.late_confirmed_fulfillment_rate)">
                {{!!rowData.late_confirmed_fulfillment_rate?rowData.late_confirmed_fulfillment_rate*100+'%':''}}
              </td>
              <td>目标><el-input class="inline" v-model="searchData.late_confirmed_fulfillment_rate_aim"></el-input>%</td>
            </tr>

            <tr>
              <td>30天平均分（目标≥4.00）</td>
              <td v-if="status===2" :style="isRed(rowData.average_rating,rowData.monitor.average_rating_aim)">
                {{rowData.average_rating}}
              </td>
              <td>目标<<el-input class="inline" v-model="searchData.average_rating_aim"></el-input><span>&nbsp;&nbsp;&nbsp;</span></td>
            </tr>

            <tr>
              <td>在63天到93天内的退款率（目标≤10.00%）</td>
              <td v-if="status===2" :style="isRed(rowData.monitor.refund_rate_aim,rowData.refund_rate)">
                {{rowData.refund_rate?rowData.refund_rate*100+'%':''}}
              </td>
              <td>目标><el-input class="inline" v-model="searchData.refund_rate_aim"></el-input>%</td>
            </tr>
          </tbody>
        </table>
      </el-card>

      <el-card class="mt-lg">
        <div slot="header">店铺账户金额情况</div>
        <table class="set-table" cellspacing="0" border="1" width="100%" style="border-color:#ddd">
          <thead>
            <tr style="height: 30px;">
              <th style="width: 600px"></th>
              <th style="width: 100px" v-if="status===2">金额（USD）</th>
              <th>监控值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>在途金额（到款时间：2017-06-15）</td>
              <td v-if="status===2" :style="isRed(rowData.valid_money,rowData.monitor.valid_money_aim)">
                {{rowData.valid_money}}
              </td>
              <td>目标≥<el-input class="inline" v-model="searchData.valid_money_aim"></el-input></td>
            </tr>
            <tr>
              <td>待确认配送的金额</td>
              <td v-if="status===2" :style="isRed(rowData.unvalid_money,rowData.monitor.unvalid_money_aim)">
                {{rowData.unvalid_money}}
              </td>
              <td>目标≥<el-input class="inline" v-model="searchData.unvalid_money_aim"></el-input></td>
            </tr>
          </tbody>
        </table>
      </el-card>
      <p style="margin-left: 8px;">小提示：“监控值”留空，表示该项不列入监控范围。</p>
    <div class="t-right card">
      <el-button type="primary" size="mini" @click="init">确定</el-button>
      <el-button size="mini" @click="visible=false">取消</el-button>
    </div>
  </page-dialog>
</template>

<style lang="stylus">
.p-mon-set{
  .set-table{
    tr{
      text-align: center;
      .el-input{
        width: 50px;
      }
    }
  }
}
</style>
<script>
    import {api_wish_shop_monitor, api_get_monitor_data} from "../../../api/account-monitoring"
    export default{
        page: {},
        refresh(){
            this.searchData = {};
            this.init();
        },
        data(){
            return {
              visible:false,
              searchData:{
                account_id:0,//Wish账号id,如果是所有账户都设置，填0
                counterfeit_rate_aim:'',//仿品率目标值
                valid_tracking_rate_aim:'',//有效跟踪率目标值
                late_confirmed_fulfillment_rate_aim:'',//延迟发货率
                average_rating_aim:'',//30天平均评分
                refund_rate_aim:'',//63天到93天内的退款率
                valid_money_aim:'',//在途金额
                unvalid_money_aim:''//待确认配送的金额
              }
            }
        },
        created(){

        },
        filters: {},
        mounted(){

        },
        updated(){

        },
        destroy(){

        },
        methods: {
            init(){
              let data = window.clone(this.searchData);
              let parame = {
                account_id:data.account_id,
                counterfeit_rate_aim:!!data.counterfeit_rate_aim?data.counterfeit_rate_aim/100:'',
                valid_tracking_rate_aim:!!data.valid_tracking_rate_aim?data.valid_tracking_rate_aim/100:'',
                late_confirmed_fulfillment_rate_aim:!!data.late_confirmed_fulfillment_rate_aim?data.late_confirmed_fulfillment_rate_aim/100:'',
                average_rating_aim:data.average_rating_aim,
                refund_rate_aim:!!data.refund_rate_aim?data.refund_rate_aim/100:'',
                valid_money_aim:data.valid_money_aim,
                unvalid_money_aim:data.unvalid_money_aim
              };
              this.$http(api_wish_shop_monitor,parame).then(res=>{
                this.$message({
                  type: 'success',
                  message: res.message || res
                })
                this.visible = false;
                this.$emit('updata-suc')
              }).catch(code=>{
                  this.$message({
                      type:"error",
                      message:code.message || code
                  })
              })
            },
            get_monitor_data(){
               this.$http(api_get_monitor_data,{account_id:this.accountId}).then(res=>{
                   this.searchData.counterfeit_rate_aim = res.data.counterfeit_rate_aim*100;
                   this.searchData.valid_tracking_rate_aim=res.data.valid_tracking_rate_aim*100;
                   this.searchData.late_confirmed_fulfillment_rate_aim=res.data.late_confirmed_fulfillment_rate_aim*100;
                   this.searchData.average_rating_aim=res.data.average_rating_aim;
                   this.searchData.refund_rate_aim=res.data.refund_rate_aim*100;
                   this.searchData.valid_money_aim=res.data.valid_money_aim*100;
                   this.searchData.unvalid_money_aim=res.data.unvalid_money_aim*100;
               });
            },
            isRed(a, b){
              if (parseFloat(a) - parseFloat(b) < 0) {
                return {
                  color:'#FF3300',
                  fontWeight:'bold'
                }
              } else {
                return  {
                  color:"#1f2d3d",
                  fontWeight:'none'
                }
              }
            }
        },
        computed: {},
        watch: {
          visible(val){
            this.$emit('input', val);
          },
          value(val){
            this.visible = val;
            if(!!val){
              if(this.status===2){
                this.searchData.account_id = this.accountId;
                this.get_monitor_data();
              }else {
                this.searchData={
                    account_id:0,//Wish账号id,如果是所有账户都设置，填0
                    counterfeit_rate_aim:'',//仿品率目标值
                    valid_tracking_rate_aim:'',//有效跟踪率目标值
                    late_confirmed_fulfillment_rate_aim:'',//延迟发货率
                    average_rating_aim:'',//30天平均评分
                    refund_rate_aim:'',//63天到93天内的退款率
                    valid_money_aim:'',//在途金额
                    unvalid_money_aim:''//待确认配送的金额
                }
              }
            }
          },

        },
        props: {
          value:{},
          status:{
            type:Number
          },
          accountId:{
              type:Number
          },
          rowData:{
              type:Object
          }
        },
        components: {
          pageDialog: require("../../../components/page-dialog.vue").default
        }
    }
</script>

