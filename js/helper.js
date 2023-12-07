// 千分位

export function toThousands(num) {
    return num.toString().split('.')
           .map((item, index) => index === 0 ? item.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : item)
           .join('.');
}

// 訂單排序 ( 未出貨的在最上方 )

export function sortOrders(orders) {

    return orders.sort((a,b) => a.paid-b.paid)

}

// 止抖

export function debounce(callbackFn, delay) {

    let timer;

    return (...args) => {

        if (timer) { clearTimeout(timer) }

        timer = setTimeout(() => callbackFn(...args), delay);

    }

}