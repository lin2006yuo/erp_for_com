<template>
    <page-dialog class="split-package" title="拆分包裹" v-model="dialogVisible" size="full" top="30%" :close-on-click-modal="false">
        <p class="tag">本订单只提供单个订单拆分成包裹的操作</p>
        <el-row>
            <el-col :span="12">
                <left-page :order-data="orderData"></left-page>
            </el-col>
            <el-col :span="12">
                <right-page>
                    <span slot="title">
                        <span>自动生成后需尽快保存本页，否则可能导致无法及时占用库存</span>
                        <el-button type="primary" size="mini" @click="rebuild">重新生成</el-button>
                    </span>
                    <big-component label="即将生成的子包裹：">
                        <small-component v-for="(small,index) in smalls" :key="index" :order-data="orderData"
                                         :small="small" :index="index"
                                         :package-usabled-send="packageUsabledSend"
                                         :warehouse-list="warehouseList" @child_close="child_close"
                                         @disabled-btn="disabled_btn"
                        >
                        </small-component>
                    </big-component>
                    <el-button slot="footer" type="primary" size="mini" @click.native="addSmall">添加子包裹</el-button>
                </right-page>
            </el-col>
        </el-row>
        <div slot="footer">
            <!-- :disabled="isBtn"-->
            <el-button type="primary" size="mini" @click="save_btn">确定</el-button>
            <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .split-package{
        p.tag{
            border:1px solid #A2B8CE;
            height:36px;
            line-height:36px;
            padding:0 10px;
            background:#FCFBDD;
        }
    }
</style>
<script>
    import {api_get_splitInfo,api_keep_splitInfo} from "../../../../api/order-local"
    export default {
        data(){
            return {
                dialogVisible: this.value,
                packageNum:"",
                isBtn:false
            }
        },
        methods: {
            addSmall(){
                let detail = this.orderData.detail.map(row => {
                    let rrow = clone(row);
                    rrow.sends = 0;
                    return rrow;
                });
                this.smalls.push({
                    country_code:this.orderData.country_code,
                    order_number:this.orderData.order_number,
                    warehouse_id: this.orderData.warehouse_id,
                    shipping_id: '',
                    shipping_name: this.orderData.shipping_name ||this.orderData.shipping_id,
                    number:this.orderData.number,
                    detail
                });
                this.smalls.forEach( row=>{
                    this.$set(row,'isDisabled',true)
                })
            },
            child_close(i) { // 关闭子包裹
                this.smalls.splice(i,1)
            },
            rebuild(){
//                this.init();
            },
            changeSend(row, val){
                val = Number(val);
                const usable = this.packageUsabledSend[row.sku];
                if((val + usable) >= (row.quantity - row.sends) && this.stockQuantity(row) >= val){
                    row.sends = val;
                }
            },
            disabled_btn(val){
                this.smalls.forEach((row,i)=>{
                    if(i === val.index){
                        this.$set(row,'isDisabled',val.btn)
                    }
                })
                if(this.smalls.length===1){
                    this.isBtn = true
                }
            },
            save_btn(){
                if(this.isNotSave){
                    this.$message({
                        type:'warning',
                        message:'存在空包裹，子包裹商品发货数不能全部为0！'
                    });
                    return
                }
                let packageList = this.smalls.map( (small,i) =>{
                    let add = {};
                    this.$set(add,'warehouse_id',small.warehouse_id);
                    this.$set(add,'number',`${this.orderData.number}_${i+1}`);
                    this.$set(add,'shipping_id',small.shipping_id);
                    this.$set(add,'shipping_name',small.shipping_name);
                    this.$set(add,'detail',small.detail.map( row=>{
                        let det = {}
                        this.$set(det,'sku_id',row.sku_id);
                        this.$set(det,'quantity',row.sends);
                        this.$set(det,'weight',row.weight);
                        this.$set(det,'goods_id',row.goods_id);
                        return det;
                    }))
                    return add;
                });
                let find = packageList.find(row=>row.shipping_id==='');
                if(!!find){
                    this.$message({type:'warning',message:'存在未选择邮寄方式的包裹，请选择！'});
                    return
                }
                let option = {
                    packageList:packageList,
                    package_id:this.packageId
                };
                this.$http(api_keep_splitInfo,this.id ,option).then(res => {
                    this.$message({
                        type:'success',
                        message:res.message || res
                    });
                    setTimeout(()=>{
                        this.dialogVisible = false;
                    },2000);
                    this.$emit("refresh");
                }).catch(code => {
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            }
        },
        computed: {
            isNotSave(){
                let has_zero = false;
                this.smalls.forEach(row=>{
                    let sends_zero_arr = row.detail.filter(item=>{
                        return Number(item.sends)===0
                    });
                    if(sends_zero_arr&&row.detail.length === sends_zero_arr.length){
                        has_zero = true;
                    }
                });
                return has_zero
            },
            packageUsabledSend(){
                let packages = {};
                this.smalls.forEach(small => {
                    small.detail.forEach(detail=>{
                        packages[detail.sku_id] = packages[detail.sku_id] || 0;
                        packages[detail.sku_id] += detail.sends;
                    })
                });
                return packages;
            },
        },
        watch: {
            value(val){
                this.dialogVisible = val;
            },
            dialogVisible(val){
                this.$emit('input', val);
            },
            smalls(val){
                if(val.length>1){
                    for( let i=1;i<val.length;i++){
                        this.isBtn = (val[i-1].isDisabled && val[i].isDisabled)
                    }
//                    this.isBtn = this.isBtn
                }
            }
        },
        props: {
            value: {},
            id:{},
            form:{},
            warehouseList:{},
            packageId:{},
            orderData: {},
            smalls:{}
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            leftPage: require("./left-page.vue").default,
            rightPage: require("./right-page.vue").default,
            bigComponent: require("./big-component.vue").default,
            smallComponent: require("./small-component.vue").default
        }
    }
</script>
