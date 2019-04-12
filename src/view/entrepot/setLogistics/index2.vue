<template>
    <div>
        <district-fee :locations="locations" :remote="remote" :editable="true"/>
        <button @click="addCountry">添加国家</button>
        <div>
            <button @click="tagClick(item)" v-for="item in 3" :key="item">分区{{item}}</button>
        </div>
    </div>
</template>
<script>
    import districtFee from './district-fee.vue'
export default {
    data() {
        return {
            locations: [
                {
                    is_remote: false,
                    country_code: 'AA',
                    country_name: '美国'
                },
                {
                    is_remote: false,
                    country_code: 'BB',
                    country_name: '英国'
                }
            ],
            remote: [
                {
                    country_code: 'AA',
                    country_name: '美国',
                    detail: []
                },
                {
                    country_code: 'BB',
                    country_name: '英国',
                    detail: []
                }
            ]
        }
    },
    methods: {
        addCountry() {
            this.locations.push({
                    is_remote: false,
                    country_code: 'CC',
                    country_name: '法国'
            })
        },
        tagClick(index) {
            if(index === 1) {
                this.locations = [
                    {is_remote: false,country_code: 'AA',country_name: '中国'},
                    {is_remote: false,country_code: 'BB',country_name: '日本'},
                    {is_remote: false,country_code: 'BB',country_name: '韩国'},
                ]
                this.remote = [
                    {country_code: 'AA',country_name: '中国',detail: []},
                    {country_code: 'BB',country_name: '日本',detail: []},
                    {country_code: 'BB',country_name: '韩国',detail: []}
                ]
            } else if(index === 2) {
                this.locations = [
                    {is_remote: false,country_code: 'AA',country_name: '南非'},
                ]
                this.remote = [
                    {country_code: 'AA',country_name: '南非',detail: []},
                ]
            } else if(index === 3) {
                this.locations = [
                    {is_remote: false,country_code: 'AA',country_name: '美国'},
                    {is_remote: false,country_code: 'BB',country_name: '英国'},
                ]
                this.remote = [
                    {country_code: 'AA',country_name: '美国',detail: []},
                    {country_code: 'BB',country_name: '英国',detail: []}
                ]
            }
        }
    },
    components: {
        districtFee
    }
}
</script>

