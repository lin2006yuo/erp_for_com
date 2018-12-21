<template>
    <div class="p-el-groups">
        <el-input v-model="label" @focus="focus"   @blur="blurs" :style="styles" ref="input"  placeholder="请选择" ></el-input>
        <i :class="[show?'el-icon-caret-top':'el-icon-caret-bottom','icons']" @click="show_select"></i>
        <ul v-if="show&&option.length!==0" class="groups" ref="groups" :style="styles">
            <li v-for="(item,index) in filterOptions" :key="item.value">
                <p @click="tips(item)" v-if="parentClick" :class="['parent',item.highlight?'highlight':'']">{{item.label}}</p>
                <p @click="tips(item)" v-else :class="[item.children?'disable':'','parent',item.highlight?'highlight':'']">{{item.label}}</p>
                <ul v-if="item.children" class="child">
                    <li v-for="(child,i) in item.children" :key="child.value" @click="tips(child)" :class="[child.highlight?'highlight':'']"><span>{{child.label}}</span></li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<style lang="stylus">
    .p-el-groups{
        .icons{
            position: absolute;
            right:0;
            top: 50%;
            padding: 9px ;
            color: #C0CCDA;
            font-size: 12px;
            line-height: 16px;
            cursor: pointer;
            transform: translateY(-50%) rotateZ(-180deg);
            &:before{
                content: "\E607";
            }
            &:after{
                content: '';
                height: 100%;
                width: 0;
                display: inline-block;
                vertical-align: middle;
            }
        }
        .el-icon-caret-top{
            transform: translateY(-50%) rotateZ(0deg);
            transition: transform .3s;
        }
        .el-icon-caret-bottom{
            transform: translateY(-50%) rotateZ(-180deg);
            transition: transform .3s;
        }
        display: inline-block;
        .labels{
            line-height: 26px;
        }
        p{
            margin: 0;
        }
        position: relative;
        .groups{
            padding: 0 3px;
            z-index: 999;
            background: white;
            height: 200px;
            overflow-y: auto;
            position: absolute;
            top:26px;
            left: 0;
            border:1px solid #bfcbd9;
            animation:moves .3s linear;
            .parent{
                padding-left: 5px;
                /*color: #324057;*/
                color:#20A0FF ;
                line-height: 26px;
                &:hover{
                    background: #99A9BF;
                    cursor: pointer;
                }
            }
            .highlight{
                background: #20A0FF;
                color:#fff;
            }
            .disable{
                color:#E5E9F2 ;
                background: white!important;
            }
            .child{
                &>li:hover{
                    background: #e5e9f2;
                    cursor: pointer;
                }
                >li{
                    line-height: 26px;
                    >span{
                        margin-left: 20px;
                    }
                }
                color: #324057;
            }
        }
    }
    @keyframes moves {
        from {height: 0;}
        to {
            height:200px;}
    }
</style>
<script>
    export default{
        data(){
            return {
                id:0,
                show:false,
                query:""
            }
        },
        created(){
        },
        mounted(){
        },
        computed: {
            styles(){
                return {width:(this.width+"px")}
            },
            filterOptions(){
                let arr=[];
                if(!this.query){
                    return this.option
                }
                this.option.forEach(row=>{
                    if(!this.parentClick){
                        if(!!row.children&&!!row.children.length){
                            let child=[];
                            row.children.forEach(item=>{
                                item.label.indexOf(this.query)>-1&&child.push(Object.assign({},item))
                            });
                            child.length&&arr.push({label:row.label,value:row.value,children:child})
                        }else {
                            row.label.indexOf(this.query)>-1&&arr.push({label:row.label,value:row.value})
                        }
                    }else {
                        let child=[];
                        row.children&&row.children.forEach(item=>{
                            item.label.indexOf(this.query)>-1&&child.push(Object.assign({},item))
                        });
                        if(row.label.indexOf(this.query)>-1){
                            let obj={label:row.label,value:row.value};
                            if(child.length){obj.children=child}
                            arr.push(obj)
                        }else {
                            child.length&&arr.push({label:row.label,value:row.value,children:child})
                        }
                    }
                });
                return arr

            },
            label:{
                get(){
                    this.option.forEach(row=>{
                        this.$set(row,"highlight",false);
                        if(!!row.children){
                            row.children.forEach(item=>{
                                this.$set(item,"highlight",false)
                            })
                        }
                    });
                    try {
                        this.option.forEach(row=>{
                            if(row.value===this.value){
                                row.highlight=true;
                                throw {parant:row,isParent:true}
                            }
                            if(!!row.children&&row.children.length){
                                let find=row.children.find(item=>item.value===this.value);
                                if(!!find){
                                    find.highlight=true;
                                    throw {parant:row,isParent:false,find}
                                }
                            }
                        })
                        //没有找到
                            return ''
                    }catch (e) {
                        return e.isParent?e.parant.label:`${e.parant.label}>>${e.find.label}`
                    }
                },
                set(val){
                    this.query=val;
                    if(!val){this.id= ''}
                },
            }
        },
        methods: {
            blurs(ev){
                if(ev.target.value===''){
                    this.id= '';
                }
                if(this.filterOptions.length&&this.query){
                    let current=this.filterOptions[0]
                    if(this.parentClick){
                        if(current.label.indexOf(this.query)>-1){
                            this.id=current.value
                        }else {
                            this.id=current.children[0].value
                        }
                    }else {
                        this.id=current.children[0].value
                    }
                    this.$forceUpdate();
                }else {
                    this.query=''
                    this.id='';
                }
                //下拉框关闭
                setTimeout(()=>{
                    this.show=false;
                },300);
            },
            focus(){
                this.show=true;
                this.$refs.input.inputSelect()
            },
            show_select(){
                this.show=!this.show;
            },
            tips(item){
                if(!this.parentClick){  //父级 是否能点击
                    if(item.children){
                        return ;
                    }
                }
                this.show=false;
                this.id=item.value;
                //this.query='';
            },

        },
        filters: {},
        watch: {
            value(val){
                this.id=val
            },
            id(val){
                this.$emit("input",val)
            }
        },
        props: {
            value:{

            },
            option:{
                required:true,
                type:Array
            },
            width:{
                type:String,
                default:"200"
            },
            parentClick:{ //父选项能否勾选
                default(){
                    return false;
                }
            }
        },
        components: {}
    }
</script>
