<template>
    <page class="c-logistics-deliver-channel">
        <label-item class="center" label="公用价格区间：">
            <integer-input v-model.number="channelData.common.content.min"
                           :disabled="!editable"
                           :min="0"
                           @blur="validate_min(channelData.common.content)"></integer-input>
            <span>&nbsp;（元）</span>
            <label>&nbsp;—&nbsp;</label>
            <integer-input v-model.number="channelData.common.content.max"
                           :disabled="!editable"
                           :min="0"
                           @blur="validate_max(channelData.common.content)"></integer-input>
            <span>&nbsp;（元）</span>
        </label-item>
        <el-table :data="channelData.channels" border
                  ref="table"
                  class="scroll-bar mt-sm"
                  @select="select_change"
                  @select-all="select_change"
                  v-resize="{height: 150}"
                  highlight-current-row>
            <el-table-column :selectable="selectable" type="selection" width="35"></el-table-column>
            <el-table-column label="可发货平台" inline-template>
                <div>{{row.channel_name}}</div>
            </el-table-column>
            <el-table-column label="价格区间（买家付款总额）" inline-template>
                <div>
                    <integer-input v-model="row.content.min"
                                   class="inline"
                                   :disabled="!editable"
                                   :min="0"
                                   @blur="validate_min(row.content)"></integer-input>
                    <span>&nbsp;（元）</span>
                    <label class="inline">&nbsp;—&nbsp;</label>
                    <integer-input v-model.number="row.content.max"
                                   :min="0"
                                   :disabled="!editable"
                                   class="inline"
                                   @blur="validate_max(row.content)"></integer-input>
                    <span>&nbsp;（元）</span>
                </div>
            </el-table-column>
        </el-table>
    </page>
</template>

<style lang="stylus">
.c-logistics-deliver-channel {
    .center {
        margin: 0 auto;
    }
}
</style>

<script>
    export default {
        mounted() {
        },
        methods: {
            init() {
                this.$nextTick(() => {
                    this.channelData.channels.forEach(row => {
                        this.$refs.table.toggleRowSelection(row, row.enabled);
                    })
                });
            },
            validate_min(content) {
                if(content.min && content.max && Number(content.min) > Number(content.max)) {
                    this.$message({type: 'error', message: '最小值设置有误'});
                    this.$set(content, 'min', 0);
                }
            },
            validate_max(content) {
                if(content.min && content.max && Number(content.min) > Number(content.max)) {
                    this.$message({type: 'error', message: '最大值设置有误'});
                    this.$set(content, 'max', 0);
                }
            },
            selectable() {
                return this.editable;
            },
            select_change(selection) {
                console.log(selection);
                this.channelData.channels.forEach(row => {
                    let channel = selection.find(select => select.channel_id === row.channel_id);
                    if(channel) {
                        this.$set(row, 'enabled', true);
                    } else {
                        this.$set(row, 'enabled', false);
                    }
                });
            }
        },
        computed: {
        },
        watch: {
        },
        props: {
            channelData: {},
            editable: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>
