<template>
    <div class="c-card-search">
        <search-card style="overflow: visible" @search="$emit('search')"
                     @enter="$emit('search')" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons label="状态："
                               :buttons="status"
                               @select="change_select"
                               class="ml-sm">
                </label-buttons>
            </el-row>
            <el-select class="inline s-width-small"
                       v-sf.snType
                       v-model="searchData.snType">
                <el-option v-for="item in parameterList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input class="inline"
                      v-sf.snText
                      :placeholder="`请输入${changeLabel}...`"
                      v-model="searchData.snText"
                      @input="keyword"
            ></el-input>
            <label-items label="操作人：" class="inline ml-sm mr-sm">
                <super-select
                        class="s-width-default"
                        v-model="searchData.operator_id"
                        :storage-key="`channelCreator`"
                        :options="creatorData">
                </super-select>
            </label-items>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                parameterList:[
                    {value: 'wf_account', label: '登陆邮箱'},
                    {value: 'ip_name', label: '服务器名'},
                ],
                status:[
                    {label:'全部',value:''},
                    {label:'启用',value:1},
                    {label:'停用',value:0},
                ]
            }
        },
        methods:{
            change_select(index){
                this.searchData.status = this.status[index].value;
                this.$emit('change-select');
            },
            keyword(){
                this.searchData.snText = this.searchData.snText.replace(/\s*/g,'')
            }
        },
        computed: {
            changeLabel() {
                if (this.searchData.snType === 'wf_account') {
                    return `登陆邮箱`;
                } else{
                    return `服务器名`;
                }
            },
        },
        props:{
            searchData:{},
            clears:{},
            creatorData:{}
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItems:require('@/components/label-items.vue').default
        }
    }
</script>