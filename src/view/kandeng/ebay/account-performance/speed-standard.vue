<template>
    <page  class="page-scroll">
        <account-change @change-account="change_account" :form="form"></account-change>
        <div class="table scroll-table" >
            <label class="inline mb-mini bold-font padding-border" style="font-size: 1.4rem">
                SpeedPAK物流管理方案及其他符合政策要求的物流服务使用情况：
                <span :class="classObject(tableData.account_status_txt)" style="font-size: 1.4rem">
                {{tableData.account_status_txt}}
                </span>
            </label>
            <table class="template" ref="tableData">
                    <tr>
                        <th class="label-width"></th>
                        <th>被评估交易数</th>
                        <th>合规率</th>
                        <th>最低要求</th>
                    </tr>
                    <tr>
                        <th>美国>$5直邮交易</th>
                        <td >{{tableData.us_trans}}</td>
                        <td >{{tableData.us_adoption}}</td>
                        <td >{{tableData.us_requirement}}</td>
                    </tr>
                    <tr>
                        <th>英国>£直邮交易</th>
                        <td >{{tableData.uk_trans}}</td>
                        <td >{{tableData.uk_adoption}}</td>
                        <td >{{tableData.uk_requirement}}</td>
                    </tr>
                    <tr>
                        <th>德国>€直邮交易</th>
                        <td >{{tableData.de_trans}}</td>
                        <td >{{tableData.de_adoption}}</td>
                        <td >{{tableData.de_requirement}}</td>
                    </tr>
                    <tr>
                        <th>澳大利亚>A$8直邮交易</th>
                        <td >{{tableData.au_trans}}</td>
                        <td >{{tableData.au_adoption}}</td>
                        <td >{{tableData.au_requirement}}</td>
                    </tr>
                    <tr>
                        <th>加拿大>C$6直邮交易</th>
                        <td >{{tableData.ca_trans}}</td>
                        <td >{{tableData.ca_adoption}}</td>
                        <td >{{tableData.ca_requirement}}</td>
                    </tr>
                </table>
            <div style="padding: 10px 0">
                <span class="right__">对应时间：{{tableData.start_date}}~{{tableData.end_date}}</span>
                <span class="right__ t-right">下次评估：{{tableData.create_pst}}</span>
            </div>
            <div class="mt-xs mb-xs ml-sm t-center mt-md">
                <permission tag="ElButton"
                            :route="apis.url_account_speed_list_download"
                            size="mini" type="primary"
                            @click.native="tradeDownload(0)">相关交易下载</permission>
            </div>
            <label class="inline mt-lg mb-mini bold-font padding-border" style="font-size: 1.4rem">买家选择SpeedPAK物流选项时卖家正确使用SpeedPAK物流管理方案的情况：</label>
            <table class="template" ref="table">
                <tr>
                    <th class="label-width"></th>
                    <th>被评估交易数</th>
                    <th>合规率</th>
                    <th>最低要求</th>
                </tr>
                <tr>
                    <th>买家选择加快型SpeedPAK物流选项</th>
                    <td >{{table.expedited_trans}}</td>
                    <td >{{table.expedited_comply_rate}}</td>
                    <td >{{table.expedited_required_rate}}</td>
                </tr>
                <tr>
                    <th>买家选择标准型SpeedPAK物流选项</th>
                    <td >{{table.standard_trans}}</td>
                    <td >{{table.standard_comply_rate}}</td>
                    <td >{{table.standard_required_rate}}</td>
                </tr>
                <tr>
                    <th>买家选择经济型SpeedPAK物流选项</th>
                    <td >{{table.economy_trans}}</td>
                    <td >{{table.economy_comply_rate}}</td>
                    <td >{{table.economy_required_rate}}</td>
                </tr>
                <tr>
                    <th>总数</th>
                    <td >{{table.total_trans}}</td>
                    <td >{{table.total_comply_rate}}</td>
                    <td >{{table.total_required_rate}}</td>
                </tr>
            </table>
            <div style="padding: 10px 0">
                <span>下次评估：{{table.create_pst}}</span>
            </div>
            <div class="mt-xs mb-xs ml-sm t-center mt-md">
                <permission tag="ElButton"
                            :route="apis.url_account_speed_pak_download"
                            size="mini" type="primary"
                            @click.native="tradeDownload(1)">相关交易下载</permission>
            </div>
        </div>
    </page>
</template>

<script>
    import {downloadFile} from '@/lib/http';
    import {
        api_account_speed_pak,
        api_account_speed_list_download,
        url_account_speed_list_download,
        url_account_speed_pak_download,
        api_account_speed_misuse_download
    } from '@/api/ebay-kandeng-public-module';
    export default {
        name: "speed-standard",
        permission:{
            url_account_speed_pak_download,
            url_account_speed_list_download
        },
        data(){
            return{
                form:{
                    account_id:'',
                },
                tableData:{},
                table:{}
            }
        },
        mounted(){
            this.form.account_id=this.param.account_id;
        },
        methods:{
            classObject(text){
                return {
                    'color-green': text!=="--"&&text==='正常',
                    'color-red': text!=="--"&&(text!=='正常'&&text!=='超标'),
                    'color-yellow':text!=="--"&&text==='超标'
                }
            },
            tradeDownload(status){//相关交易下载
                let api = !status?api_account_speed_list_download:api_account_speed_misuse_download
                this.$http(api,this.form.account_id).then(res=>{
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
            init(){
                this.$http(api_account_speed_pak,this.form.account_id).then(res=>{
                    if(!(res.list_data instanceof Array)){
                        this.tableData=res.list_data;
                    }
                    if(!(res.misuse_data instanceof Array)){
                        this.table=res.misuse_data;
                    }
                }).catch(code=>{
                    this.$message({
                        type:"warning",
                        message:  code.message||code
                    });
                })
            },
            show_speed(){
                switch (this.tableData.account_status){
                    case 0:
                        return '正常';
                    case 1:
                        return '超标';
                    case 2:
                        return '警告';
                    case 3:
                        return '超标';
                }
            },
            change_account(){
                if(!this.form.account_id)return;
                this.init()
            }
        },
        props:{
            param:{
                require:true,
                type:Object
            }
        },
        components:{
            accountChange:require('./account-change').default,
        }
    }
</script>

<style lang="stylus" scoped>
    .right__{
        display: inline-block;
        width: 49%;
    }
    .page-scroll{
        display flex;
        height: -webkit-fill-available;
        flex-direction:column;
    }
    .scroll-table{
        flex:1;
        overflow-y scroll;
        padding-bottom 50px;
    }
    .padding-border{
        padding: 10px 0;
    }
    .label-width{
        width:240px;
    }
</style>
