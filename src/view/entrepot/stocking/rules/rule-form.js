/**
 * Created by wuchuguang on 16-12-19.
 */
import Vue from 'vue';

export default {
    components: {
        rule1: require('./rule1.vue').default,
        rule2: require('./rule2.vue').default,
        rule3: require('./rule3.vue').default,
        rule4: require('./rule4.vue').default,
        rule5: require('./rule5.vue').default,
        rule7: require('./rule7.vue').default,
        rule8: require('./rule8.vue').default,
    },
    props: {
        config: {},
        data: {},
    },
    data() {
        return {};
    },
    methods: {
        updateChilds() {
            console.log(`updateChilds`);
            this.$children.forEach((child, index) => {
                if (child.index !== undefined) {
                    child.index = index;
                }
            });
        }
    },
    watch: {},
    render(createElement) {
        console.log(`render!!`);
        let row2dom = (data, type, row) => {
            let childs = rows2dom(data, row.type || type, row.child);
            // 类型 1-复选 2-单选 3-文本框 4-多文本框 5-复选+文本框输入  6-单选+文本框输入 7-复选+2个文本框
            switch (type) {
                case 1://1-复选
                    return createElement('rule1', {
                        props: {form: row, value: data.value, operator: data.operator}, on: {
                            input(val) {
                                data.value = val;
                                switch (data.type) {
                                    case 1:
                                        if (val) {
                                            data.parent.value = true;
                                        } else {
                                            for (let c in data.child) {
                                                if (data.child.hasOwnProperty(c)) {
                                                    data.child[c].value = false;
                                                }
                                            }
                                        }
                                        break;
                                }
                            }
                        }
                    }, childs);
                case 2://2-单选
                    return createElement('rule2', {
                        props: {form: row, value: data.value, operator: data.operator}, on: {
                            input(val) {
                                data.value = val;
                                switch (data.type) {
                                    case 2:
                                        if (val) {
                                            for (let c in data.parent.child) {
                                                if (c !== data.key && data.parent.child.hasOwnProperty(c)) {
                                                    data.parent.child[c].value = false;
                                                }
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }, childs);
                case 3:
                    return createElement('rule3', {
                        props: {form: row, value: data.value, operator: data.operator}, on: {
                            input(val) {
                                data.value = val;
                                switch (data.type) {
                                    case 2:
                                        if (val) {
                                            for (let c in data.parent.child) {
                                                if (c !== data.key && data.parent.child.hasOwnProperty(c)) {
                                                    data.parent.child[c].value = false;
                                                }
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }, childs);
                case 4:
                    return createElement('rule4', {
                        props: {form: row, value: data.value, operator: data.operator}, on: {
                            input(val) {
                                data.value = val;
                                switch (data.type) {
                                    case 2:
                                        if (val) {
                                            for (let c in data.parent.child) {
                                                if (c !== data.key && data.parent.child.hasOwnProperty(c)) {
                                                    data.parent.child[c].value = false;
                                                }
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }, childs);
                case 5:
                    return createElement('rule5', {
                        props: {form: row, value: data.value, operator: data.operator}, on: {
                            input(val) {
                                data.value = val;
                                switch (data.type) {
                                    case 2:
                                        if (val) {
                                            for (let c in data.parent.child) {
                                                if (c !== data.key && data.parent.child.hasOwnProperty(c)) {
                                                    data.parent.child[c].value = false;
                                                }
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }, childs);
                case 7:
                    return createElement('rule7', {
                        props: {form: row, value: data.value, operator: data.operator}, on: {
                            input(val) {
                                data.value = val;
                                switch (data.type) {
                                    case 2:
                                        if (val) {
                                            for (let c in data.parent.child) {
                                                if (c !== data.key && data.parent.child.hasOwnProperty(c)) {
                                                    data.parent.child[c].value = false;
                                                }
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }, childs);
                case 8:
                    return createElement('rule8', {
                        props: {form: row, value: data.value, operator: data.operator}, on: {
                            input(val) {
                                data.value = val;
                                switch (data.type) {
                                    case 2:
                                        if (val) {
                                            for (let c in data.parent.child) {
                                                if (c !== data.key && data.parent.child.hasOwnProperty(c)) {
                                                    data.parent.child[c].value = false;
                                                }
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }, childs);
                default:
                    return createElement('div');
            }
        };
        let rows2doms = (data, type, rows) => {
            if (data.child === undefined) {
                this.$set(data, 'child', {});
            }
            return rows.map((row) => {
                if (data.child[row.key] === undefined) {
                    this.$set(data.child, row.key, {key: row.key, title: row.title, parent: data, type: type});
                }
                if (data.child[row.key].parent === undefined) {
                    this.$set(data.child[row.key], 'parent', data);
                }
                if (data.child[row.key].title === undefined) {
                    this.$set(data.child[row.key], 'title', row.title);
                }
                if (data.child[row.key].value === undefined) {
                    this.$set(data.child[row.key], 'value', type2value(row.type || type));
                }
                if (data.child[row.key].group === undefined) {
                    this.$set(data.child[row.key], 'group', row.group);
                }
                if (data.child[row.key].child === undefined) {
                    this.$set(data.child[row.key], 'child', {});
                }
                if (data.child[row.key].operator === undefined) {
                    let sel = "";
                    if (typeof row.condition === 'array') {
                        sel = Object.keys(row.condition[0])[0];
                    }
                    if (typeof row.condition === 'object') {
                        sel = Object.keys(row.condition || {})[0] || "";
                    }
                    this.$set(data.child[row.key], 'operator', {sel: sel});
                }
                if (data.child[row.key].operator.sel === undefined) {
                    this.$set(data.child[row.key], 'operator', {sel: data.child[row.key].operator});
                }
                if (data.child[row.key].user === undefined && row.user) {
                    this.$set(data.child[row.key], 'user', row.user);
                }

                return row2dom(data.child[row.key], row.type || type, row);
            });
        };
        let rows2dom = (data, type, rows) => {
            if (rows.length <= 0) {
                return [];
            }
            let classifys = rows.classify(row => row.group);
            if (classifys['']) {
                rows = classifys[''];
                return rows2doms(data, type, rows);
            } else {
                let divs = [];
                for (let c in classifys) {
                    if (classifys.hasOwnProperty(c)) {
                        divs.push(createElement('el-card', {}, rows2doms(data, type, classifys[c])));
                    }
                }
                return divs;
            }

        };
        if (this.config.data) {
            let childs = this.config.data || [];
            return createElement('div', {}, rows2dom(this.data, this.config.type, childs));
        } else {
            return createElement('div', {
                directives: [
                    {
                        name: 'loading',
                        value: 'true',
                    }
                ],
            });
        }

    }
};

function type2value(type) {
    switch (type) {
        case 1:
            return false;
        case 2:
            return false;
        case 3:
            return '';
        case 4:
            return [];
        case 5:
            return '';
        case 7:
            return ["", ""];
        case 8:
            return [];
        default:
            return ''
    }
}