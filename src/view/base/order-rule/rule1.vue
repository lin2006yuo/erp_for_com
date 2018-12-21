<template>
    <span :class="!!$slots.default?'':'rule1'">
        <b :class="$slots.default?'rule1-parent' : ''" :title="form.title">
              <i v-if="$slots.default" :class="[showssss?'el-icon-caret-bottom':'el-icon-caret-right']"     @click="defaultshows"></i>
            <input
                    v-model="input"
                    name="Fruit" type="checkbox" />
            <span>{{form.title}}</span>
            <template v-if="election">
                <input v-model="form.election" type="checkbox">
            <span>{{election}}</span>
            </template>
        </b>
        <el-select class="inline " v-if="condition.length > 1" v-model="operator.sel">
            <el-option v-for="item in condition" :key="item_value(item)" :label="item_label(item)" :value="item_value(item)"></el-option>
        </el-select>
        <span v-if="condition.length === 1">
            {{item_label(condition[0])}}
        </span>
            <div v-show="showssss">
                <slot></slot>
            </div>
        <span class="rule-unit" v-if="form.unit">{{form.unit}}</span>
        <span class="rule-desc" v-if="form.desc">{{form.desc}}</span>
    </span>
</template>
<style lang="stylus">
    .rule1-parent{
        font-weight: 300;
        width: 100%;
        font-size:16px;
        display: inline-block;
        border-top:2px solid #4e92ce;
    }
    .rule1-child{
        padding:15px;
    }
    .rule1{
        width:50%;
        display: inline-block;
        b{
            font-weight: 300;
            display: inline-block;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
    }
    .rule1 + .rule1{
        width:50%;
        display: inline-block;
        b{
            font-weight: 300;
            display: inline-block;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
    }
    .rule-check{
        padding: 0;
        margin: 0;
        line-height: 26px;
        vertical-align: middle;
        background: #fff;
    }
</style>
<script>

    export default{
        data(){
            return{
                input:this.value,
                showssss:true,
                rule1:true
            }
        },
        mounted(){
            this.$parent.$forceUpdate();
        },
        methods:{
            item_label(item){
                return Object.values(item)[0];
            },
            item_value(item){
                return Object.keys(item)[0];
            },
            defaultshows(){
                console.log("this.input",this.input)
              this.showssss=!this.showssss
            },
//            select_sel(val){
//                console.log(val);
//                this.input = true;
//            }
        },
        computed:{
            condition(){
                if(typeof this.form.condition === 'array'){
                    return this.form.condition;
                }else{
                    return objToArray(this.form.condition, (val,key) =>{
                        let obj = {};
                        obj[key] = val;
                        return obj;
                    });
                }
            }
        },
        watch:{
            input(val){
                this.$emit('input',val);
            },
            value(val){
                this.input = val;
            }
        },
        props:{
            form:{},
            value:{},
            operator:{},
            election:{}
        },
        components:{

        }
    }
</script>
