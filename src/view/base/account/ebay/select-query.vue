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
            overflow-x: hidden!important;
            max-height: 120px;
            z-index: 100;
            background: white;
        }
        li{
            font-size:1.2rem;
            line-height:24px;
            height:24px;
            padding-left:5px;
            width: 100%;
            overflow-x: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
                this.show = true;
            },
            focus(){
                this.timer && clearTimeout(this.timer);
                this.show = true;
            },
            blur(){
                this.timer = setTimeout(()=>{
                   this.show = false;
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