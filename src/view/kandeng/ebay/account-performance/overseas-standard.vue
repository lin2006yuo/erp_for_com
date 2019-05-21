<template>
    <page>
        <account-change @change-account="change_account" :form="form"></account-change>
        <div>
            <label class="inline mb-mini bold-font padding-border" style="font-size: 1.4rem">海外仓表现：
                <span :class="classObject()" style="font-size: 1.4rem">{{show_speed()}}</span></label>
            <table class="template" ref="table">
                <tr>
                    <th class="label-width" rowspan=2></th>
                    <th colspan="2">合规刊登率</th>
                    <th colspan="2">及时发货率</th>
                    <th colspan="2">物品及时送达率</th>
                    <th colspan="2">物流不良交易率</th>
                </tr>
                <tr>
                    <th >标准值</th>
                    <th >当前评估值</th>
                    <th >标准值</th>
                    <th >当前评估值</th>
                    <th >标准值</th>
                    <th >当前评估值</th>
                    <th >标准值</th>
                    <th >当前评估值</th>
                </tr>
                <tr>
                    <th>美国</th>
                    <td >{{tableData.us_correct_list_rate_sd}}</td>
                    <td >{{tableData.us_correct_list_rate}}</td>
                    <td >{{tableData.us_ascan_ht_rate_sd}}</td>
                    <td >{{tableData.us_dscan_edd_rate}}</td>
                    <td >{{tableData.us_dscan_edd_rate_sd}}</td>
                    <td >{{tableData.us_ship_defect_rate}}</td>
                    <td >{{tableData.us_ship_defect_rate_sd}}</td>
                    <td >{{tableData.us_correct_list_rate_flag}}</td>
                </tr>
                <tr>
                    <th>英国</th>
                    <td >{{tableData.uk_correct_list_rate_sd}}</td>
                    <td >{{tableData.uk_correct_list_rate}}</td>
                    <td >{{tableData.uk_ascan_ht_rate_sd}}</td>
                    <td >{{tableData.uk_ascan_ht_rate}}</td>
                    <td >{{tableData.uk_dscan_edd_rate_sd}}</td>
                    <td >{{tableData.uk_dscan_edd_rate}}</td>
                    <td >{{tableData.uk_ship_defect_rate_sd}}</td>
                    <td >{{tableData.uk_ship_defect_rate}}</td>
                </tr>
                <tr>
                    <th>德国</th>
                    <td >{{tableData.de_correct_list_rate_sd}}</td>
                    <td >{{tableData.de_correct_list_rate}}</td>
                    <td >{{tableData.de_ascan_ht_rate_sd}}</td>
                    <td >{{tableData.de_ascan_ht_rate}}</td>
                    <td >{{tableData.de_dscan_edd_rate_sd}}</td>
                    <td >{{tableData.de_dscan_edd_rate}}</td>
                    <td >{{tableData.de_ship_defect_rate_sd}}</td>
                    <td >{{tableData.de_ship_defect_rate}}</td>
                </tr>
                <tr>
                    <th>澳大利亚</th>
                    <td >{{tableData.au_correct_list_rate_sd}}</td>
                    <td >{{tableData.au_correct_list_rate}}</td>
                    <td >{{tableData.au_ascan_ht_rate_sd}}</td>
                    <td >{{tableData.au_ascan_ht_rate}}</td>
                    <td >{{tableData.au_dscan_edd_rate_sd}}</td>
                    <td >{{tableData.au_dscan_edd_rate}}</td>
                    <td >{{tableData.au_ship_defect_rate_sd}}</td>
                    <td >{{tableData.au_ship_defect_rate}}</td>
                </tr>
                <tr>
                    <th>其他海外仓</th>
                    <td >{{tableData.other_correct_list_rate_sd}}</td>
                    <td >{{tableData.other_correct_list_rate}}</td>
                    <td >{{tableData.other_ascan_ht_rate_sd}}</td>
                    <td >{{tableData.other_ascan_ht_rate}}</td>
                    <td >{{tableData.other_dscan_edd_rate_sd}}</td>
                    <td >{{tableData.other_dscan_edd_rate}}</td>
                    <td >{{tableData.other_ship_defect_rate_sd}}</td>
                    <td >{{tableData.other_ship_defect_rate}}</td>
                </tr>
            </table>
            <div style="padding: 10px 0">
                <span class="right__ ">对应时间：{{tableData.review_star_date}}~{{tableData.review_end_date}}</span>
                <span class="right__ t-right">下次评估：{{tableData.create_pst}}</span>
            </div>
            <div class="mt-xs mb-xs ml-sm t-center mt-md">
                <permission tag="ElButton"
                            :route="apis.url_account_speed_warehouse_download"
                            size="mini" type="primary"
                            @click.native="tradeDownload">相关交易下载</permission>
            </div>
        </div>
    </page>
</template>

<script>
    import {downloadFile} from '@/lib/http';
    import {api_account_acct_list_download,api_account_speed_warehouse_download,url_account_speed_warehouse_download} from '@/api/ebay-kandeng-public-module'
    export default {
        name: "overseas-standard",
        permission:{
            url_account_speed_warehouse_download
        },
        data(){
            return{
                form:{
                    account_id:'',
                },
                tableData:{},
            }
        },
        mounted(){
            this.form.account_id=this.param.account_id;
        },
        methods:{
            classObject(){
                let text = this.show_speed();
                return {
                    'color-green': text!=="--"&&text==='正常',
                    'color-red': text!=="--"&&(text!=='正常'&&text!=='超标'),
                    'color-yellow':text!=="--"&&text==='超标'
                }
            },
            tradeDownload(){//相关交易下载
                this.$http(api_account_speed_warehouse_download,this.form.account_id).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    if(res.message==='OK'){
                        let params = {
                            file_code:res.file_code,
                        };
                        downloadFile({
                            url:url,
                            get:params,
                            fileName:res.file_name,
                            suffix:'.csv',
                        });
                    }else {
                        this.$message({type:"success",message:res.message||res});
                    }
                }).catch(code=>{
                    this.$message({
                        type:"warning",
                        message:  code.message||code
                    });
                })
            },
            show_speed(){
                switch (this.tableData.action_status){
                    case 0:
                        return '正常';
                    case 1:
                        return '超标';
                    case 2:
                        return '警告';
                    case 3:
                        return '超标';
                    case null:
                        return '数据未更新';
                    default:
                        return '--'
                }
            },
            init(){
                this.$http(api_account_acct_list_download,this.form.account_id).then(res=>{
                    if(!(res.data instanceof Array)){
                        this.tableData=res.data;
                    }
                }).catch(code=>{
                    this.$message({
                        type:"warning",
                        message:  code.message||code
                    });
                })
            },
            change_account(){
                if(!this.form.account_id)return;
                this.init()
            }
        },
        props:{
          param:{
              require:true,
              type:Object,
          }
        },
        components:{
            accountChange:require('./account-change').default,
        }
    }
</script>

<style scoped>
    .right__{
        display: inline-block;
        width: 49%;
    }
    .color-red{
        color:red;
    }
    .color-green{
        color:green;
    }
    .padding-border{
        padding: 10px 0;
    }
</style>
