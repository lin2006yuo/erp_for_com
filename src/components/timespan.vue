<!-- 
    说明：  时间范围选择器
    props: |--from 开始时间，格式为'YYYY-MM-dd'
           |--to   结束时间，格式为'YYY-MM-dd'
             
    使用：  <timespan
            :to.sync="searchData.date_to"
            :from.sync="searchData.date_from"
           ></timespan>
           组件内部已经处理时间格式，为'YYYY-MM-dd'，所以不用再index页面再处理
 -->
<template>
    <div class="timespan inline">
        <el-date-picker class="date inline"
                        :value="from"
                        @input="handleInput('update:from', $event)"
                        :picker-options="picker_b"
                        v-sf.from
                        placeholder="开始时间">
        </el-date-picker>
        <span>&nbsp;--&nbsp;</span>
        <el-date-picker
            class="date inline mr-sm"
            placeholder="结束时间"
            :value="to"
            @input="handleInput('update:to', $event)"
            v-sf.to
            :picker-options="picker_e"
            >
        </el-date-picker>
    </div>
</template>
<script>
export default {
    computed: {
        picker_b() {
            return {
                disabledDate: (time) => {
                    const toT = new Date(this.to)
                    if (this.to) {
                        return time.getTime() > toT
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
        picker_e() {
            return {
                disabledDate: (time) => {
                    const fromT = new Date(this.from)
                    if (this.from) {
                        return time.getTime() < fromT || time.getTime() > Date.now()
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
    },
    methods: {
        handleInput(eventName, time) {
            const selectTime = time ? datef('YYYY-MM-dd', +time / 1000): ''
            this.$emit(eventName, selectTime)
        }
    },
    props: ['from', 'to']
}
</script>
<style lang="stylus">
.timespan
    .date.inline
        width 140px
</style>