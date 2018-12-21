  <template>
        <el-row class="p-paypal-table">
            <el-table
                    v-resize="{height:41}"
                    class="scroll-bar"
                    :data="lists"
                    @sort-change="sort_change"
                    highlight-current-row
                    @selection-change="handleSelectionChange">
            >
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column
                    type="selection"
                    width="35"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="ID"
                        width="50"
                        align="center"
                >
                </el-table-column>
                <el-table-column
                        inline-template sortable
                        label="PayPal账户">
                    <div>
                        <ui-tip :content="row.account_name" :width="98" v-copy></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template sortable
                        label="用户名">
                    <div>
                        <ui-tip :content="row.api_user_name" :width="98" v-copy></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="订单授权状态">
                    <div>
                        <ui-tip :content="row.paypal_authorized | authFilter" :width="98" v-copy></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="纠纷授权状态">
                    <div>
                        <ui-tip :content="row.rest_authorized | authFilter" :width="98" v-copy></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="数据同步">
                    <div>
                        <span class="succeed-download-order"
                              v-if="row.is_invalid&&row.download_paypal>0"
                              :title="`远程订单${row.download_paypal/60}小时抓取一次`">
                        </span>
                        <span class="default-download-order"
                              v-else title="同步远程订单已关闭"></span>
                        <!--<img src="../../../../assets/succeed-dispute-icon.svg" alt="">-->
                        <span class="succeed-dispute-icon"
                              v-if="row.is_invalid&&row.download_dispute>0"
                              :title="`远程订单${row.download_dispute/60}小时抓取一次`">
                        </span>
                        <span class="default-dispute-icon"
                              v-else title="同步纠纷已关闭"></span>

                        <span class="succeed_message"
                              v-if="row.is_invalid && row.download_email>0"
                              :title="`远程邮件${row.download_email/60}小时同步一次`">
                            </span>
                        <span class="default_message"
                              v-else title="同步站邮件已关闭">
                            </span>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="Paypal状态">
                    <div>
                        <span :class="{green:row.status,red:!row.status}">{{row.status?'有效':'无效'}}</span>
                    </div>
                </el-table-column>
                <el-table-column inline-template width="80" label="系统状态" align="center">
                    <div>
                        <permission
                                tag="ElSwitch"
                                :route="apis.url_change_status"
                                :key="row.id"
                                :value="row.is_invalid"
                                on-text="启用"
                                off-text="停用"
                                @change="changStatus(row)"></permission>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="创建时间"
                        align="center"
                >
                    <div>{{row.create_time | filterTime}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="更新时间"
                        align="center"
                >
                    <div>{{row.updated_time | filterTime}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="操作"
                        align="center">
                        <div>
                            <permission
                                    tag="span"
                                    :route="apis.url_upd"
                                    class="operate"
                                    v-for="(operate,index) in operates"
                                    :key="index"
                                    @click="dooperate(row.id, operate.action)">{{operate.label}}</permission>
                        </div>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="tables.page"
                    :page-sizes="[20,50,100,200,500]"
                    :page-size="tables.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tables.total">
            </el-pagination>
        </el-row>
    </template>
    <style lang="stylus">
        .green{
            color: green
        }
        .red{
            colr: red
        }
        .succeed_message{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -3510px;
        }
        .default_message{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -3529px;
        }
    </style>
    <script>
        import {url_change_status,url_upd} from '../../../../api/paypal';
        export default{
            permission:{
                url_change_status,
                url_upd
            },
            data(){
                return{
                    operates:[
                        {label:'修改',action:function(id){
                            this.$emit('modify',id);
                        }},
                    ]
                }
            },
            filters:{
                filterTime(val){
                    return val?datef('YYYY-MM-dd HH:mm:ss',val):"-- --"
                },
                authFilter(val){
                    if(Number(val) === 0){
                        return '未授权'
                    }else if(Number(val) === 1){
                        return '已授权'
                    }
                }
            },
            methods:{
                sort_change(val){
                    this.$emit('sort-change',val);
                },
                handleSizeChange(size){
                    this.$emit('change-size',size);
                },
                handleCurrentChange(page){
                    this.$emit('change-page',page)
                },
                dooperate(id, action){
                    action.call(this,id);
                },
                handleSelectionChange(selects){
                    this.$emit('selects', selects);
                },
                changStatus(row){
                    console.log("row",row);
                    this.$emit('change-status',row);
                }
            },
            computed:{
                lists(){
                    return this.tables.lists.map(data=>{
                        data.is_invalid = data.is_invalid ? true : false;
                        return data;
                    })
                },
                emptyText() {
                    return this.firstLoading?'等待请求数据中...':'暂无数据'
                },
            },
            props:{
                tables:{
                    required:true,
                    type:Object
                },
                firstLoading: {
                    type: Boolean,
                    required: true
                }
            },
            components:{
                uiTip:require('../../../../components/ui-tip.vue').default
            }
        }
    </script>
