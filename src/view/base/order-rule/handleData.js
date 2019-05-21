// 处理递归数据。
export function handleData(li) {
    let list2 = JSON.parse(JSON.stringify(li));
    let ret = [];
    recursion(ret, list2);
    return ret;
}

function recursion(ret, list2) {
    list2.forEach(row => {
        let obj = {
            value: row.key,
            label: row.title
        };
        // 单一的row;
        ret.push(obj);
        if (row.child && row.child.length > 0) {
            recursion(ret, row.child);
        }        
    })
}


// 选择对应的选择框.
export function handleSelect(list, data, index) {
    list.forEach(item =>{
        handleOne(item, data.child, index)
    });
}

function handleOne(key, data, index) {
    if (!!data[key]) {
        if (index === 1) {
            // 去除对应的项。
            data[key].value = false;    
        } else if (index === 2) {
            data[key].value = true;    
        }        
    } else {
        for (let item in data) {
            handleOne(key, data[item].child, index)
        }
    }
}

// 数据的回填 .

export function backFill(list, data) {
    if (data && Object.keys(data).length > 0) {        
        for(let item in data) {            
            if (data[item] && data[item].value === true) {            
                list.push(data[item].key);
            }           
            backFill(list, data[item].child);                            
        }            
    }
    // return listSelect;    
}