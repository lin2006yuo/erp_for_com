<template>
    <div class="c-table-data">
        <el-row class="mt-xs mb-xs ml-sm">
            <el-button size="mini"
                       type="primary"
                       @click.native="add">添加
            </el-button>
            <el-button size="mini"
                       type="primary"
                       :disabled="selectData.length === 0"
                       @click.native="pay_all">批量标记为正常
            </el-button>
        </el-row>
        <el-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :data="tableData.data"
                  ref="tableData"
                  border
                  align="center"
                  v-resize="{height:41}"
                  highlight-current-row
                  @sort-change="sort_change"
                  @selection-change="selectionChange">
            <el-table-column
                    align="center"
                    type="selection"
                    width="35">
            </el-table-column>
            <el-table-column
                    width="60"
                    label="NO."
                    prop="id">
            </el-table-column>
            <el-table-column
                    show-overflow-tooltip
                    label="邮箱号"
                    prop="email">
            </el-table-column>
            <el-table-column
                    show-overflow-tooltip
                    label="手机号"
                    prop="phone">
            </el-table-column>
            <el-table-column
                    inline-template
                    sortable
                    label="注册账号数">
                <div>
                    <el-button type="text" @click.native="see_show(row)" :class="[row.account_count?'':'disabled activeRed']">{{row.account_count}}</el-button>
                </div>
            </el-table-column>
            <el-table-column
                label="邮箱状态"
                inline-template>
                <div>
                    <el-switch v-model="row.status"
                               on-text="启用"
                               off-text="停用"
                               :on-value="1"
                               :off-value="0"
                               @change="email_status(row,$event)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column
                    label="接收邮箱"
                    inline-template>
                <div>
                    <el-switch v-model="row.is_receive"
                               on-text="启用"
                               off-text="停用"
                               :on-value="1"
                               :off-value="0"
                               @change="receiver_mailbox(row,$event)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column
                    label="发送邮箱"
                    inline-template>
                <div>
                    <el-switch v-model="row.is_send"
                               on-text="启用"
                               off-text="停用"
                               :on-value="1"
                               :off-value="0"
                               @change="send_mail(row,$event)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column
                    label="注册人">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{scope.row.reg_department_name}}</p>
                        <div slot="reference">
                            <div>{{scope.row.reg_txt}}</div>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="150"
                    label="注册日期">
                <div>{{row.reg_time_date}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="是否有异常报错">
                <span class="red">{{row.error_msg}}</span>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="异常报错时间">
                <span>{{row.error_time_txt}}</span>
            </el-table-column>
            <el-table-column
                    label="操作"
                    inline-template>
                <div>
                    <span class="operate" @click="look_over(row)">查看</span> |
                    <span class="operate" @click="edit(row)">编辑</span>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination class="page-fixed"
                       @size-change="$emit('size',$event)"
                       @current-change="$emit('page',$event)"
                       :current-page="tableData.page"
                       :page-sizes="[20, 50,100, 200, 500]"
                       :page-size="tableData.page_size"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="tableData.count">
        </el-pagination>
        <add-look-edit v-model="dialogShow"
                       :title="title"
                       :add-data="addData"
                       :look-edit="lookEdit"
                       :post-type="postType"
                       :phone-type="phoneType"
                       :is-disabled="isDisabled"
                       @keep="keep"
                       @refresh="$emit('fresh')"
                       @rebuild-btn="rebuild_btn">
        </add-look-edit>
        <account-table v-model="accountCount" :account-data="accountData" :title="title"></account-table>
    </div>
</template>
<style lang="stylus">
    .sucStatus {
        color: #339907
    }
    .loseStatus {
        color: #ff0000;
    }
    .green{
        color: green
    }
    .red{
        colr: red
    }
    .activeRed{
        color #a29f9c
    }
    .disabled{
        pointer-events:none;
    }
</style>
<script>
    import addLookEdit from './add-look-edit';

    import {api_put_email,api_get_email,api_post_email,api_available_list,api_get_accounts,api_email_prefix} from '@/api/email'
    export default {
        data() {
            return {
                dialogShow:false,
                title:'',
                addData:{},
                selectData:[],
                lookEdit:false,
                postType:[],
                phoneType:[],
                isDisabled:false,
                accountData:[],
                accountCount:false
            }
        },
        mounted(){
            this.get_post_type();
            this.rebuild_btn();
        },
        computed:{
            email(){
                return this.tableData.data.map(row=>{
                    let index=row.email.indexOf('@');
                    let emailName=row.email.substring(0,index);
                    return emailName;
                });
            }
        },
        methods:{
            rebuild_btn(){//---生成邮箱前缀
                this.$http(api_email_prefix).then(res=>{
                    this.addData.email = res;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            see_show(row){//---注册账号数
                this.$http(api_get_accounts,row.id).then(res=>{
                    this.title = `查看邮箱：${row.email} 注册账号信息`
                    this.accountData = res.data;
                    this.accountCount = true;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            selectionChange(select){
                this.selectData = select.map(res=>{
                    return res.id
                });
            },
            // 添加
            add(){
                this.title = '添加邮箱号';
                function randomString() {
                    let len=Math.floor(Math.random()*8)+8;
                    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstunwxyz';
                    let max = chars.length;
                    let str = '';
                    for (let i = 0; i < len; i++) {
                        str += chars.charAt(Math.floor(Math.random() * max));
                    }
                    return str;
                }
                function compare(arr) {
                    let tempArr=arr;
                    let temp=JSON.parse(JSON.stringify(randomString()));
                    let find=tempArr.find(row=>row.includes(temp));
                    if(find){
                        return compare(tempArr);
                    }else{
                        return temp;
                    }
                }
                this.addData = {
                    email:compare(this.email),
                    // email:this.prefix,
                    password:'',
                    phone_id:'',
                    post_id:'',
                    reg_id:'',
                    reg_time_date:'',
                    status:1,
                    is_receive:1,
                    is_send:1,
                    channel_ids:[],
                    reg_txt:'',
                };
                this.dialogShow = true;
                this.lookEdit = false;
                this.isDisabled = false;
            },
            // 查看
            look_over(row){
                this.title = `查看邮箱: ${row.email} 信息`;
                this.$http(api_get_email,row.id).then(res=>{
                    this.addData = {
                        id : res.id,
                        email : res.email,
                        password : res.password,
                        phone_id : res.phone_id,
                        post_id : res.post_id,
                        reg_id : res.reg_id,
                        reg_time_date : res.reg_time_date,
                        status : res.status,
                        is_receive : res.is_receive,
                        is_send : res.is_send,
                        channel_ids : res.channel_ids,
                        phone : res.phone,
                        reg_txt : res.reg_txt,
                    };
                    this.dialogShow = true;
                    this.lookEdit = true;
                }).catch(code => {
                    console.log(code)
                });
            },
            // 编辑
            edit(row){
                this.title =  `编辑邮箱: ${row.email} 信息`;
                this.$http(api_get_email,row.id).then(res=>{
                    let email = res.email.split("@");
                    this.addData = {
                        id : res.id,
                        email : email[0],
                        password : res.password,
                        phone_id : res.phone_id,
                        post_id : res.post_id,
                        reg_id : res.reg_id,
                        reg_time_date : res.reg_time_date,
                        status : res.status,
                        is_receive : res.is_receive,
                        is_send : res.is_send,
                        channel_ids : res.channel_ids,
                        phone : res.phone,
                        reg_txt : res.reg_txt,
                        is_reg_txt : row.is_reg_txt,
                    };
                    this.dialogShow = true;
                    this.lookEdit = false;
                    this.isDisabled = true;
                }).catch(code => {
                    console.log(code)
                });
            },
            // 邮箱状态
            email_status(row,status){
                this.$confirm(`您将${status?'启用':'停用'}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_put_email,row.id,{status:status}).then(res=>{
                        this.$set(row,'status',status);
                        this.$message({type:'success',message:res.message||res});
                    }).catch( error=>{
                        this.$set(row,'status',status?1:0);
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: `已取消${status?'启用':'停用'}`});
                    this.$set(row,'status',status?0:1);
                });
            },
            // 接收邮箱
            receiver_mailbox(row,status){
                this.$confirm(`您将${status?'启用':'停用'}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_put_email,row.id,{is_receive:status}).then(res=>{
                        this.$set(row,'is_receive',status);
                        this.$message({type:'success',message:res.message||res});
                    }).catch( error=>{
                        this.$set(row,'is_receive',status?1:0);
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: `已取消${status?'启用':'停用'}`});
                    this.$set(row,'is_receive',status?0:1);
                });
            },
            // 发送邮箱
            send_mail(row,status){
                this.$confirm(`您将${status?'启用':'停用'}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_put_email,row.id,{is_send:status}).then(res=>{
                        this.$set(row,'is_send',status);
                        this.$message({type:'success',message:res.message||res});
                    }).catch( error=>{
                        this.$set(row,'is_send',status?1:0);
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: `已取消${status?'启用':'停用'}`});
                    this.$set(row,'is_send',status?0:1);
                });
            },
            pay_all(){
                this.$emit('batch-error',this.selectData);
            },
            keep(val){
                let data = val;
                if(!!val.reg_time_date){
                    let d = new Date(val.reg_time_date);
                    data.reg_time_date=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }else{
                    data.reg_time_date=''
                }
                if(val.hasOwnProperty('id')) {//更新
                    this.$http(api_put_email,data.id,data).then(res=>{
                        this.dialogShow = false;
                        this.isDisabled = false;
                        this.$emit('email-init');
                        this.$message({type:'success',message:res.message||res});
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('emailAdd', false);
                        }, 300)
                    })
                }else {//新增
                    this.$http(api_post_email,data).then(res=>{
                        this.dialogShow = false;
                        this.$emit('email-init');
                        this.tableData.count ++
                        this.$message({type:'success',message:res.message||res});
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('emailAdd', false);
                        }, 300)
                    })
                }
            },
            get_post_type(){
                this.$http(api_available_list).then(res=>{
                    this.postType=res.map(row=>{
                        return {
                            label:row.post,
                            value:row.id,
                        }
                    });
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
        },
        props:{
            loading:{
                type:Boolean,
                require:true
            },
            tableData:{
                type:Object,
                required:true
            },
        },
        components: {
            accountTable: require("./account-table.vue").default,
            addLookEdit,
        }
    }
</script>