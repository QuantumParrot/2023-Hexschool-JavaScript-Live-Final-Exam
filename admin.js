import { toastMessage, showConfirmMessage, errorHandle } from "./js/message.js";
import { sortOrders } from "./js/helper.js";

const apiUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/admin/ataraxia/orders';

const token = "hobkokT4X2RiONmH0o9406YqlIy1";

const headers = { 
    headers: {
        authorization: token
    }
};

let data = [];

const chartSelector = document.querySelector('.chart-type');
chartSelector.addEventListener('change', changeChart);

// 環境初始化

(function init(){

    getOrders();

    const orders = document.querySelector('#orders');
    orders.addEventListener('click', ordersListener);

})();

// 取得訂單列表

function getOrders() {

    axios.get(apiUrl, headers)
    .then(res => {
        const chart = document.querySelector('#chart-display');
        data = sortOrders(res.data.orders);
        data.length ? renderCharts(chartSelector.value) : chart.style.display = 'none';
        renderOrders(data);
    })
    .catch(error => errorHandle(error))

}

// 改變圖表

function changeChart(e) {

    const { value } = e.target;
    const title = document.querySelector('.chart-title');

    if (value === '1') {
        title.textContent = '全產品類別營收比重';
    } else if (value === '2') {
        title.textContent = '全品項營收比重';
    }

    renderCharts(value);

}

function renderCharts(value) {

    let chartData = [];

    if (value === '1') {

        const categories = {};

        data.forEach(order => {

            order.products.forEach(item => 
            categories[item.category] ? 
            categories[item.category] += item.quantity*item.price : categories[item.category] = item.quantity*item.price
            );

        });

        const total = Object.values(categories).reduce((acc, curr) => acc + curr, 0);
        Object.keys(categories).forEach(key => chartData.push([key, +(categories[key]/total*100).toFixed(2)]));

    } else if (value === '2') {

        const products = {};

        // 1. 抓出所有商品及銷售額 (物件)

        data.forEach(order => {
    
            order.products.forEach(item =>
            products[item.title] ?
            products[item.title] += item.quantity*item.price : products[item.title] = item.quantity*item.price
            );
    
        });

        // 2. 全品項總銷售額

        const total = Object.values(products).reduce((acc, curr) => acc + curr, 0);

        // 3. 做成新的物件
    
        const rank = {};
        
        const productsSorted = Object.keys(products).sort((a,b)=>products[b]-products[a]);

        if (productsSorted.length > 3) { rank["其它"] = 0 }

        productsSorted.forEach((key, index) => {
            
            index < 3 ? rank[key] = products[key] : rank["其它"] += products[key]

        });
    
        Object.keys(rank).forEach(key => chartData.push([key, +(rank[key]/total*100).toFixed(2)]));

    }

    const chart = c3.generate({
        bindto: "#pie-chart",
        data: {
            columns: chartData,
            type: 'pie',
        },
    })

}

// 渲染訂單列表

function renderOrders(data) {
    
    // console.log(data);

    let str = '';

    if (data.length) {
        orders.innerHTML = /*html*/`
        <div class="text-end mb-20">
            <button type="button" class="btn btn-outline">清除全部訂單</button>
        </div>
        <table class="order-table w-100">
            <thead>
                <tr>
                    <th>訂單編號</th>
                    <th>聯絡人</th>
                    <th>聯絡地址</th>
                    <th>電子郵件</th>
                    <th>訂單品項</th>
                    <th width="10%">訂單日期</th>
                    <th>訂單狀態</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody id="order-content"></tbody>
        </table>`;
        const tableContent = document.querySelector('#order-content');
        let content = '';
        data.forEach(item => content += /*html*/`
        <tr data-id="${item.id}">
            <td class="text-center">
                <div>${item.createdAt}</div>
            </td>
            <td>
                <div>${item.user.name}<br>${item.user.tel}</div>
            </td>
            <td class="text-center">
                <div>${item.user.address}</div>
            </td>
            <td class="text-center">
                <div>${item.user.email}</div>
            </td>
            <td>
                <ul class="order-detail">
                ${item.products.map(product => `<li>
                <div class="mb-6">${product.title}</div>
                <div class="fs-7">× ${product.quantity}</div>
                </li>`).join('')}
                </ul>
            </td>
            <td class="text-center">
                <div>${moment(item.createdAt*1000).format('YYYY/MM/DD HH:mm:ss')}</div>
            </td>
            <td class="text-center">
                <div>
                    <a href="#"
                       class="order-status"
                       title="上次修改日期：${moment(item.updatedAt*1000).format('YYYY/MM/DD HH:mm:ss')}">${item.paid ? '已出貨' : '處理中'}</a>
                </div>
            </td>
            <td class="text-center">
                <div>
                    <button class="btn btn-red">刪除</button>
                </div>
            </td>
        </tr>`);
        tableContent.innerHTML = content;
    } else {
        str = /*html*/`<p class="text-center fs-4">目前沒有訂單記錄</p>`;
        orders.innerHTML = str;
    }

}

// 監聽訂單表格

function ordersListener(e) {

    const { nodeName } = e.target;

    if (nodeName !== 'A' && nodeName !== 'BUTTON') return;
    else {
        e.preventDefault();
        const id = e.target.closest('tr')?.dataset.id;
        const status = e.target.textContent;
        nodeName === 'A' ? toggleStatus(id, status) : deleteOrders(id);
    }

}

// 修改訂單狀態

function toggleStatus(id, status) {

    axios.put(apiUrl, {
        data: {
            id,
            paid: status === '處理中' ? true : false,
        }
    }, headers)
    .then(res => {
        // console.log(res);
        toastMessage('success','成功修改訂單狀態！');
        renderOrders(sortOrders(res.data.orders));
    })
    .catch(error => errorHandle(error))

}

// 刪除單筆或全部訂單

function deleteOrders(id) {

    showConfirmMessage({
        title: `確定刪除${id ? '這筆' : '全部'}訂單？`,
        icon: 'warning',
        text: '此操作無法復原',
        fn: async() => {
            try {

                const res = await axios.delete(`${apiUrl}${id ? `/${id}` : ''}`, headers);
                toastMessage('success','成功刪除訂單！');
                getOrders();

            } catch(error) { errorHandle(error) }
        }
    })

}