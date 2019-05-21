<template>
    <div class="c-card-search-order">
        <search-card @search="$emit('search')"
                     @enter="$emit('search')"
                     :params="searchData" :clears="clears"
                     class="local-order-search">
            <label-buttons label="状态："
                           :buttons="userStatus"
                           @select="changeSelect">
            </label-buttons>
            <label-items label="操作人：" class="inline mr-sm">
                <super-select
                        class="s-width-default"
                        v-model="searchData.operator_id"
                        :storage-key="`channelCreator`"
                        :options="creatorData">
                </super-select>
            </label-items>
            <label-items label="信用卡类别：" class="inline mr-sm">
                <super-select
                        class="s-width-default"
                        v-model="searchData.type"
                        :storage-key="`typeListCreator`"
                        :options="typeList">
                </super-select>
            </label-items>
            <label-items label="提款类型：" class="inline mr-sm">
                <super-select
                        class="s-width-default"
                        v-model="searchData.withdrawals_type"
                        :storage-key="`withdrawalsCreator`"
                        :options="withdrawalsLists">
                </super-select>
            </label-items>

            <el-select v-model="searchData.snType" class="inline s-width-default" v-sf.snType>
                <el-option v-for="item in accountList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="searchData.snText"
                      :placeholder="`请输入${changeLabel}...`"
                      class="inline width-super"
                      v-sf.snText></el-input>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-card-search-order{
        .el-card{
            overflow: inherit;
        }
        .local-order-search{
            .local-order-self-width .el-select__tags{
                height: 30px!important;
                width: 208px
                overflow-y: auto;
                >span{
                    white-space: inherit;
                }
            }
            .local-order-input-no-margin {
                .el-select__input {
                    width: 196px !important;
                    margin-left: 4px !important;
                }
            }
        }
    }
</style>
<script>
    import labelButtons from '@/components/label-buttons.vue';
    export default {
        data() {
            return {
                accountList:[
                    {label:'PayPal账户',value:'account_name'},
                    {label: '服务器名',value:'ip_name'},
                ],
                typeList:[
                    {label:'全部',value:''},
                    {label:'小额',value:1},
                    {label:'大额',value:2}
                ]
            }
        },
        methods:{
            changeSelect(select){
                this.$emit('change-select',select)
            },
            remove_tag(item) {
                let index = this.searchData.withdrawals_type.findIndex(row => row === item.value);
                if (index >= 0) {
                    this.searchData.withdrawals_type.splice(index, 1);
                }
            },
        },
        computed: {
            changeLabel() {
                if (this.searchData.snType === 'account_name') {
                    return `PayPal账户`;
                } else{
                    return `服务器名`;
                }
            },
        },
        props:{
            searchData:{},
            creatorData:{},
            clears:{},
            userStatus:{},
            withdrawalsLists:{}
        },
        components: {
            labelButtons,
            searchCard:require('@/components/search-card.vue').default,
            labelItems:require('@/components/label-items.vue').default,
        }
    }
</script>