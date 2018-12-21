<template>
    <div class="c-invoice-template" id="invoice-template">
        <page-dialog v-model="dialog" size="full" :close-on-click-modal="false">
            <div
                style="
                font-size:14px;
                color:#000;
                margin:0 10px 10px;
                padding:20px 100px;
                border:2px solid #ddd;
                -webkit-box-shadow:0 0 25px rgb(204,227,199);
                -moz-box-shadow:0 0 25px rgb(204,227,199);
                box-shadow:0 0 25px rgb(204,227,199);">
                <!--标题-->
                <h1 style="font-size:60px;">Rechnung</h1>
                <!--区域1  start-->
                <div style="overflow:hidden;margin-bottom:5px">
                    <div style="float:right;
                        line-height:1.5;
                        font-weight:bold;">
                        <div style="font-size:16px;">用户自定义区域1-1</div>
                        <div style="font-size:16px;">用户自定义区域1-2</div>
                        <div style="font-size:16px;">用户自定义区域1-3</div>
                    </div>
                </div>
                <!--区域1  end-->

                <!--区域2  start-->
                <div
                    style="line-height:1.5;
                    font-weight:bold;
                    font-size:16px;
                    margin-bottom:10px;
                    ">用户自定义区域2</div>
                <!--区域2  end-->

                <!--invoice地址B1  start-->
                <div
                    style="border:1px solid #000;
                    padding:8px 5px;
                    line-height:1.5;
                    margin-bottom:10px;"
                >
                    <div>xxxx</div>
                    <div>xxxx</div>
                    <div>xxxx</div>
                    <div>xxxx</div>
                    <div>xxxx</div>
                </div>
                <!--invoice地址B1  end-->

                <!--invoice编号B2,b3,b4,A2  start-->
                <div style="margin-bottom:10px">
                    <div
                         style="border:1px solid #000;
                        padding:8px 5px;
                        line-height:1.5;"
                    >
                        <span>invoice编号B3</span>
                        <span>invoice生成日期</span>
                    </div>
                    <div
                         style="border:1px solid #000;
                         padding:8px 5px;
                         line-height:1.5;"
                    >
                        <div>用户自定义区域行A3-1</div>
                        <div>用户自定义区域行A3-2</div>
                        <div style="overflow:hidden">
                            <span class="f-r">客户编号B3</span>
                        </div>
                    </div>
                </div>
                <!--invoice编号B2,b3,b4,A2  end-->

                <!--表格   start-->
                <table style="width:100%;
                    font-size:14px;
                    border-collapse:collapse;
                    ">
                    <tr>
                        <th style="border:1px solid #000;">Pos</th>
                        <th style="border:1px solid #000;" colspan="3">xxxx</th>
                        <th style="border:1px solid #000;" colspan="6">xxxxx</th>
                        <th style="border:1px solid #000;">xxxx</th>
                        <th style="border:1px solid #000;">xxxx</th>
                        <th style="border:1px solid #000;">xxxx</th>
                        <th style="border:1px solid #000;" colspan="2">xxxx</th>
                    </tr>
                    <tr>
                        <td style="border:1px solid #000;">ccccc</td>
                        <td style="border:1px solid #000;" colspan="3">ccccc</td>
                        <td style="border:1px solid #000;" colspan="6">ccccc</td>
                        <td style="border:1px solid #000;">ccccc</td>
                        <td style="border:1px solid #000;">ccccc</td>
                        <td style="border:1px solid #000;">ccccc</td>
                        <td style="border:1px solid #000;" colspan="2">ccccc</td>
                    </tr>
                    <tr>
                        <td colspan="13" style="border:1px solid #000;text-align:right">ddddd</td>
                        <td colspan="2"  style="border:1px solid #000;text-align:right">ddddd</td>
                    </tr>
                    <tr>
                        <td colspan="13"  style="border:1px solid #000;text-align:right">ddddd</td>
                        <td colspan="2"  style="border:1px solid #000;text-align:right">ddddd</td>
                    </tr>
                    <tr>
                        <td colspan="13"  style="border:1px solid #000;text-align:right">ddddd</td>
                        <td colspan="2"  style="border:1px solid #000;text-align:right">ddddd</td>
                    </tr>
                    <tr>
                        <td colspan="13"
                            style="border:1px solid #000;
                            font-size: 16px;
                            text-align:right;
                            font-weight:bold;">ddddd</td>
                        <td colspan="2"
                            style="border:1px solid #000;
                            font-size: 16px;
                            text-align:right;
                            font-weight:bold;">ddddd</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="border:1px solid #000;">eeee</td>
                        <td colspan="7" style="border:1px solid #000;">eeee</td>
                        <td style="border:1px solid #000;">eeee</td>
                        <td style="border:1px solid #000;">eeee</td>
                        <td colspan="2" style="border:1px solid #000;">eeee</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="border:1px solid #000;">fffff</td>
                        <td colspan="6" style="border:1px solid #000;">fffff</td>
                        <td style="border:1px solid #000;">fffff</td>
                        <td style="border:1px solid #000;">fffff</td>
                        <td style="border:1px solid #000;">ffff</td>
                        <td colspan="2" style="border:1px solid #000;">ffff</td>
                    </tr>
                    <tr>
                        <td colspan="15" style="border:1px solid #000;">gggggggg</td>
                    </tr>

                </table>
                <!--表格   end-->
                <!--end-->
                <div style="height:200px;margin-top:250px;border-top:1px solid #000;font-size:16px;font-weight:bold;color:#000">hhhhhhhhhhhhhhhhhhh</div>
            </div>
            <div slot="footer">
                <el-button size="mini" type="primary" @click.native="submit">确认</el-button>
                <el-button size="mini" type="primary" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    #invoice-template{
        .template-s{
            color:#000;
            width:100%;
            font-size:14px;
            box-sizing:border-box;
            border-collapse:collapse;
            border-left:1px solid #000;
            border-top:1px solid #000;
            td,th{
                text-align:left;
                padding:0 5px;
                height:26px;
                box-sizing: border-box;
                border-right:1px solid #000;
                border-bottom:1px solid #000;
            }
        }
        .align-right{
            text-align: right;
        }
        .mb-5{
            margin-bottom:5px;
        }
        .mb-10{
            margin-bottom:10px;
        }
        .black-color{
            color:#000
        }
        .f-16{
            font-size:16px;
        }
        .f-14{
            font-size:14px;
        }
        .f-r{
            float:right;
        }
        .wrap-box{
            margin:0 10px 10px;
            padding:20px 100px;
            border:2px solid #ddd;
            -webkit-box-shadow:0 0 25px rgb(204,227,199);
            -moz-box-shadow:0 0 25px rgb(204,227,199);
            box-shadow:0 0 25px rgb(204,227,199);
        }
        .area-1{
            float:right;
            line-height:1.5;
            font-weight:bold;
        }
        .area-2{
            line-height:1.5;
            font-weight:bold;
        }
        .invoice-box{
            color:#000;
            border:1px solid #000;
            padding:8px 5px;
            line-height:1.5;
            font-size:14px;
        }
        .prominent-css{
            font-size: 16px;
            font-weight:bold;
            color:#000;
        }
    }
</style>
<script>
    export default{
        data(){
            return {
                dialog:this.value,
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            }
        },
        methods:{
            submit(){

            },
            cancel(){}
        },
        props:{
            value:{}
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>