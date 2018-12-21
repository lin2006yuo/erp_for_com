<template>
        <page class="p-index">
            <div class="box mt-sm">
                <p class="box-title t-left" style="padding-left:10px">扫描周转箱号验收集结区号</p>
                <div class="row">
                    <label-item label="播种车：" class="mb-md mt-md ml-sm">
                        <el-select v-model="card" class="inline">
                            <el-option
                                :key="item.value"
                                v-for="item in cardList"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </label-item>
                    <label-item label="扫描周转箱号：" class="ml-sm">
                        <el-input ref="number" v-model="number" @keyup.enter.native="submit($event)"></el-input>
                    </label-item>
                </div>
                <table cellpadding="0" cellspacing="0" class="box-table" v-if="boxData">
                    <tr><th>集结区号</th><th>拣货单号</th><th><span class="fl"><el-button type="primary" size="mini" @click="clear">清除扫描信息</el-button></span>周转箱号</th></tr>
                    <tr><td style="width: 20%">001</td><td style="width: 20%">1001</td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <div class="box mt-sm">
                <p class="box-title t-left" style="padding-left:10px">正在进行多品分拣作业</p>
                <ui-table v-loading="loading" element-loading-text="玩命加载中..." :has-data="tableData.length>0" class="local" v-resize="{height:65}"
                          :heads="[
                        {label:'排序',width:10},
                        {label:'拣货单号',width:10},
                        {label:'拣货单类型',width:10},
                        {label:'作业开始时间',width:10},
                        {label:'时长',width:20},
                        {label:'分拣状态',width:20},
                        {label:'小组成员',width:20},
                    ]">
                    <tbody>
                    <template>

                    </template>
                    </tbody>
                </ui-table>
            </div>
        </page>
    </template>
    <style lang="stylus">
.p-index{
    .box{
        border: 1px solid #D3DCE6;
        box-shadow:0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
        .box-title{
            border: 1px solid #D3DCE6;
            text-align: center;
            margin: 0;
            background-color: #6495ed;
            font-size:1.2rem;
            line-height: 32px;
            height: 32px;
            color: #ffffff;
        }
        .box-table{
            width 100%;
            text-align :center;
            border-color: #e0e6ed;
            th{
                padding: 0 5px;
                height: 26px;
                text-align: center;
                box-sizing: border-box;
                background-color: #eff2f7;
                border: 1px solid #e0e6ed;
            }
            td{
                padding: 0 5px;
                height: 26px;
                text-align: center;
                box-sizing: border-box;
                border-right: 1px solid #e0e6ed;
                border-bottom: 1px solid #e0e6ed;
            }
        }
    }
}
    </style>
    <script>

        export default{
            data(){
                return{
                    card:'',
                    number:'',
                    cardList:[
                        {value:1,label:'播种车1'},
                        {value:2,label:'播种车2'},
                        {value:3,label:'播种车3'},
                    ],
                    boxData:false,
                    loading:false,
                    tableData:[],
                }
            },
            methods:{
                submit(){
                    this.boxData = true;
                    this.$refs.number.$refs.input.select();
                },
                clear(){
                   this.boxData = false;
                   this.number = '';
                },
            },
            components:{
                labelItem:require('../../../components/label-item.vue').default,
                uiTable:require('../../../components/ui-table.vue').default,
            }
        }
    </script>
