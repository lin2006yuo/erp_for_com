<template>
    <div class="c-select-query" v-cstyle.offsettop.offsetleft.width="style">
        <el-input v-model="input" @keyup.native="keyup" @focus="focus" @blur="blur"></el-input>
        <ul v-if="show" :style="style">
            <li v-for="filter in filters" @click="select(filter)">{{filter.label}}</li>
        </ul>
    </div>
</template>
<style lang="stylus">
    .c-select-query{
        position: relative;
        ul{
            display: block;
            position: fixed;
            overflow: auto;
            max-height: 120px;
            z-index: 100;
            background: white;
            border:1px solid #DEE4EB;
        }
        li{
            font-size:1.2rem;
            line-height:24px;
            height:24px;
            padding:2px 2px  2px 5px;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            cursor: pointer;
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                show:false,
                input:0,
                timer:false,
                style:{}
            }
        },
        mounted(){
            this.input = this.get_label(this.value);
        },
        updated(){
            console.log(`update`);
        },
        props:{
            lists:{
                required:true,
                type:Array
            },
            query:{
                type:Function,
                default:function(data,val){
                    return data.label.indexOf(val) >= 0;
                }

            },
            value:{}
        },
        methods:{
            get_label(value){
                let f = this.lists.find(v=>v.value === value);
                if(f){
                    return f.label;
                }else{
                    return ''
                }
            },
            select(filter){
                this.$emit('input', filter.value);
                this.input = filter.label;
                this.show = false;
            },
            keyup(){
                console.log("3333")
                this.show = true;
            },
            focus(){
                console.log("222")
                this.timer && clearTimeout(this.timer);
                this.show = true;
            },
            blur(){
                console.log("pdd-order")
                this.timer = setTimeout(()=>{
                    this.show = false;
                console.log(`value:${this.value},input:${this.input}`)
                if(this.input != '' && this.value !== undefined && this.filters.length > 0){
                    this.select(this.filters[0]);
                }
                this.timer = false;
                },350);
            }
        },

        watch:{
            value(val, old){
                this.input = this.get_label(val);
            }
        },

        computed:{
            filters(){
                return this.lists.filter((data)=>{
                    return this.query(data, this.input);
                })
            }
        },
        components:{

        }
    }
</script>
