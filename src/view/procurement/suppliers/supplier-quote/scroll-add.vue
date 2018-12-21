<template>
    <div class="scroll-select">
        <div class="input">
            <input  class="inputValue"
                    ref="input"
                   @focus="focus"
                   @blur="blur"
                   :style="{textAlign}"
                   :placeholder="placeholder"
                   :title="inputValue"
                   v-model="inputValue"
                   @input="input"
                   :disabled="disable">
            <i v-show="loading" class="el-icon-loading" style="right:30px;"></i>
            <i v-show="!show" class="active el-icon-arrow-down" style="right:0;" @click="()=>{$refs.input.focus()}"></i>
            <i v-show="show" class="active el-icon-arrow-right" style="right:0;" @click="show=false;"></i>
        </div>
        <transition name="md-fade-bottom" tag="li">
            <div class="body" v-show="show" :style="styleUlOn" ref="body">
                <transition-group name="md-fade-bottom" tag="ul">
                    <li class="li-data"
                        :style="{textAlign}"
                        v-for="(option,index) in options"
                        :key="option.label"
                        @click="choose(option,index)">
                        {{option.label}}
                    </li>
                </transition-group>
                <div style="text-align: center;color:#4646ff;cursor:pointer" @click="download_add">点击加载更多</div>
                <div key="count  > (maxPage * size)" v-if="count  > (maxPage * size)"
                     style="color:#998220; text-align: center" class="other-class">
                    数据太多，请输入关键字
                </div>
                <div style="font-weight:bold;text-align:center" class="other-class" key="count > size" v-else-if="count > size">
                    <span>{{count}} （{{page}}/{{pageCount}}）</span>
                </div>
                <div v-if="loading" style="text-align:center">
                    正在加载数据
                    <i class="el-icon-loading ml-sm"></i>
                </div>
                <div    key="count<=0 && (!loading)" v-if="count<=0 && (!loading)" :style="{textAlign}" class="warning-not-data  other-class">没有数据</div>
            </div>
        </transition>
    </div>
