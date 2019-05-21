    <template>
        <page class="p-index">
            <!--搜索  Start-->
            <el-card class="mb-xs">
                <label-buttons label="状态：" :label-width="60" :buttons="statusList" @select="select_status"></label-buttons>
                <div>
                    <span class="inline">规则名称：</span><el-input class="inline width-super" @keyup.enter.native="search" v-model="name"></el-input>
                    <el-button class="inline ml-sm" type="primary" size="mini" @click.native="search">搜索</el-button>
                    <el-button class="inline" size="mini" @click.native="clear_search">清空搜索</el-button>
                </div>
            </el-card>
            <!--搜索  end-->
            <div class="mb-xs">
                <permission
                        tag="ElButton"
                        :route="apis.url_update_invoice_rules"
                        class="ml-sm"
                        type="primary"
                        size="mini"
                        @click.native="add_rule">添加</permission>
                <permission
                        tag="ElButton"
                        :route="apis.url_sort_invoice_rules"
                        class="ml-sm"
                        type="primary"
                        size="mini"
                        v-if="isDrag"
                        @click.native="save_sort">保存</permission>
            </div>
            <!--table列表   Start-->
            <ui-table
                v-loading="loading"
                element-loading-text="玩命加载中..."
                :has-data="table.length>0"
                :heads="[
                    {label:'NO',width:4},
                    {label:'优先级',width:15},
                    {label:'规则名称',width:30},
                    {label:'税率',width:8},
                    {label:'模板',width:15},
                    {label:'语种',width:8},
                    {label:'状态',width:10},
                    {label:'操作',width:10},
                ]"
                :body-height="10"
            >
                <draggable v-if="table.length>0"  v-model="table" tag="tbody" @update="draggable_change(table)">
                    <tr v-for="(item,index) in table" :key="item.id" :class="[clickData[index]?'active-color':'']" @click="addClass(index)">
                        <!--NO-->
                        <td>{{index+1}}</td>
                        <!--优先级-->
                        <td>
                            <span v-if="index!==0" class="invoice invoice-up inline" @click="let_up(index)"></span>
                            <span v-if="index !==table.length-1" class="invoice invoice-down inline" @click="let_down(index)"></span>
                            <el-popover
                                    v-model="item.isTurn"
                                    placement="top"
                                    trigger="click">
                                <div style="width:200px;text-align: center;" >
                                    <el-row>
                                        <span >跳转到</span>
                                        <input class="inline el-input__inner" style="width:60px" v-model="item.number" type="number" min="0" onkeyup="this.value=this.value.replace(/\D/g,'')"onafterpaste="this.value=this.value.replace(/\D/g,'')" >
                                        <span>行</span>
                                        <el-button size="mini" @click.native="turnClose(index)" type="primary" class="inline ml-xs">确定</el-button>
                                    </el-row>
                                </div>
                                <span class="invoice invoice-turn inline"   slot="reference"></span>
                            </el-popover>
                        </td>
                        <!--规则名称-->
                        <td class="drag-public drag-public-right">
                            <ui-tips :content="item.name"></ui-tips>
                        </td>
                        <!--税率-->
                        <td>{{item.tax_rate}}</td>
                        <!--模板-->
                        <td>{{item.template}}</td>
                        <!--语种-->
                        <td>{{item.lang}}</td>
                        <!--状态-->
                        <td>
                            <permission
                                    tag="ElSwitch"
                                    :route="apis.url_change_status"
                                    @change="status_change(item)"
                                    v-model="item.status"
                                    on-text="启用"
                                    off-text="停用"></permission>
                        </td>
                        <!--操作-->
                        <td>
                            <!--<permission-->
                                    <!--tag="span"-->
                                    <!--:route="apis.url_edit_invoice_rules"-->
                                    <!--class="operate"-->
                                    <!--@click="look_over(item)">查看</permission>-->
                            <!--<permission tag="span"-->
                                        <!--:route="apis.url_edit_invoice_rules">|</permission>-->
                            <permission
                                    tag="span"
                                    :route="apis.url_update_invoice_rules"
                                    class="operate"
                                    @click="edit(item)">查看编辑</permission>
                            <permission tag="span"
                                        :route="apis.url_edit_invoice_rules">|</permission>
                            <permission
                                    tag="span"
                                    :route="apis.url_delete_invoice_rules"
                                    class="operate" @click="cur_delete(item)">删除</permission>
                        </td>
                    </tr>
                </draggable>
            </ui-table>
            <!--table列表   end-->
            <!--引入   添加页面-->
            <add-rule ref="addRule"  v-model="addDialog"
                      @submit="submit"
                      :title="ruleTitle"
                      :edit="isEdit"
                      :mdfid="mdfId"
            ></add-rule>
        </page>
    </template>
    <style lang="stylus">
        .invoice{
            padding:5px;
            width:16px;
            height:16px;
            &:hover{
                background-color:rgba(7,17,27,.3);
                border-radius: 3px;
            }
            &:active{
                background-color:rgba(7,17,27,.5);
                border-radius: 3px;
            }
        }
        .invoice-up{
            background:url('../../../../assets/turnUp .png') no-repeat 5px 5px;
        }
        .invoice-down{
            background:url('../../../../assets/turnDown.png') no-repeat 5px 5px;
        }
        .invoice-turn{
            background:url('../../../../assets/turn.png') no-repeat 5px 5px;
        }
        .sort-span{
            width:16px;
            height:16px;
        }
    </style>
    <script>
        import {invoice_rules,delete_invoice_rules,sort_invoice_rules,change_status} from '../../../../api/invoice';
        import {url_update_invoice_rules,url_sort_invoice_rules,url_change_status,url_edit_invoice_rules,url_delete_invoice_rules} from '../../../../api/invoice';
        export default{
            permission:{
                url_update_invoice_rules,
                url_sort_invoice_rules,
                url_change_status,
                url_edit_invoice_rules,
                url_delete_invoice_rules
            },
            page:{},
            refresh(){
                this.get_invoice_rules();
            },
            data(){
                return{
                    statusList:[
                        {label:"全部",value:-1},
                        {label:"已启用",value:0},
                        {label:"已停用",value:1},
                    ],
                    status:-1,
                    name:"",
                    table:[],
                    addDialog:false,
                    isEdit:false,
                    mdfId:0,
                    isDrag:false,
                    clickData:[],
                    loading:false,
                    ruleTitle:"添加Invoice自动规则"
                }
            },
            created(){
                this.get_invoice_rules();
            },
            mounted(){
                for(let i=0;i<this.table.length;i++){
                    this.clickData.push(false)
                }
            },
            methods:{
                init_status_btn(){
                    let curBtn = this.statusList;
                    this.statusList = [];
                    this.$nextTick(()=>{
                        this.statusList = curBtn;
                    })
                },
                addClass(index){
                    this.clickData=this.clickData.map(()=>{
                        return  false
                    });
                    this.clickData[index]=true
                },
                draggable_change(val){
                    this.isDrag = true;
                    this.sortList = [];
                    val.forEach((row,i)=>{
                        this.sortList.push({id:row.id,sort:i});
                    });
                },
                search(){
                    this.get_invoice_rules();
                },
                clear_search(){
                    //this.status = -1;
                    this.name = "";
                    this.get_invoice_rules();
                },
                select_status(index){
                    this.status = this.statusList[index].value;
                    this.get_invoice_rules();
                },
                let_up(index){
                    let data = this.table.splice(index-1,1);
                    this.table.splice(index,0,data[0]);
                    this.draggable_change(this.table);
                },
                let_down(index){
                    let data = this.table.splice(index+1,1);
                    this.table.splice(index,0,data[0]);
                    this.draggable_change(this.table);
                },
                turnClose(index){
                    let i = this.table[index].number;
                    let maxNumber = this.table.length;
                    if(i<=0){
                      return this.$message({type: "warning", message: "请输入大于0的数字！"})
                    }else if(i>maxNumber){
                        return this.$message({type: "warning", message: `请输入1-${maxNumber}范围内的数字！`})
                    }else if(index ===i-1){
                        return this.$message({type: "warning", message: "已在当前行！"})
                    }else{
                        this.table[index].isTurn = false;
                        let data = this.table.splice(index,1);
                        this.table.splice(i-1,0,data[0]);
                        this.draggable_change(this.table);
                        this.addClass(i-1);
                    }
                },
                cur_delete(row){
                    this.$confirm(`您将删除  ${row.name} ，确认此操作吗?`,'提示',{
                        confirmButtonText:"确定",
                        cancelButtonText:"取消",
                        type:"warning"
                    }).then(()=>{
                        this.$http(delete_invoice_rules,row.id).then(res=>{
                            this.$message({type: "success", message: res.message || res})
                            let index = this.table.indexOfFun(row,function (old,row) {
                                return old.id === row.id;
                            });
                            this.table.splice(index, 1);
                        }).catch(code=>{
                            this.$message({type: "error", message: code.message || code})
                        })
                    }).catch(()=>{
                        this.$message({
                            type:"info",
                            message:"已取消"
                        })
                    })
                },
                status_change(val){
                    this.$confirm(`您将更改  ${val.name} 的状态，确认此操作吗?`,'提示',{
                        confirmButtonText:"确定",
                        cancelButtonText:"取消",
                        type:"warning"
                    }).then(()=>{
                        console.log("val2",val.status)
                        this.$http(change_status,val.id,val.status?0:1).then(res=>{
                            this.$message({type: "success", message: res.message || res})
                            this.get_invoice_rules();
                        }).catch(code=>{
                            val.status=!val.status;
                            this.$message({type: "error", message: code.message || code})
                        });
                    }).catch((code)=>{
                      val.status = !val.status;
                        this.$message({type: "info", message: '已取消'})
                    })
                },
                look_over(item){
                    this.mdfId = item.id;
                    if(this.mdfId){
                        this.$nextTick(()=>{
                            this.$refs.addRule.edit_form(this.mdfId)
                        })
                    }
                    this.isEdit = false;
                    this.addDialog = true;
                    this.ruleTitle = `查看规则：${item.name}信息`;
                },
                edit(item){
                    this.addDialog = true;
                    this.ruleTitle = `编辑规则：${item.name}信息`;
                    this.isEdit = true;
                    this.mdfId = item.id;
                    if(this.mdfId){
                        this.$nextTick(()=>{
                            this.$refs.addRule.edit_form(this.mdfId)
                        })
                    }
                },
                add_rule(){
                    this.mdfId = "";
                    this.addDialog = true;
                },
                save_sort(){
                    this.$http(sort_invoice_rules,{sort:this.sortList}).then(res=>{
                        this.$message({type: "success", message: res.message || res});
                        this.get_invoice_rules();
                        this.isDrag = false;
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})
                    })
                },
                submit(){
                    this.get_invoice_rules();
                },
//            ------------------------------------------------------     API
                get_invoice_rules(){
                    let params = {
                        name:this.name.trim()
                    }
                    this.status>-1&&(params.status=this.status);
                    this.loading = true;
                    this.$http(invoice_rules,params).then(res=>{
                        res.forEach(row=>{
                            return row.status =row.status===1?false:true;
                        });
                        res.forEach(row=>{
                            row.isTurn=false;
                            row.number=1;
                        })
                        this.table = res;
                        this.loading = false;
                    }).catch(code=>{
                        setTimeout(()=>{
                            this.loading = false;
                        },200);
                        console.log(code);
                    })
                }
            },
            components:{
                labelButtons:require('../../../../components/label-buttons.vue').default,
                uiTable:require('../../../../components/ui-table.vue').default,
                draggable:require('../../../../components/drag-drop').default,
                uiTips:require('../../../../components/ui-tip.vue').default,
                addRule:require('./add_rule.vue').default,
            }
        }
    </script>
