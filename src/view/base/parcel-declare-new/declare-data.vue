<template>
    <div class="p-declare-data">
        <div v-for="list in lists">
            <div class="mt-xs mb-xs">{{list.title}}</div>
            <el-card>
                <div v-for="data in list.data">
                    <div v-if="data.type==2">
                        <el-radio class="radio" v-model="list.radio" :label="data.key">{{data.title}}</el-radio>
                    </div>
                    <div v-if="data.type==1">
                        <el-select v-model="data.val" class="inline" style="width:300px" filterable clearable>
                            <el-option
                                    :key="index"
                                    v-for="(item,index) in data.condition"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                        <label class="p-color">{{data.desc}}</label>
                    </div>
                    <div v-if="data.type==5">
                        <el-checkbox v-model="data.checked">{{data.title}}</el-checkbox>
                        <input type="number" min="0" v-model="data.val" class="inline el-input__inner" :disabled="!data.checked" @blur="show_class(data,1)" style="width:90px"/>
                        <label>{{data.unit}}</label>
                        <label class="p-color">{{data.desc}}</label>
                    </div>
                    <div v-if="data.type==6" class="mt-xs">
                        <el-radio class="radio" v-model="list.radio" :label="data.key">{{data.title}}</el-radio>
                        <span v-if="!polyType(data)">
                           <el-select v-model="data.val" class="inline" :disabled="data.key!=list.radio"  style="width:90px">
                            <el-option
                              :key="index"
                              v-for="(item,index) in data.condition"
                              :label="item"
                              :value="index">
                            </el-option>
                        </el-select>
                        <input type="number" min="0" v-model="data.other" class="inline el-input__inner" :disabled="data.key!=list.radio" @blur="show_class(data,2)" style="width:90px"/>
                        </span>
                        <span v-else>
                          <input type="number" min="0" v-model="data.val" v-if="data.value_type =='float'" class="inline el-input__inner" :disabled="data.key!=list.radio" @blur="show_class(data,2)" style="width:90px"/>
                          <input type="number" min="0" v-model="data.val" v-else="data.value_type =='integer'" class="inline el-input__inner" :disabled="data.key!=list.radio" @blur="show_class(data,0)" style="width:90px"/>
                        </span>
                       <!-- <el-input type="number" min="0" v-model="data.other" class="inline" :disabled="data.key!=list.radio" style="width:90px" :class="[data.showClass?'error-color':'']" @blur="show_class(data)"></el-input>-->
                        <label>{{data.unit}}</label>
                        <div v-if="data.child.length>0" v-for="child in data.child" style="display: inline-block;padding-left: 5px;">
                            <div v-if="child.type==5">
                                <el-checkbox v-model="child.checked" >{{child.title}}</el-checkbox>
                                <input type="number" min="0" v-model="child.val" class="inline el-input__inner" :disabled="!child.checked" @blur="show_class(child,2)" style="width:90px"/>
                             <!--   <el-input type="number" min="0" v-model="child.val" class="inline" :disabled="!child.checked" style="width:90px" :class="[child.showClass?'error-color':'']" @blur="show_class(child)"></el-input>-->
                                <label>{{child.unit}}</label>
                                <label class="p-color">{{child.desc}}</label>
                            </div>
                          <!--  <declare-data :lists="data.child" :cardShow="false"></declare-data>-->
                        </div>
                        <label class="p-color">{{data.desc}}</label>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<style lang="stylus">
    .p-declare-data{
        .error-color{
            border: 1px solid red;
            border-radius: 4px;
        }
    }
</style>
<script>

    export default{
        name:'declare-data',
        data(){
            return {

            }
        },
        created(){

        },
        mounted(){

        },
        methods: {
            polyType(data){
                if (data.condition instanceof Array) {
                    return true
                }else{
                    return false
                }
            },
            show_class (data,num) {
//                if (parseFloat(data.val) <= 0 || parseFloat(data.other) <= 0) {
//                    data.showClass = true;
//                    return
//                }
//                data.showClass = false;
                console.log(data.val);
                Number(data.val) <= 0 && (data.val = 0);
                data.other && Number(data.other) < 0 && (data.other = 0);
                Number(data.val) &&  (data.val = Number(data.val).toFixed(num));
                data.other = Number(data.other).toFixed(num);
            },
            submit(){
                for (let i=0;i<this.lists.length;i++) {

                    if (this.rulesFun(this.lists[i].data)){
                        continue;
                    } else {
                        return false;
                    }
                }
                return true;

            },
            rulesFun(arr){
                for (let i=0;i<arr.length;i++) {
                    if (arr[i].showClass){
                       return false
                    } else {
                        if (arr[i].child.length>0) {
                            for (let j=0;j<arr[i].child.length;j++) {
                                if (arr[i].child[j].showClass) {
                                    return false
                                }
                            }
                        }
                    }
                }
                return true;
            },
        },
        filters: {},
        watch: {
            lists(val){

            }
        },
        computed: {
           dataList(){
                this.lists.forEach(item=>{
                    item.data.forEach(data=>{
                        if(data.child.length>0){
                            data.child=[{data:data.child}];
                        }
                    })
                });
                return this.lists
            }
        },
        props: {
            lists:{},
            cardShow:{}
        },
        components: {}
    }
</script>
