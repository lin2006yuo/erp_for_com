<template>
    <div class="p-package-review">
        <el-card>
            <el-form ref="form" :model="searchData" label-width="80px">
                <el-form-item label="集包单号：">
                    <el-input v-model="searchData.code"
                              autofocus
                              ref="code"
                              @focus="focus('code')"
                              @keyup.enter.native="number_enter"
                              class="width-lg inline">
                    </el-input>
                    <span v-if="!!searchData.warningText">
                        <i class="delete-icon"></i>
                        <span class="red">{{searchData.warningText}}</span>
                    </span>
                </el-form-item>
                <el-form-item label="集包重量：">
                    <scan-input v-model="searchData.weight"
                                ref="weight"
                                @enter="weight_enter"
                                class="width-lg inline">
                    </scan-input> kg
                    <span class="blue ml-sm">提示：按F2可切换到重量</span>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<style lang="stylus">
    .p-package-review{
        .red{
            font-size: 20px;
            vertical-align: middle;
        }
        .blue{
            color: #1D8CE0;
        }
    }
</style>
<script>
    export default {
        activated(){//当切换到当前页面时触发这个回调。
            this.$refs.code.$refs.input.focus();
            let component = this;
            document.onkeydown=function(event){
                let e = event || window.event || arguments.callee.caller.arguments[0];
                if(e && e.keyCode===113){ // 按 F2
                    component.onkeyF2();
                }
            };
        },
        data(){
            return {
                searchData: {
                    code:'',
                    weight:'',
                    warningText:''
                }
            }
        },
        mounted(){
            let component = this;
            document.onkeydown=function(event){
                let e = event || window.event || arguments.callee.caller.arguments[0];
                if(e && e.keyCode===113){ // 按 F2
                    component.onkeyF2();
                }
            };
        },
        methods: {
            init(){
                this.searchData.warningText = '';
                this.$emit('init-data', this.searchData);
            },
            weight_enter(){
                this.trim_search();
                this.searchData.weight = this.searchData.weight.replace(/^\s+|\s+$/g,"");
                if(!!this.searchData.code){
                    this.init();
                } else {
                    this.$refs.code.$refs.input.select();
                }
            },
            number_enter(){
                this.trim_search();
                if(!!this.searchData.weight){
                    this.init();
                } else {
                    this.$refs.weight.select();
                }
            },
            trim_search() {
              this.searchData.code = this.searchData.code.trim();
              this.searchData.weight = this.searchData.weight.trim();
            },
            onkeyF2(){
                this.$refs.weight.select();
            },
            focus(item){
                this.$refs[item].$refs.input.select();
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            scanInput:require('../../../components/scan-input').default
        },
    }
</script>
