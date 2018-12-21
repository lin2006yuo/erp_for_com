<template>
    <page-dialog title="添加管理员" v-model="show" :close-on-click-modal="false" size="large">
        <div>
            <el-button class="mb-xs ml-sm" :disabled="!showAddButton" type="primary" size="mini" @click.native="add_user">添加</el-button>
            <el-table :data="users">
                <el-table-column label="用户名" inline-template>
                    <el-select v-model="row.user_id">
                        <el-option v-for="user in allusers" :key="user.value" :label="user.label" :value="user.value"></el-option>
                    </el-select>
                </el-table-column>
                <el-table-column label="仓库类型" inline-template>
                    <el-select v-model="row.warehouse_type">
                        <el-option v-for="type in types"
                                   :label="type.label"
                                   :value="type.value"
                                   :key="type.value"
                        ></el-option>
                    </el-select>
                </el-table-column>
                <el-table-column label="创建人"></el-table-column>
                <el-table-column label="创建时间" inline-template>
                    <span>{{row.create_time | fdatetime }}</span>
                </el-table-column>
                <el-table-column label="操作" inline-template>
                    <span class="btn" @click="remove(row)">删除</span>
                </el-table-column>
            </el-table>
        </div>
        <span slot="footer">
            <request-button req-key='userManage' @click="save">确定</request-button>
            <el-button size="mini" @click.native="cancel">取消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    import http from '../../../lib/http';
    export default{
        data(){
            return{
                show:this.value,
                users:[],
                types:[
                    {label:'全部',value:0},
                    {label:'本地仓',value:1},
                    {label:'海外仓',value:2}
                ],
                allusers:[
                    {label:'T1',value:1},
                    {label:'T2',value:2},
                    {label:'T3',value:3},
                    {label:'T4',value:4},
                ]
            }
        },
        methods:{
            add_user(){
                this.users.push({
                    user_id:0,
                    user_name:'',
                    warehouse_type:0,
                    create_time:parseInt(new Date().getMilliseconds() / 1000),
                    status:0,
                })
            },
            save(){
                let has0 = 0;
                let has1 = 0;
                let has2 = 0;
                for(let i = 0; i < this.users.length; i++){
                    let user = this.users[i];
                    switch (user.warehouse_type){
                        case 0:
                            has0 +=1;
                            break;
                        case 1:
                            has1 +=1;
                            break;
                        case 2:
                            has2 +=1;
                            break;
                    }
                }
                if(has0 && (has1 || has2)){
                    this.$message({
                        type: 'warning',
                        message: '非法提交',
                    });
                    setTimeout(() => {
                        this.$reqKey('userManage', false);
                    }, 300);
                    return;
                }
                if(has0 > 1 || has1>1 || has2>1){
                    this.$message({
                        type: 'warning',
                        message: '非法提交',
                    });
                    setTimeout(() => {
                        this.$reqKey('userManage', false);
                    }, 300);
                    return;
                }
                this.$emit('save',this.users);
                let params = {
                    channel_id:this.account.channel_id,
                    account_id:this.account.account_id,
                    maps:this.users
                };
                this.$http(http('PUT', config.apiHost+'index/channel_account/user_map_set', params)).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message||res
                    });
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('userManage', false);
                    }, 300);
                })
            },
            cancel(){
                this.show = false;
            },
            remove(row){
                let index = this.users.indexOf(row);
                this.users.splice(index, 1);
            }
        },
        computed:{
            showAddButton(){
                let has1 = false;
                let has2 = false;
                for(let i=0; i < this.users.length; i++){
                    let user = this.users[i];
                    if(user.warehouse_type === 0){
                        return false;
                    }
                    if(user.warehouse_type === 1){
                        has1 = true;
                    }
                    if(user.warehouse_type === 2){
                        has2 = true;
                    }
                }
                return !has1 || !has2;
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
                if(val){
                    let params = {
                        channel_id:this.account.channel_id,
                        account_id:this.account.account_id
                    };
                    this.$http(http('GET', config.apiHost+'index/channel_account/user_map_get',params)).then(res=>{
                        this.users = res;
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        });
                    });
                    this.$http(http('GET', config.apiHost+"index/channel_account/user_list", {channel_id:this.account.channel_id})).then(res=>{
                        this.allusers = res;
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })
                }
            },
            value(val){
                this.show = val;
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            account:{
                required:false,
                type:Object
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>
