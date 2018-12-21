<template>
    <page>
        <label-panel label="打印控件设置">
            <div>
                <el-radio name="print" class="radio" v-model="print" label="1">打印控件A</el-radio>
                <el-radio name="print" class="radio" v-model="print" label="2">打印控件B</el-radio>
            </div>
        </label-panel>
        <label-panel label="包装时打印">
            <table class="template sort-goods-tr">
                <tr>
                    <td>
                        允许单品多件包裹与单品单件包裹进入同一张拣货单？
                    </td>
                    <td>
                        <el-radio class="radio" v-model="print" label="1">允许</el-radio>
                        <el-radio class="radio" v-model="print" label="2">不允许</el-radio>
                    </td>
                </tr>
                <tr>
                    <td>允许不同物流商的包裹进入同一张拣货单？</td>
                    <td>
                        <el-radio class="radio" v-model="print" label="1">允许</el-radio>
                        <el-radio class="radio" v-model="print" label="2">不允许</el-radio>
                    </td>
                </tr>
                <tr>
                    <td>默认每张拣货单最大货品数</td>
                    <td></td>
                </tr>
                <tr>
                    <td>拣货单打印时"品名"列显示？</td>
                    <td></td>
                </tr>
                <tr>
                    <td>单SKU拣货单打印时货品列表输出顺序</td>
                    <td></td>
                </tr>
                <tr>
                    <td>多品多件包裹自动分拣功能</td>
                    <td></td>
                </tr>
                <tr>
                    <td>多SKU拣货单打印时包裹列表输出顺序</td>
                    <td></td>
                </tr>
                <tr>
                    <td>是否要在包装作业时对包裹称重？</td>
                    <td></td>
                </tr>
                <tr>
                    <td>对包装作业中的已打印的包裹标记为已发货？</td>
                    <td></td>
                </tr>
            </table>
        </label-panel>
        <label-panel label="SKU/货品身份码（仅在多品多件包裹自动分拣功能开启时可用）">
            <table class="template sort-box">
                <thead>
                <tr>
                    <td>
                        <el-checkbox v-model="f">启用左侧分拣货架</el-checkbox>
                        <div>
                            <label-item label="行数：">
                                <el-select v-model="fcolumn" class="select-width">
                                    <el-option v-for="i in 10"
                                               :label="i"
                                               :value="i"
                                               :key="i"
                                    ></el-option>
                                </el-select>
                            </label-item>
                            <label-item label="列数：">
                                <el-select v-model="frow" class="select-width">
                                    <el-option v-for="i in 10"
                                               :label="i"
                                               :value="i"
                                               :key="i"
                                    ></el-option>
                                </el-select>
                            </label-item>
                        </div>
                    </td>
                    <td>
                        <el-checkbox v-model="s">启用中侧分拣货架</el-checkbox>
                        <div>
                            <label-item label="行数：">
                                <el-select v-model="scolumn" class="select-width">
                                    <el-option v-for="i in 10"
                                               :label="i"
                                               :value="i"
                                               :key="i"
                                    ></el-option>
                                </el-select>
                            </label-item>
                            <label-item label="列数：">
                                <el-select v-model="srow" class="select-width">
                                    <el-option v-for="i in 10"
                                               :label="i"
                                               :value="i"
                                               :key="i"
                                    ></el-option>
                                </el-select>
                            </label-item>
                        </div>
                    </td>
                    <td>
                        <el-checkbox v-model="t">启用右侧分拣货架</el-checkbox>
                        <div>
                            <label-item label="行数：">
                                <el-select v-model="tcolumn" class="select-width">
                                    <el-option v-for="i in 10"
                                               :label="i"
                                               :value="i"
                                               :key="i"
                                    ></el-option>
                                </el-select>
                            </label-item>
                            <label-item label="列数：">
                                <el-select v-model="trow" class="select-width">
                                    <el-option v-for="i in 10"
                                               :label="i"
                                               :value="i"
                                               :key="i"
                                    ></el-option>
                                </el-select>
                            </label-item>
                        </div>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <table class="template">
                            <tr v-for="(column,index) in fcolumns">
                                <td v-for="row in frows">
                                    {{row  + (column-1) * frow}}
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table class="template">
                            <tr v-for="(column,index) in scolumns">
                                <td v-for="row in srows">
                                    {{row  + (column-1) * srow + fmax}}
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table class="template">
                            <tr v-for="(column,index) in tcolumns">
                                <td v-for="row in trows">
                                    {{row  + (column-1) * trow + smax}}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <span slot="footer">
                <el-button type="primary" @click.native="save">确定</el-button>
            </span>
        </label-panel>
    </page>
</template>
<style lang="stylus">
    .sort-goods-tr{
        td:first-child{
            width:400px;
            text-align: right;
        }
        td:last-of-type{
            text-align: left;
        }
    }
    .select-width{
         width:80px;
     }
    .sort-box{
        tbody{
            td{
                margin-top:10px;
                vertical-align: top;
            }
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                print:1,
                f:true,
                fcolumn:1,
                frow:1,
                s:true,
                scolumn:1,
                srow:1,
                t:false,
                tcolumn:1,
                trow:1
            }
        },
        methods:{
            save(){

            }
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
            labelItem:require('../../../components/label-item.vue').default
        }
    }
</script>
