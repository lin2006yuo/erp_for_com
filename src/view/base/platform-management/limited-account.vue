<template>
    <div class="p-limited-account">
<!--        导航栏-->
        <div class="ml-sm mb-sm">
            <el-radio-group    size="small"
                               fill="#20a0ff"
                               text-color="#ffffff"
                               v-model="selectLabel"
                               @change="characterSelect">
                <el-radio-button    v-for="item in selectLinks"
                                    :key="item.label"
                                    :label="item.label">
                </el-radio-button>
            </el-radio-group>
        </div>
<!--        账号列表-->
        <div class="mt-mini scroll" style="height:287px">
            <el-button  v-for="item in accountList"
                        :key="item.value"
                        v-show="item.show"
                        class="mr-mini mt-mini"
                        style="margin-left: 0"
                        size="mini"
                        :type="item.type"
                        @click="account_select(item)">
                {{item.label}}
            </el-button>
        </div>
<!--        已选账号列表-->
        <div class="mt-sm mb-xs">
            已选择的账号：
            <div class="scroll mt-mini" v-if="selectedOptions.length>0" key="selectedOptions" style="height:174px">
                <el-button  v-for="item in selectedOptions"
                            class="mr-mini mt-mini"
                            v-show="item.show"
                            style="margin-left: 0"
                            :key="item.label"
                            size="mini"
                            type="primary"
                            @click="account_cancel(item)">
                    {{item.label}}
                </el-button>
            </div>
            <div v-else class="mt-lg" style="text-align: center" key="emptyTip">
                <span>暂未选择</span>
            </div>
        </div>
    </div>

</template>

