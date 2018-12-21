import pinyin from 'pinyin';
window.$$PinYin = pinyin;
export default (text, match) =>{
    const textPy = pinyin(text, {heteronym:true,segment:true,style:window.pinyin.STYLE_NORMAL});
    const matchs = match.split('');
    let m = [];
    let nth = 0;
    do{
        m.push(matchs.shift());
        let ms = m.join('');
        const t = textPy[nth];
        t.some(f => f.indexOf(ms) >= 0)
    }while (matchs.lenght > 0)
}