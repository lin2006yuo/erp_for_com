<template>
    <div class="c-filter-node">
        <span :title="filter.title">{{filter.name}}</span>
        <filter-configs class="configs" v-if="hasConfigs">
            <filter-config v-if="datas[filter.nodeid]"
                           v-for="config in filter.configs"
                           :key="config.key"
                           :value="config_value(filter.nodeid, config.class)"
                           @change="change"
                           :config="config">
            </filter-config>
        </filter-configs>
        <ul class="relates" v-if="hasRelates">
            <li v-for="relate in filter.relates"
                :key="relate.title">
                <filter-node :filter="relate"
                             :roleid="roleid"
                             :datas="datas"
                ></filter-node>
            </li>
        </ul>
    </div>
</template>
<style lang="stylus">
    .c-filter-node {
        ul > li {
            line-height: 22px;
        }
        ul.configs {
            padding-left: 15px;
            border: 1px solid #dddddd;
        }
        ul.relates {
            margin-left: 20px;
            border: 1px solid #3399ff;
        }
    }
</style>
<script>
    import {api_get_role_acess} from '../../../api/role';

    export default {
        name: 'filter-node',
        data() {
            return {
            }
        },
        async mounted() {
            let configs = await this.$http(api_get_role_acess, this.roleid, this.filter.nodeid);
            switch (configs.constructor.name){
                case 'Array':
                    configs = configs.toObject();
                    break;
                case 'Object':

                    break;
            }
            this.$set(this.datas, this.filter.nodeid, configs);
        },
        methods:{
            change(fclass, val){
                this.$set(this.datas[this.filter.nodeid], fclass, val);
            },
            config_value(nodeid, filterid){
                let value = this.datas[nodeid][filterid];
                if(undefined === value){
                    return [];
                }else{
                    return value;
                }
            }
        },
        computed: {
            hasRelates() {
                return this.filter.relates && this.filter.relates.length;
            },
            hasConfigs() {
                return this.filter.configs && this.filter.configs.length;
            },
        },
        props: {
            roleid: {},
            filter: {},
            datas: {},
        },
        destroyed() {
        },
        components: {
            filterConfig: require('./filter-config.vue').default,
            filterConfigs: require('./filter-configs.vue').default
        }
    }
</script>