<template>
    <page-dialog  title="快速核查订单" v-model="dialog"
                  @open="open"
                  size="large" :close-on-click-modal="false">
        <h3>此功能可以快速核查出ERP中没有拉取到的平台订单数据</h3>
        <el-row class="relative">
            <el-col :span="10">
                <h4>输入待核查的平台订单（使用 空格 区分订单）</h4>
                <el-input v-model='pendingOrder'
                          placeholder="使用'enter'键可触发核查"
                          type="textarea" @keydown.native="keydown"
                          :autosize="{ minRows: 30, maxRows: 35}"></el-input>
            </el-col>
            <el-col :span="4" class='absolute-btn'>
                <request-button :reqKey="comReqKey" @click="verification">开始核查</request-button>
            </el-col>
            <el-col :span="10" class="fr">
                <h4>未查到的平台订单（{{notFoundLength}}）</h4>
                <el-input v-model="notFoundOrder" type="textarea" ref="notFoundOrder"
                          :autosize="{ minRows: 30, maxRows: 35}"></el-input>
            </el-col>
        </el-row>
        <el-input v-model="existOrder" type="textarea" ref="existOrder"
                  style="z-index: 0;position: absolute ;top: -999px;left: -999px;"
                  :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        <div slot="footer">
            <el-button type="primary" size="mini" class="inline" @click.native="copy_order('exist')">复制已找到的订单</el-button>
            <el-button type="primary" size="mini" class="inline" @click.native="copy_order('notFound')">复制未找到的订单</el-button>
            <el-button size="mini" class="inline" @click.native="dialog=false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .absolute-btn{
        position:absolute;
        top:50%;
        left:46%
    }
