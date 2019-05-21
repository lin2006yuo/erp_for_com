export function filterCny1(val) {
    if (!~val.indexOf('-')) {
        // 不包含的话。
        return val;
    } else {
        return val.substr(1);
    }
}

export function positive1(val) {
    if (!~val.indexOf('-')) {
        return '';
    } else {
        return '-'
    }
}

export function inputValue(cny) {
    if (cny === "undefined") {
        return '';
    } else {
        return positive1(cny) +` ¥ ` +  filterCny1(cny);
    }
}