<script>
    export default{
        mounted(){
            this.account_watcher(this.accountOptions);
            this.selected_watcher();
        },
        data(){
            return{
                selectLabel:[],
                selectedOptions:this.get_select(),
                accountList:this.accountOptions,
                selectLinks:[
                    {label:'全部',value:0},
                    {label:'A',value:1},
                    {label:'B',value:2},
                    {label:'C',value:3},
                    {label:'D',value:4},
                    {label:'E',value:5},
                    {label:'F',value:6},
                    {label:'G',value:7},
                    {label:'H',value:8},
                    {label:'I',value:9},
                    {label:'J',value:10},
                    {label:'K',value:11},
                    {label:'L',value:12},
                    {label:'M',value:13},
                    {label:'N',value:14},
                    {label:'O',value:15},
                    {label:'P',value:16},
                    {label:'Q',value:17},
                    {label:'R',value:18},
                    {label:'S',value:19},
                    {label:'T',value:20},
                    {label:'U',value:21},
                    {label:'V',value:22},
                    {label:'W',value:23},
                    {label:'X',value:24},
                    {label:'Y',value:25},
                    {label:'Z',value:26},
                ],
            }
        },
        methods:{
            account_select(item) {
                console.log("按钮被点击:",item);
                //若已选账号列表为空，直接添加
                if(this.selectedOptions.length===0)
                {
                    item.type='primary';
                    this.selectedOptions.push(item);
                }
                else {
                        // debugger;
                        //若已选账号列表不为空,判断当前账号是否存在
                        let find=this.selectedOptions.find(account=>{
                            return account.value===item.value;
                        })
                        //若不存在，添加
                        if(!find) {
                            item.type = 'primary';
                            this.selectedOptions.push(item);
                        }
                        //若存在，删去
                        else
                        {
                            item.type = 'default';
                            let index=this.selectedOptions.indexOf(find);
                            this.selectedOptions.splice(index, 1);
                        }
                        this.emit_account();
                }
            },
            account_cancel(item){
                console.log("按钮被取消:",item);
                this.selectedOptions.splice(this.selectedOptions.indexOf(item),1);
                let find=this.accountList.find(account=>{
                    return item.value===account.value;
                })
                if(find){find.type='default'};
                this.emit_account();
            },
            characterSelect(val){
                console.log("根据字母筛选:",val);
                if(val==="全部")
                {
                    this.accountList.forEach(item=>{
                        item.show=true;
                    })
                    this.selectedOptions.forEach(item=>{
                        item.show=true;
                    })
                }
                else
                {
                    this.accountList.forEach(item=>{
                        this.character_filter(item,val);
                    })
                    this.selectedOptions.forEach(item=>{
                        this.character_filter(item,val);
                    })
                }
            },
            //根据字母筛选账号
            character_filter(item,val){
                if(new RegExp(`^[${val}${val.toLowerCase()}]`).test(item.label))
                {
                    item.show=true;
                }
                else
                {
                    item.show=false;
                }
            },
            select_all(val){
                console.log("全选：",val);
                if(val)
                {
                    this.selectedOptions=[];
                    this.accountList.forEach(item=>{
                        item.type='primary';
                        this.selectedOptions.push(item);
                    })
                }
                else
                {
                    this.accountList.forEach(item=>{
                        item.type='default';
                        this.selectedOptions=[];
                    })
                }
                this.emit_account();
            },
            get_select(){
                let list = [];
                this.selectedAccount.forEach(id => {
                    let find = this.accountOptions.find(account => {
                        return account.value === id;
                    });
                    if (find) {
                        list.push(find);
                    }
                })
                return list;
            },
            update_selected(){
                this.selectedOptions.forEach(selectedAccount=>{
                   let find = this.accountList.find(item=>{
                       return item.value===selectedAccount.value;
                   })
                    if(find){find.type='primary'}
                })
            },
            //根据站点筛选账号
            //由父组件调用
            //(data<Array>):选中站点下的账号数据(value)
            handle_site_change(siteChecked,data){
                console.log("根据站点筛选账号",siteChecked);
                //站点被选中
                if(siteChecked)
                {   //判断站点下的账号是否已被选中
                    data.forEach(val=>{
                        let find=this.selectedOptions.find(item=>{
                            return item.value===val;
                        })
                        //若未被选中，将对应的账号选中
                        if(!find)
                        {
                             let account=this.accountList.find(item=>{
                                 return item.value===val;
                             })
                            if(account)
                            {
                                account.type='primary';
                                this.selectedOptions.push(account)
                            }
                        }
                    })
                }
                //站点被取消
                else
                {
                    data.forEach(val=>{
                        //取消已选账号列表中的对应账号
                        let index=this.selectedOptions.findIndex(item=>{
                            return item.value===val;
                        })
                        if(index>=0){this.selectedOptions.splice(index,1)};
                        //取消账号列表中的对应账号
                        let find=this.accountList.find(item=>{
                            return item.value===val;
                        })
                        if(find){find.type='default'}
                    })
                }
                this.emit_account();
            },
            //模糊搜索
            //由父组件调用
            //(val<Array>):搜索关键词数组
            search(val){
                if(val){
                    this.accountList.forEach(account=>{
                        account.show=false;
                    })
                    val.forEach(key=>{
                        console.log("搜索关键词:",key);
                        this.accountList.forEach(account=>{
                            // if(account.label.includes(key)){account.show=true;}
                            if(account.label===key){account.show=true;}
                        })
                    })
                }
                else{
                    this.accountList.forEach(item=>{
                        item.show=true;
                    })
                }
            },
            //导入excel数据
            //由父组件调用
            //(data<Array>:账号id数组)
            import_excel(data){
                data.forEach(id=>{
                    let find=this.selectedOptions.find(item=>{
                        return item.value===id;
                    })
                    //若未被选中，将对应的账号选中
                    if(!find)
                    {
                        let account=this.accountList.find(item=>{
                            return item.value===id;
                        })
                        if(account)
                        {
                            account.type='primary';
                            this.selectedOptions.push(account)
                        }
                    }
                });
                this.emit_account();
            },
            //更新父组件受限账号列表
            emit_account(){
                console.log("开始更新父组件数据")
                let list=this.selectedOptions.map(item=>{
                    return item.value;
                })
                this.$emit("update:selectedAccount",list);
                console.log("更新父组件数据:",list);
            },
            //同步接口返回的已选账号数据
            selected_watcher(){
                console.log("已选账号列表:",this.selectedAccount);
                let list = [];
                this.selectedAccount.forEach(id => {
                    //同步账号列表，对应的账号选中
                    let account=this.accountList.find(item=>{
                        return item.value===id;
                    })
                    if(account){
                        account.type='primary';
                    }
                    //同步已选账号列表，对应的账号选中
                    let selectedAccount = this.accountOptions.find(account => {
                        return account.value === id;
                    });
                    if (selectedAccount) {
                        list.push(selectedAccount);
                    }
                })
                this.selectedOptions = list;
            },
            account_watcher(val){
                this.accountList=clone(val);
                console.log("账号列表改变:",this.accountList);
                //账号列表加载完成后，异步将已选账号列表同步到账号列表
                setTimeout(this.update_selected,10);
            }
        },
        props:{
            accountOptions:{    //当前账号列表
                type:Array
            },
            checkAll:{      //账号全选开关
                type:Boolean
            },
            selectedAccount:{   //已选账号列表
                type:Array
            }
        },
        watch:{
            selectedAccount:{
                 handler:this.selected_watcher
            },
            accountOptions:{
                handler:this.account_watcher
            },
            checkAll(val){
                this.select_all(val);
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .scroll
        overflow-y scroll
        overflow-x hidden
</style>