</style>
<script>
    import {api_ymx_exists,api_ebay_exists,api_joom_exists,api_paytm_exists,api_wish_exists,api_alazada_exists,
        api_shopee_exists,api_walmart_exists,api_pandao_exists,api_aliexpress_exists} from '@/api/verification-api';
    export default {
        data() {
            return {
                pendingOrder:'',
                notFoundOrder:'',
                existOrder:'',
                dialog:this.value,

            }
        },
        methods:{
            open(){
                this.pendingOrder = '';
                this.notFoundOrder = '';
                this.existOrder = '';
            },
            keydown(event){
                if(event.keyCode===13){
                    if(!this.pendingOrder)return this.$message({type:"warning",message:"请输入需要查询的订单"});
                    this.$reqKey(this.comReqKey,true);
                    this.verification();
                }
            },
            async verification(){
                this.notFoundOrder = '';
                this.existOrder = '';
                let url = this.get_url();
                if(this.curPlatform==='Ebay'){
                    let list = this.splice_params(100);
                    await list.forEach(async(item,index)=>{
                        let params = this.get_params(item);
                        let res = await this.$http(url,params);
                        this.notFoundOrder += this.notFoundOrder&&this.get_data(res,'notFound')?'\n'+this.get_data(res,'notFound'):this.get_data(res,'notFound');
                        this.existOrder += this.existOrder&&this.get_data(res,'exist')?'\n'+this.get_data(res,'exist'):this.get_data(res,'exist');
                        if(index===list.length-1){
                            this.$message({type:'success',message:`核查已完成！`});
                            this.$reqKey(this.comReqKey,false)
                        }
                    });
                }else{
                    let list = this.splice_params(500);
                    list.forEach((item,index)=>{
                        let params = this.get_params(item);
                        this.$http(url,params).then(res => {
                            this.notFoundOrder += this.notFoundOrder&&this.get_data(res,'notFound')?'\n'+this.get_data(res,'notFound'):this.get_data(res,'notFound');
                            this.existOrder += this.existOrder&&this.get_data(res,'exist')?'\n'+this.get_data(res,'exist'):this.get_data(res,'exist');
                            if(index===list.length-1){
                                this.$message({type:'success',message:`核查已完成！`});
                            }
                        }).catch(code => {
                            this.$message({type:'error',message:code.message||code});
                        }).finally(()=>{
                            if(index===list.length-1){
                                this.$reqKey(this.comReqKey,false)
                            }
                        })
                    });
                }
            },
            copy_order(name){
                switch (name){
                    case 'exist':
                        this.copy_process('existOrder');
                        break;
                    case 'notFound':
                        this.copy_process('notFoundOrder');
                        break;
                }
            },
            copy_process(target){
                if(!!this[target]){
                    this.$refs[target].$refs.textarea.select();
                    document.execCommand("Copy");
                    this.$message({type:"success",message:"复制成功"});
                }else {
                    let input=document.createElement("input");
                    let body=document.getElementsByTagName("body")[0];
                    input.type= 'text';
                    input.value=' ';
                    body.appendChild(input);
                    input.select();
                    document.execCommand("Copy",'false',null);
                    this.$message({type:"warning",message:"当前数据为空"});
                }
            },
            get_pendingOrder(){
                let pendingOrder = this.pendingOrder.replace(new RegExp(' ', 'gm'), '\n');
                let list = pendingOrder.split('\n').filter(row=>!!row).map(row=>row.trim());
                return list
            },
            splice_params(size){
                let list = this.get_pendingOrder();
                let result = [];
                for(let i =0;i<Math.ceil(list.length/size);i++){
                    let start = i*size;
                    let end = start+size;
                    result.push(list.slice(start,end));
                }
                return result;
            },
            get_url(){
                let url = '';
                switch(this.curPlatform){
                    case 'Ebay':
                        url = api_ebay_exists;
                        break;
                    case 'Amazon':
                        url = api_ymx_exists;
                        break;
                    case 'Joom':
                        url = api_joom_exists;
                        break;
                    case 'Walmart':
                        url = api_walmart_exists;
                        break;
                    case 'Mymall':
                        url = api_pandao_exists;
                        break;
                    case 'Paytm':
                        url = api_paytm_exists;
                        break;
                    case 'Wish':
                        url = api_wish_exists;
                        break;
                    case 'Aliexpress':
                        url = api_aliexpress_exists;
                        break;
                    case 'Lazada':
                        url = api_alazada_exists;
                        break;
                    case 'Shopee':
                        url = api_shopee_exists;
                        break;
                }
                return url;
            },
            get_params(item){
                let params = {};
                let curItem = JSON.stringify(item);
                if(this.curPlatform==='Joom'||this.curPlatform==='Walmart'||this.curPlatform==='Mymall'||this.curPlatform==='Paytm'){
                    params = {checkId:curItem}
                }else if(this.curPlatform==='Wish'){
                    params = {data:curItem}
                }else if(this.curPlatform==='Shopee'){
                    params = { order_sn:curItem}
                }else{
                    params = { orders:curItem}
                }
                console.log(params,'params');
                return params;
            },
            get_data(res,name){
                let channel = this.curPlatform;
                if(channel==='Amazon'||channel==='Ebay'){
                    if(name==='notFound'){
                        return res.data.notExists.join('\n');
                    }else{
                        return res.data.exists.join('\n');
                    }
                }else if(channel==='Joom'||channel==='Walmart'||channel==='Mymall'||channel==='Paytm'){
                    if(name==='notFound'){
                        return res.noOrder.join('\n');
                    }else{
                        return res.inOrder.join('\n');
                    }
                }else if(channel==='Wish'){
                    if(name==='notFound'){
                        return res.not_existent.join('\n');
                    }else{
                        return res.existent.join('\n');
                    }
                }else if(channel==='Aliexpress'||channel==='Lazada'){
                    if(name==='notFound'){
                        return res.data.notExists.join('\n');
                    }else{
                        return res.data.exists.join('\n');
                    }
                }else if(channel==='Shopee'){
                    if(name==='notFound'){
                        return res.none.join('\n');
                    }else{
                        return res.has.join('\n');
                    }
                }
            },
        },
        computed:{
            notFoundLength(){
                return this.notFoundOrder.split('\n').filter(row=>!!row).length;
            },
            comReqKey(){
                return `${this.curPlatform}verificationKey`
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            value:{
                type:Boolean,
                required:true
            },
            curPlatform:{
                type:String,
                required:true
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
