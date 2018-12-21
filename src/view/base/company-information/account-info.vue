<template>
    <el-form ref="accountInfo"
             :model="form"
             label-width="100px"
             class="c-account-info">
        <el-form-item label="收款账号："
                      prop="collection_account">
            <div v-if="!flag||(flag===2&&edit)">
                <div v-for="(item,index) in tempAccounts"
                     :key="index">
                    <el-input v-model="item.label"
                              class="inline width-super"></el-input>
                    <el-button size="mini"
                               type="primary"
                               v-if="index===0"
                               @click.active="add_account(index)">新增
                    </el-button>
                    <el-button size="mini"
                               type="danger"
                               v-else
                               @click.active="del_account(index)">删除
                    </el-button>
                </div>
            </div>
            <span v-if="flag===1">{{form.collection_account}}</span>
            <span v-if="flag===2&&!edit">{{accountList(form.collection_account)}}</span>
        </el-form-item>
        <el-form-item label="信用卡："
                      prop="credit_card">
            <el-input v-model="form.credit_card"
                      v-if="!flag||(flag===2&&edit)"></el-input>
            <span v-else>{{form.credit_card}}</span>
        </el-form-item>
        <el-form-item label="" v-if="flag!==1">
            <el-button size="mini"
                       v-if="!flag||(flag===2&&edit)"
                       :disabled="disabled"
                       @click.native="submit"
                       type="primary">确 定
            </el-button>
            <el-button size="mini"
                       v-if="!flag||(flag===2&&edit)"
                       @click.native="restore">取 消
            </el-button>
            <el-button size="mini"
                       v-if="(flag===2&&!edit)"
                       @click.native="edit=true"
                       type="primary">编 辑
            </el-button>
        </el-form-item>
    </el-form>
</template>

<style lang="stylus" scoped>

</style>

<script>
    export default {
        name: "account-info",
        data(){
            return{
                disabled:false,
                edit:true,
                tempAccounts:this.accounts
            }
        },
        methods: {
            add_account(index){
                this.tempAccounts.push({label:''});
            },
            del_account(index){
                this.tempAccounts.splice(index,1);
            },
            accountList(account){
                if(!account||!account.length)return'';
                return account.join(',')
            },
            submit(){
                this.disabled=true;
                let account=this.tempAccounts.map(row=>row.label);
                this.$set(this.form,'collection_account',account);
                this.$emit('account');
                this.disabled=false;
                this.edit=false;
            },
            restore(){
                if(!this.flag){
                    this.tempAccounts=[{label:''}];
                    this.$set(this.form,'credit_card','');
                }else {
                    this.$set(this.form,'credit_card',this.originalForm.credit_card);
                    this.tempAccounts=[];
                    let arr=[{label:''}];
                    if(this.originalForm.collection_account&&this.originalForm.collection_account.length){
                        arr=[];
                        arr= this.originalForm.collection_account.map(row=>{return {label:row}});
                    }
                    this.$set(this,'tempAccounts',arr);
                }
            }
        },
        props: {
            form:{},
            flag:{},
            accounts:{
                type:Array
            },
            originalForm:{}
        },
    }
</script>

