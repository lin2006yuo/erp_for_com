/**
 * Created by wuchuguang on 16-12-19.
 */
import Vue from 'vue';
export default {
    components:{
        // 类型 1-复选 2-单选 3-文本框 4-多文本框 5-复选+文本框输入  6-单选+文本框输入 7-复选+2个文本框
        rule1:require('./rule1.vue').default,
        rule1update:require('./rule1-update.vue').default,
        rule2:require('./rule2.vue').default,
        rule3:require('./rule3.vue').default,
        rule4:require('./rule4.vue').default,
        rule5:require('./rule5.vue').default,
        rule7:require('./rule7.vue').default,
        rule8:require('./rule8.vue').default,
        rule11:require('./rule11.vue').default,
        rule12:require('./rule12.vue').default,
    },
    props:{
        config:{},
        data:{},
    },
    methods:{
        updateChilds(){
            this.$children.forEach((child, index) =>{
                if(child.index !== undefined){
                    child.index = index;
                }
            });
        }
    },
    data(){
        return {};
    },
    watch:{
    },
    render(createElement) {
        let row2dom = (data, type,row, election)=>{
            // 递归进行子元素调用， 如果子元素，还包函子元素。
            let childs = rows2dom(data, row.type||type,row.child);

            // 类型 1-复选 2-单选 3-文本框 4-多文本框 5-复选+文本框输入  6-单选+文本框输入 7-复选+2个文本框            
            switch(type){
                case 1://1-复选
                    this.$set(row, 'election', data.election);
                    return createElement('rule1update',{props:{election:childs.length && this.config.election, form:row,value:data.value,operator:data.operator},on:{
                        input(val) {
                            // 监听返回的值。
                            data.value = val;
                            switch (data.type) {
                                case 1:
                                    val && (data.parent.value = true);
                                    break;
                            }
                        }
                    }},childs);
                case 2://2-单选
                    return createElement('rule2',{props:{form:row,value:data.value,operator:data.operator},on:{
                        input(val){
                            data.value = val;
                            switch (data.type) {
                                case 2:
                                    if(val){
                                        Object.keys(data.parent.child).forEach(c=>{
                                            data.parent.child[c].value = false;
                                        });
                                        data.parent.child[data.key].value = true;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }},childs);
                case 3:
                    return createElement('rule3',{props:{form:row,value:data.value,operator:data.operator},on:{
                        input(val){
                            data.value = val;
                            switch (data.type){
                                case 2:
                                    if(val){
                                        for(let c in data.parent.child){
                                            if(c !== data.key && data.parent.child.hasOwnProperty(c)){
                                                data.parent.child[c].value = false;
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }},childs);
                case 4:
                    return createElement('rule4',{props:{form:row,value:data.value,operator:data.operator},on:{
                        input(val){
                            data.value = val;
                            switch (data.type){
                                case 2:
                                    if(val){
                                        for(let c in data.parent.child){
                                            if(c !== data.key && data.parent.child.hasOwnProperty(c)){
                                                data.parent.child[c].value = false;
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }},childs);
                case 5:
                    return createElement('rule5',{props:{form:row,value:data.value,operator:data.operator},on:{
                        input(val){
                            data.value = val;
                            switch (data.type){
                                case 2:
                                    if(val){
                                        for(let c in data.parent.child){
                                            if(c !== data.key && data.parent.child.hasOwnProperty(c)){
                                                data.parent.child[c].value = false;
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }},childs);
                case 7:
                    return createElement('rule7',{props:{form:row,value:data.value,operator:data.operator},on:{
                        input(val){
                            data.value = val;
                            switch (data.type){
                                case 2:
                                    if(val){
                                        for(let c in data.parent.child){
                                            if(c !== data.key && data.parent.child.hasOwnProperty(c)){
                                                data.parent.child[c].value = false;
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }},childs);
                case 8:
                    return createElement('rule8',{props:{form:row,value:data.value,operator:data.operator},on:{
                        input(val){
                            data.value = val;
                            switch (data.type){
                                case 2:
                                    if(val){
                                        for(let c in data.parent.child){
                                            if(c !== data.key && data.parent.child.hasOwnProperty(c)){
                                                data.parent.child[c].value = false;
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }},childs);
                case 11:
                    return createElement('rule12',{props:{election: election, form:row,value:data.value,operator:data.operator},on:{
                        input(val){
                            data.value = val;
                            switch (data.type){
                                case 2:
                                    if(val) {
                                        for(let c in data.parent.child){
                                            if(c !== data.key && data.parent.child.hasOwnProperty(c)){
                                                data.parent.child[c].value = false;
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }},childs);
                default:
                    return createElement('div');
            }
        };
        let rows2doms = (data, type, rows, election) =>{
            if(data.child === undefined){
                this.$set(data, 'child', {});
            }
            return rows.map((row)=>{
                if(data.child[row.key] === undefined){
                    this.$set(data.child, row.key, {key:row.key,title:row.title,parent:data,type:type});
                }
                if(data.child[row.key].value === undefined){
                    this.$set(data.child[row.key], 'value',type2value(row.type || type));
                }
                if(data.child[row.key].group === undefined){
                    this.$set(data.child[row.key], 'group',row.group);
                }
                if(data.child[row.key].election === undefined){
                    this.$set(data.child[row.key], 'election',row.election);
                }
                if(data.child[row.key].child === undefined){
                    this.$set(data.child[row.key], 'child',{});
                }
                if(data.child[row.key].operator === undefined){
                    let sel = "";
                    if(typeof row.condition === 'array'){
                        sel = Object.keys(row.condition[0])[0];
                    }
                    if(typeof row.condition === 'object'){
                        sel = Object.keys(row.condition || {})[0] || "";
                    }
                    this.$set(data.child[row.key], 'operator',{sel:sel});
                }
                if(data.child[row.key].operator.sel === undefined){
                    this.$set(data.child[row.key], 'operator',{sel:data.child[row.key].operator});
                }
                // 把父级key新建到 data.child {}中并作为key, value为一个{};  type为类型， row每一个框对应的数据。
                return row2dom(data.child[row.key], row.type || type, row, election);
            });
        };
        let rows2dom = (data, type, rows, election) =>{
            if(rows.length <= 0){
                return [];
            }
            let classifys = rows.classify(row=>row.group);
            if(classifys['']){
                rows = classifys[''];
                return rows2doms(data,type, rows, election);
            }else{
                let divs = [];
                for(let c in classifys){
                    if(classifys.hasOwnProperty(c)){
                        divs.push(createElement('div',{class:'rule-box'},rows2doms(data,type,classifys[c])));
                    }
                }
                return divs;
            }
        };
        // this.config.data 为对应code码下面取回的数据。
        if(this.config.data){
            let childs = this.config.data || [];
            // this.data  应直接就是空数据, 
            let  election = this.config.election ? this.config.election : "";
            return createElement('div', {}, rows2dom(this.data,this.config.type,childs, election));
        }else{
            return createElement('div',{directives: [
                {
                    name: 'loading',
                    value: 'true',
                }
            ],
            });
        }
    },
    mounted() {
        // 渲染完成，通知父级重新显示。    
        // this.$emit('typecomplete', this.config.type);
       
    },
    updated() {
        // this.$emit('rendercomplate');
    },
};

function type2value(type) {
    switch (type){
        case 1:return false;
        case 2:return false;
        case 3:return '';
        case 4:return [];
        case 5:return '';
        case 7:return ["",""];
        case 8:return [];
        case 11:return [];
        default:return ''
    }
}
