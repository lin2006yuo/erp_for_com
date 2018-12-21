<template>
    <div class="p-print">
        <page-dialog  v-model="arrivalVisable" width="780px" title="到货" :close-on-click-modal="false" @change="close">
            <el-row>
                <label>本次运费：</label>
                <el-input type="number" v-model="freight" class="inline" @blur="freight_blur"></el-input>
                <label>CNY (本次运费将累加到采购单的总运费中)</label>
                <label class="ml-sm">运单号：</label>
                <el-input v-model="tracking" class="inline"></el-input>
                <el-button type="primary" size="mini" class="inline" @click="empty">一键清零</el-button>
            </el-row>
            <el-row>
                <table class="template arrival-tab">
                    <tr class="line" style="font-weight:bold">
                        <th width="50px">图片</th>
                        <th>SKU</th>
                        <th width="160px">产品名称</th>
                        <th >采购数量</th>
                        <th >已到货数量</th>
                        <th >待到货数量</th>
                        <th >
                            <div>本次通知到货数量</div>
                            <div> <el-checkbox v-model="selected">剩余全部通知到货数量</el-checkbox></div>
                        </th>
                    </tr>
                    <tbody>
                        <tr v-if="arrivalData.detail==0">
                            <td :colspan="7">暂无数据！</td>
                        </tr>
                        <tr  v-for="(data, index) in arrivalData.detail">
                            <td>
                                <el-popover
                                        placement="right"
                                        width="200"
                                        trigger="hover">
                                    <img v-lazy="sku_image(data.img_path)" width="200" height="200">
                                    <span slot="reference">
                                         <img :src="data.img_path" width="60" height="60">
                                    </span>
                                </el-popover>
                            </td>
                            <td>
                                {{data.sku}}
                            </td>
                            <td>
                                {{data.name}}
                            </td>
                            <td>{{data.qty}}</td>
                            <td>{{data.in_qty}}</td>
                            <td>{{data.wait_qty}}</td>
                            <td class="t-left">
                                <input style="width:130px" class="el-input__inner"  type="number" min="0" v-model="data.purchase_qty" onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'')" @blur="blur(data)">
                                <div class="td-margin" >
                                     <el-checkbox v-model="data.checked" style="vertical-align: middle;"></el-checkbox>
                                     <label style="color:red" v-if="data.status===10">是否审核通过</label>
                                    <label style="color:red" v-else>部分到货，等待剩余</label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </el-row>
            <el-row>
                <div class="remark">备注：</div>
                <el-input
                        type="textarea"
                        :rows="5"
                        placeholder="请输入内容"
                        v-model="textarea">
                </el-input>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="arrival">确  认</el-button>
                <el-button  size="mini"   @click="cancel">关  闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-print{
        .remark{
            margin: 10px 0;
            font-weight: bold;
        }
        .arrival-tab{
            margin-top: 5px;
            tbody{
                /*height: 300px;*/
                overflow-y: auto;
                .td-margin{
                    margin: 5px 0;
                }
            }
        }
    }
</style>
<script>
    import pageDialog from "../../../components/page-dialog.vue"
    import {api_purchase_arrival_sub} from '../../../api/purchase'
    export default{
        data(){
            return{
                arrivalVisable:false,

                selected:false,
                freight:0,
                tracking:'',
                textarea:"",
            }
        },
        created(){
        },
        mounted(){
        },
        computed:{
        },
        methods:{
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
//            确认到货
            arrival(){
                console.log(this.arrivalData);
                let detail = this.arrivalData.detail.map(data=>{
                              if (data.status === 10) {
                                data.remainder = data.checked ? 'pass' : 'nopass';
                              } else {
                                data.remainder = data.checked ? 'yes' : 'approval';
                              }
                    return {sku_id:data.sku_id,qty:data.purchase_qty,remainder:data.remainder};
                });
                let params = {
                    id:this.arrivalData.order_id,
                    track_number:this.tracking,
                    freight:this.freight,
                    remark:this.textarea,
                    detail:detail
                };
                console.log(JSON.stringify(params));
                this.$http(api_purchase_arrival_sub,params).then(res=>{
                    this.$message({
                        message: res.message||res,
                        type: 'success'
                    });
                    this.arrivalVisable = false;

                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            cancel(){
                this.arrivalVisable=false;
            },
//            本次通知到货数量失去焦点事件
            blur(data){
                if (Number(data.purchase_qty) + Number(data.in_qty) >= Number(data.qty)) {
                    data.purchase_qty = Number(data.wait_qty);
                } else {

                }
            },
//            一键清零
            empty(){
                this.arrivalData.detail.forEach(data=>{
                    data.purchase_qty = 0;
                });

                this.selected = false;
            },
//            运费失去焦点事件
            freight_blur(){
                if (Number(this.freight) <0) {
                    this.freight = 0;
                }
                this.freight = Number(this.freight).toFixed(3);
            },
//            关闭弹框
            close(val){
                if (!val) {
                    this.selected = false;
                    this.freight = 0;
                    this.tracking = '';
                    this.textarea = "";
                }

            }
        },
        filters:{

        },
        watch:{
            value(val){
                this.arrivalVisable=val
            },
            arrivalVisable(val){
                this.$emit("input",val)
            },
            selected (val) {
                if (val) {
                    this.arrivalData.detail.forEach(data=>{
                        data.purchase_qty = data.wait_qty;
                    });

                }
            }
        },
        props:{
            value:{},
            arrivalData:{}
        },
        components:{
            pageDialog,
            uiTips:require('../../../components/ui-tips.vue').default,
        }
    }
</script>
