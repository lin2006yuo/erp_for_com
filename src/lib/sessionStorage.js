

export const getItem = (key, def = false) => {
    let val = sessionStorage.getItem(key);
    if(val) {
        return JSON.parse(val);
    }else{
        return def;
    }
};

export const setItem = (key, val) =>{
    sessionStorage.setItem(key, JSON.stringify(val));
};

export const delItem = (key) => {
    sessionStorage.removeItem(key);
};