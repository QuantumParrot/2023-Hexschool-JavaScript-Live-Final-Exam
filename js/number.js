// 千分位

function toThousands(num) {
    return num.toString().split('.')
           .map((item, index) => index === 0 ? item.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : item)
           .join('.');
}

export default toThousands;