</template>
<style lang="stylus">
    .scroll-select{
        .other-class{
            background: #ffffff;
            font-size: 1.2rem;
            height: 26px;
            padding:2px 3px ;
        }
        *{
            box-sizing: border-box;
        }
        height:26px;

        /*border:1px solid #1a1c2c;*/
        position: relative;
        .input{
            height:100%;
            width:100%;
            position: relative;
            border-color: #8492a6;
            border-radius: 4px;
            input{
                box-sizing: border-box;
                outline: none;
                color: #1F2D3D;
                margin:0;
                width:100%;
                height:100%;
                display: block;
                float: left;
                padding:4px 26px 4px  5px;
                border:1px solid #C0CCDA;
                border-radius:4px;
                font-size: 1.2rem;
                line-height: 26px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            i{
                display: block;
                position: absolute;
                top:0;
                width:26px;
                height:26px;
                text-align:center;
                line-height:26px;
            }
        }
        .body{
            position: absolute;
            width:100%;
            top:30px;
            left:-1px;
            overflow-y: auto;
            border:1px solid #C0CCDA;
            background:#fff;
            padding:5px 0;
            z-index:999999;
            ul{
                li{
                    height: 26px;
                    line-height:26px;
                    font-size: 1.2rem;
                    overflow: hidden;
                    padding:0 10px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    background-color: #ffffff;
                    cursor: pointer;
                    &.li-data:active{
                        background-color: #008BCE;
                    }
                    &.li-data:hover{
                        background: #e5e9f2;
                    }
                }
                .warning-not-data{
                    color: #f00;
                }
            }
        }

    }
</style>
<script>
    import http from '../../../../lib/http';
    export default{
        data(){
            return{
                show:false,
                loading:false,
                options:[],
                val:this.value,
                inputValue:'',
                page:1,
                pageSize:this.size,
                count:0,
            }
        },
        mounted(){
            this.refresh_remote();

        },
        methods:{
            refresh_remote(){
                this.loading = true;
                if(this.disable){
                    return
                }
                return this.$http(http('GET', this.remote, this.fixParams({page:this.page,pageSize:this.pageSize,keyword:this.inputValue,value:this.value || ''}))).then(res=>{
                    res = this.fixResult(res);
                    this.count = res.count;
                    res.options.forEach(row=>{
                        this.options.push(row);
                    });
                    this.loading = false;
                    return Promise.resolve();
                }).catch(code=>{
                    this.loading = false;
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                    return Promise.reject();
                });
            },
             download_add(){

                this.downpage();


             },
            scroll(event){
                clearTimeout(this.scrollTimer);
                this.scrollTimer = setTimeout(() =>{
                    let target = event.target;
                    if(target.scrollTop <= 0){
                        this.upWait = true;
                        this.downWait = false;
                        return;
                    }
                    if((target.scrollHeight - target.scrollTop) === target.clientHeight) {
                        this.upWait = false;
                        this.downWait = true;
                        return;
                    }
                    this.upWait = false;
                    this.downWait = false;
//                    console.log(`${target.scrollHeight - target.scrollTop} ${target.clientHeight}`)
                },300);
            },
            mousewheel(event){
                clearTimeout(this.wheelTimer);
                this.wheelTimer = setTimeout(()=>{
                    if(this.upWait && event.deltaY < 0){
                        this.uppage();
                        return;
                    }
                    if(this.downWait && event.deltaY > 0){
                        this.downpage();
                        return;
                    }
                },200);
            },
            DOMMouseScroll(event){
                clearTimeout(this.wheelTimer);
                this.wheelTimer = setTimeout(()=>{
                    if(this.upWait && event.detail < 0){
                        this.uppage();
                        return;
                    }
                    if(this.downWait && event.detail > 0){
                        this.downpage();
                        return;
                    }
                },200);
            },
            uppage(){
                clearTimeout(this.upTimer);
                this.upTimer = setTimeout(()=>{
                    if((this.page - 1) > 0){
                        this.page = this.page - 1;
                        this.refresh_remote();
                    }
                },300);
            },
            downpage(){
                clearTimeout(this.downTimer);
                this.downTimer = setTimeout(()=>{
                    this.page = this.page + 1;
                    if(this.page <= Math.ceil(this.count / this.pageSize)){
                        this.refresh_remote();
                    }
                },300);

            },
            choose(opt,index){
                this.val = opt.value;
                this.inputValue = opt.label;
                this.show = false;
                this.$emit("choose",opt,index);
            },
            input({target:{value}}){
                clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    this.page = 1;
                    this.refresh_remote().then(()=>{
                        this.$nextTick(()=>{
                            let find = this.options.find(row=>row.label === value);
                            if(find){
                                this.val = find.label;
                                this.$emit("choose",find);
                            }
                        })
                    });
                },300);
            },
            focus(){
                this.show = true;
            },
            blur(){
                if(this.show){
                    clearTimeout(this.showTimer);
                    this.showTimer = setTimeout(()=>{
                        //this.show= false;
                        if(this.inputValue != '' && this.val === undefined && this.options.length > 0){
                            this.choose(this.options[0], 0);
                        }
                    },200);
                }


            }
        },
        computed:{
            styleUlOn(){
                return Object.assign(this.styleUl, {maxHeight:`${26 * (this.size-4)}px`})
            },
            pageCount(){
                return Math.ceil(this.count / this.pageSize);
            }
        },
        watch:{
            val(val){
                this.$emit('input', val);
            },
            value(val){
                this.val = val;
                let find = this.options.find(row=>row.value === val);
                if(find){
                    this.inputValue = find.label;
                }else{
                    this.inputValue = "";
                }
            },
            inputValue(){
                this.page = 1;
            },
            disable(val){
                if(!val){
                    this.refresh_remote();
                }
            },
        },
        props:{
            placeholder:{
                default(){
                    return "请输入/选择...";
                }
            },
            disable:{
            default(){
                    return  false;
                }
            },
            value:{},
            maxPage:{
                default(){
                    return 300;
                }
            },
            size:{
                default(){
                    return 10;
                }
            },
            textAlign:{
                default(){
                    return 'center';
                }
            },
            styleUl:{
                type:Object,
                default(){
                    return {};
                }
            },
            remote:{
                required:true,
                type:String
            },
            fixParams:{
                type:Function,
                default(params){
                    return params;
                }

            },
            fixResult:{
                type:Function,
                default(res){
                    return {
                        options: res.data.map(row => {
                            return {
                                label: row.company_name || row.realname,
                                value: row.id
                            }
                        }),
                        page: res.page,
                        count: res.count,
                    }
                }
            }
        },
        components:{

        }
    }
</script>
