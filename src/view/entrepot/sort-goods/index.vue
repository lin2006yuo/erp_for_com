<template>
    <page>
        <el-card>
            <input ref="input" class="qr-input" v-model="input">
            <button class="qr-submit" @click="add_goods">确认</button>
        </el-card>
        <label-panel label="SKU/货品身份码（仅在多品多件包裹自动分拣功能开启时可用）">
            <table class="template sort-box">
                <thead>
                <tr>
                    <td>
                        启用左侧分拣货架
                    </td>
                    <td>
                        启用中侧分拣货架
                    </td>
                    <td>
                        启用右侧分拣货架
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <boxs :boxs="boxs" :row="frow" :column="fcolumn"></boxs>
                    </td>
                    <td>
                        <boxs :boxs="boxs" :row="srow" :column="scolumn" :used="fmax"></boxs>
                    </td>
                    <td>
                        <boxs :boxs="boxs" :row="trow" :column="tcolumn" :used="smax"></boxs>
                    </td>
                </tr>
                </tbody>
            </table>
            <span slot="footer">
                <el-button type="primary" @click.native="save">确定</el-button>
                <el-button type="primary" @click.native="submit">提交</el-button>
                <el-button type="warning" @click.native="reset">重置</el-button>
            </span>
        </label-panel>
        <dialog-box>
            {{inputBox}}
        </dialog-box>
    </page>
</template>
<style lang="stylus">
    .sort-box{
        tbody{
            td{
                margin-top:10px;
                vertical-align: top;
            }
        }
        .box td{
            cursor: pointer;
        }
        .box td:active{
            background-color: rgba(149,139,73,0.98);
        }
    }
</style>
<script>

    import {BOX_STATUS_FULL,BOX_STATUS_EMPTY,BOX_STATUS_FILL} from './const';
    export default{
    	  page:{},
        data(){
            return{
                frow:10,
                fcolumn:5,
                srow:10,
                scolumn:2,
                trow:5,
                tcolumn:5,
                boxs:[],
                input:'',
                inputBox:'',
                emptyBoxNum:0,
                orders:[
                    {
                        id:1,
                        goods:[{sku:'11',num:10},{sku:'22',num:1}]
                    },
                    {
                        id:2,
                        goods:[{sku:'22',num:10}]
                    }]
            }
        },
        mounted(){
            this.$refs.input.focus();
        },
        methods:{
            reset(){
                this.$confirm('重置将清空篮子里的物品，无法复原！！！', '确定重置吗', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.boxs = [];
                    this.input = '';
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            showBox(box){
                this.inputBox = `${box+1}`;
            },
            showDetail(box){
                console.log(this.boxs[box-1]);
            },
            save(){

            },
            submit(){

            },
            add_goods(){
                this.add_box(this.input);
            },
            add_box(input, box){
                box = box || this.switch_box(input);

            },
            switch_box(input){
                let isFind = false;
                for(let i = 0; i < this.emptyBoxNum; i++){
                    let box = this.boxs[i];
                    let find = box.goods.findRet(goods=>{
                        if(goods.sku === input && goods.has < goods.max){
                            return goods;
                        }
                    });
                    if(find){
                        find.has = find.has+1;
                        isFind = true;
                        this.showBox(box.box_id);
                        this.refresh_box(box);
                        break;
                    }
                }
                if(!isFind){
                    this.orders.For(order=>{
                        if(order.box === undefined){
                            let find = order.goods.find(goods=>{
                                return goods.sku === input
                            });
                            if(find){
                                order.box = this.emptyBoxNum++;
                                this.$set(order, 'box', order.box);
                                this.boxs.push({
                                    no:order.box+1,
                                    box_id:order.box,
                                    order_id:order.id,
                                    goods:order.goods.map(goods=>{
                                        if(goods.sku === input){
                                            return {sku:input,has:1,max:goods.num}
                                        }else{
                                            return {sku:goods.sku,has:0,max:goods.num}
                                        }
                                    })
                                });
                                let box = this.boxs.last();
                                this.showBox(order.box);
                                this.refresh_box(box);
                                isFind = true;
                            }
                        }
                        return true;
                    });
                }
                if(!isFind){
                    this.inputBox = "ERROR";
                }
            },
            refresh_box(box){
                let fill = box.goods.one(goods=>{
                    return goods.has < goods.max;
                });
                let status = fill ? BOX_STATUS_FILL : BOX_STATUS_FULL;
                if(box.status === undefined){
                    this.$set(box, 'status', status);
                }else{
                    box.status = status;
                }
            },
        },
        computed:{
            fcolumns(){
                return [].seq(1,this.fcolumn);
            },
            frows(){
                return [].seq(1,this.frow);
            },
            fmax(){
                return this.fcolumn * this.frow;
            },

            scolumns(){
                return [].seq(1,this.scolumn);
            },
            srows(){
                return [].seq(1,this.srow);
            },
            smax(){
                return this.fmax + this.scolumn * this.srow;
            },
            tcolumns(){
                return [].seq(1,this.tcolumn);
            },
            trows(){
                return [].seq(1,this.trow);
            },
        },
        components:{
            labelPanel:require('../../../components/label-panel.vue').default,
            dialogBox:require('../../../components/dialog-box.vue').default,
            boxs:require('./boxs.vue').default
        }
    }
</script>
