<template>
    <div class="p-joom-publish-base">
        <div class="p-title-bg-color">
            <span>基本信息</span>
        </div>
        <div class="p-head-border-color">
            <el-form label-width="150px">
                <el-form-item label="平台账号：">
                    <span class="el-tag el-tag--success">{{accountInfo.account_name}}</span>
                </el-form-item>
                <el-form-item label="平台店铺：">
                    <span class="el-tag el-tag--success">{{accountInfo.shop_name}}</span>
                </el-form-item>
                <el-form-item label="刊登标题：" required>
                    <limit-input style="width: 900px;display: inline-block" v-model="accountInfo.name" class="inline" :is-textarea="false"
                                 :maxlength="100" :cur-span="23" :show-number="true" @blur-change="detect_name(accountInfo.name)"></limit-input>
                    <el-button style="margin-left: 30px;" type="primary" size="mini"
                               @click="initial_uppercase">首字母大写
                    </el-button>
                </el-form-item>
                <el-form-item required>
                    <label class="tag-label">
                        <span class="required">*</span>
                        标签(
                        <span class="bold-font">
                            <span class="red">{{accountInfo.tags.length}}</span>
                            /10</span>
                        )：</label>
                    <div class="tag-flex-content">
                        <input-tag :tags="accountInfo.tags" ref="tagData"  type="primary"></input-tag>
                        <el-button class="inline mt-xs" type="primary" size="mini" @click="extract_key"
                                   :disabled="accountInfo.tags.length>=10">提取平台关键词</el-button>
                    </div>
                </el-form-item>
                <el-form-item v-if="false" label="包装重量(Kg)：" required>
                    <el-input class="inline" v-model="accountInfo.shipping_weight"></el-input>
                </el-form-item>
                <el-form-item label="平台SPU：" required>
                    <el-input class="inline" style="width:300px;" disabled v-model="accountInfo.parent_spu"></el-input>
                </el-form-item>
                <el-form-item label="敏感货：" required>
                    <el-select v-model="accountInfo.dangerous_kind" class="inline s-width-large" placeholder="请选择">
                        <el-option
                                v-for="item in kinds"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-tag type="success"
                            v-if="accountInfo.transport_property"
                            class="inline ml-xs"
                    >{{accountInfo.transport_property}}</el-tag>
                </el-form-item>
                <el-form-item label="销售员：" required>
                    <span>{{accountInfo.realname}}</span>
                </el-form-item>
            </el-form>
        </div>
        <!-- 关键词弹出框 -->
        <extract-keyword v-model="keywordDialog"
                         :oldTags="accountInfo.tags"
                         title="选择关键词" :is-joom="true"
                         @add-data="add_data"></extract-keyword>
    </div>
</template>

<style lang="stylus" type="text/stylus">
    .p-joom-publish-base{
        .tag-label {
            width:165px;
            position: absolute;
            left: -96px;
        }
        .tag-label .required{
            color: #ff4949;
            margin-right: 4px;
        }
        .width-200{
            width 200px;
        }
        .p-title-bg-color {
            background: #FAECE7;
            span {
                color: #FFF;
                font-weight: bold;
                padding: 5px 10px;
                font-size: 1.7rem;
                display: inline-block;
                background: #ffb732;
            }
            .el-input__inner {
                height: 26px !important;
            }
        }
        .p-head-border-color {
            padding: 20px;
            border-left: 3px solid #ffb732;
        }
    }
</style>
<script>

    export default{
        data(){
            return {
                keywordDialog: false
            }
        },
        created(){

        },
        filters: {},
        mounted(){

        },
        destroy(){

        },
        methods: {
            init(){
            },
            // 首字母大写
            initial_uppercase(){
                this.$emit('initial-uppercase')
            },
            // 标题修改后检测 标题是否有重复
            detect_name(name){
                let arr = name.split(/\s+/);
                let copyArr = [];
                let obj = {};
                arr.forEach((item,index)=>{
                    if(obj[item]){
                        copyArr.push(item);
                    }else {
                        obj[item] = true;
                    }
                    if(/【\S*】/.test(item)){
                        let str = item;
                        let reg = /^【/gi;
                        let reg2 = /】$/gi;
                        str = str.replace(reg, '');
                        str = str.replace(reg2, '');
                        arr.splice(index, 1 , str);
                    }else {
                        console.log(111)
                    }
                });
                if(copyArr.length !== 0){
                    copyArr.forEach(row=>{
                        arr.forEach((item, index)=>{
                            if(row === item){
                                arr.splice(index, 1 , `【${row}】`);
                            }
                        });

                    });
                    this.$message({
                        type:'info',
                        message:`标题有重复：${copyArr.join('，')}`
                    });
                }
                this.accountInfo.name = arr.join(' ');
            },
            // 操作提取关键词弹出框
            extract_key(){
                this.keywordDialog = true;
            },
            // 添加标签
            add_data(val){
                let tags = val.map(row=>{
                    return {
                        name: row
                    }
                });
                this.accountInfo.tags.push(...tags);
            }
        },
        computed: {},
        watch: {},
        props: {
            accountInfo:{

            },
            kinds:{}
        },
        components: {
            limitInput: require('../../ebay/kandeng-list/add-edit-listing/limit-input.vue').default,
            inputTag:require("../../../../components/input-tag.vue").default,
            extractKeyword:require('../../wish/info/extract-keyword.vue').default,
        }
    }
</script>

