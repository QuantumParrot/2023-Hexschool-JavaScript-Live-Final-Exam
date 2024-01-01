import { debounce, toThousands } from "./js/helper.js";
import { toastMessage, tweakMessage, showConfirmMessage, errorHandle } from "./js/message.js";
import orderConstraints from "./js/validation.js";

const apiUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/ataraxia';

let productData = [];
let cartsData = [];

// 環境初始化

(function init(){

    renderRecommendation();
    getProducts();
    getCarts();

})();

// 取得商品列表

function getProducts() {
    axios.get(`${apiUrl}/products`)
    .then(res => {
        productData = res.data.products;
        renderCategoryOptions(productData);
        renderProducts(productData);
    })
    .catch(error => errorHandle(error))
}

// 動態新增篩選按鈕＋綁定監聽事件

const category = document.querySelector('#category');

function renderCategoryOptions(data) {
    
    const categories = [];
    data.forEach(item => categories.includes(item.category) ? null : categories.push(item.category));
    
    categories.forEach(item => {
        const option = document.createElement('option');
        option.setAttribute('value', item);
        option.textContent = item;
        category.appendChild(option);
    })

}

category.addEventListener('change', function(e){

    if (e.target.value === '全部') {

        renderProducts(productData);

    } else {

        renderProducts(productData.filter(item => item.category === e.target.value));

    }

});

// 渲染商品列表

const productsList = document.querySelector('#products');

function renderProducts(data) {

    let str = '';
    
    data.forEach(item => str += /*html*/`
    <li class="card">
        <div class="card-img">
            <img src="${item.images}" alt="${item.title}">
        </div>
        <div class="mb-8">
            <button data-id="${item.id}" class="btn btn-primary w-100">加入購物車</button>
        </div>
        <div class="fs-4">
            <h4 class="mb-8">${item.title}</h4>
            <p class="text-delete mb-8">NT$${toThousands(item.origin_price)}</p>
            <p class="fs-2 mb-8">NT$${toThousands(item.price)}</p>
        </div>
    </li>
    `);

    productsList.innerHTML = str;

}

productsList.addEventListener('click', function(e){

    if (e.target.nodeName === 'BUTTON') { addCartItem(e.target) }

})

// 取得購物車資料

function getCarts() {
    axios.get(`${apiUrl}/carts`)
    .then(res => {

        renderCarts(res.data);

    })
    .catch(error => errorHandle(error))
}

// 渲染購物車資料

const debouncer = debounce(checkItemQty, 500);

function renderCarts(data) {

    cartsData = data.carts;
    
    let str = '';

    if (data.carts.length) {

        carts.innerHTML = /*html*/`
        <table class="cart-table w-100 mb-20">
            <thead>
                <tr>
                    <th width="45%">品項</th>
                    <th width="15%">單價</th>
                    <th width="15%">數量</th>
                    <th width="15%">金額</th>
                    <th width="10%"></th>
                </tr>
            </thead>
            <tbody id="cart-content"></tbody>
        </table>
        <div class="d-flex jc-between ai-center">
            <button class="delete-all btn btn-outline">刪除所有品項</button>
            <div class="d-flex ai-center gap-55">
                <p>總金額</p>
                <p id="total" class="fs-2">NT$${toThousands(data.finalTotal)}</p>
            </div>
        </div>
        `;    
        const tableContent = document.querySelector('#cart-content');
        data.carts.forEach(item => str += /*html*/`
        <tr data-id="${item.id}">
            <td>
                <div class="d-flex ai-center gap-15">
                    <img src="${item.product.images}" alt="${item.product.title}"
                         style="width: 80px; height: 80px;">
                    <h4>${item.product.title}</h4>
                </div>
            </td>
            <td><div>${toThousands(item.product.price)}</div></td>
            <td>
                <div class="d-flex ai-center gap-8">
                    <form class="qty-form">
                        <input class="input-small" type="number" name="quantity" value="${item.quantity}" min=1>
                    </form>
                </div>
            </td>
            <td><div>${toThousands(item.product.price*item.quantity)}</div></td>
            <td class="text-center">
                <button class="btn">
                    <span class="delete fs-2 material-icons">clear</span>
                </button>
            </td>
        </tr>
        `);
        tableContent.innerHTML = str;

        const qtyForms = tableContent.querySelectorAll('.qty-form');
        qtyForms.forEach(form => form.addEventListener('change', (e) => { debouncer(e) }));

    } else {

        str = /*html*/`
        <p class="text-center fs-4">
        購物車內目前沒有商品哦！去<a href="#products">逛逛</a>吧！</p>`;
        carts.innerHTML = str;

    }

}

// 渲染好評推薦資料 (用寫死的資料練習看看)

function renderRecommendation() {

    const recommendation = [
        {
            id: 1,
            customer: "王六角",
            customerImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/I9L7WOr.png?raw=true",
            product: "Jordan 雙人床架",
            productImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/NiUXr6L.png?raw=true",
            comment: "CP值很高。"
        },
        {
            id: 2,
            customer: "Leaf",
            customerImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/CUFGfay.png?raw=true",
            product: "Antony 雙人床架",
            productImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/oJb4G1d.png?raw=true",
            comment: "很喜歡～還有送三年保固～"
        },
        {
            id: 3,
            customer: "美濃鄧子琪",
            customerImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/8WwZsLS.png?raw=true",
            product: "Charles 系列儲物組合",
            productImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/3IATkJG.png?raw=true",
            comment: "廚房必備美用品！"
        },
        {
            id: 4,
            customer: "isRaynotArray",
            customerImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/NycuPVy.png?raw=true",
            product: "Antony 雙人床架",
            productImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/Ps8JKlF.png?raw=true",
            comment: "物超所值！"
        },
        {
            id: 5,
            customer: "程鮭魚",
            customerImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/zdFOQIv.png?raw=true",
            product: "Louvre 雙人床架",
            productImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/Ed7bxLr.png?raw=true",
            comment: "租屋用剛剛好" 
        },
        {
            id: 6,
            customer: "小杰",
            customerImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/W7fyzp2.png?raw=true",
            product: "Louvre 雙人床架",
            productImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/oJb4G1d.png?raw=true",
            comment: "非常舒適，有需要會再回購"  
        },
        {
            id: 7,
            customer: "江八角",
            customerImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/8O1cOnG.png?raw=true",
            product: "Charles 雙人床架",
            productImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/kwIRna8.png?raw=true",
            comment: "品質不錯～" 
        },
        {
            id: 8,
            customer: "juni讚神",
            customerImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/C0NDvSA.png?raw=true",
            product: "Antony 床邊桌",
            productImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/npA3DgP.png?raw=true",
            comment: "讚ㄉ！" 
        },
        {
            id: 9,
            customer: "久安說安安",
            customerImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/hUsTZDm.png?raw=true",
            product: "Antony 單人床架",
            productImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/Ed7bxLr.png?raw=true",
            comment: "一個躺剛剛好。" 
        },
        {
            id: 10,
            customer: "PeiQun",
            customerImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/3ako6QX.png?raw=true",
            product: "Antony 雙人床架",
            productImg: "https://github.com/hexschool/js-training/blob/main/%E7%AC%AC%E4%B9%9D%E9%80%B1%E4%B8%BB%E7%B7%9A%E4%BB%BB%E5%8B%99%E5%9C%96%E5%BA%AB/kwIRna8.png?raw=true",
            comment: "睡起來很舒適" 
        }
    ];

    const topList = document.querySelector('.top-list');
    const bottomList = document.querySelector('.bottom-list');

    recommendation.forEach((item, index, array) => {

        const content = /*html*/`
        <li class="d-flex" style="min-width: 350px">
            <img src="${item.productImg}" alt="${item.product}">
            <div class="flex-grow-1 bg-white p-16">
                <div class="d-flex ai-center gap-8 mb-8">
                    <img src="${item.customerImg}" alt="${item.customer}"
                         style="width: 40px; height: 40px">
                    <div>
                        <p>${item.customer}</p>
                        <p class="fs-6 text-purple-dark">${item.product}</p>
                    </div>
                </div>
                <p>${item.comment}</p>
            </div>
        </li>`;

        if (item.id <= array.length/2) { topList.innerHTML += content }
        else { bottomList.innerHTML += content }

    });

}

// 監聽購物車表格

const carts = document.querySelector('#carts');
carts.addEventListener('click', cartsListener);

function cartsListener(e) {

    if (!e.target.closest('button')) return;

    const { classList } = e.target;

    if (classList.contains('delete-all')) {
        
        deleteAllCartItem(e.target);
            
    } else if (classList.contains('delete')) {

        const id = e.target.closest('tr').dataset.id;
        deleteCartItem(id);

    }

}

// 新增商品至購物車

function addCartItem(button) {

    const id = button.dataset.id;
    const target = cartsData.find(cart => cart.product.id === id);

    button.setAttribute('disabled','true');

    if (target) {

        let { id, quantity } = target;
        quantity ++
        changeItemQty(id, quantity);

    } else {

        axios.post(`${apiUrl}/carts`, {
            data: {
                productId: id,
                quantity: 1,
            }
        })
        .then(res => {
            toastMessage('success','成功加入購物車！');
            button.removeAttribute('disabled');
            getCarts();
        })
        .catch(error => { 
            errorHandle(error);
            button.removeAttribute('disabled');
        })

    }

    button.removeAttribute('disabled');

}

// 刪除購物車的商品

function deleteCartItem(id) {

    showConfirmMessage({
        title: '確定刪除商品？',
        icon: 'warning',
        fn: async() => {
            try {
                const res = await axios.delete(`${apiUrl}/carts/${id}`);
                toastMessage('success','成功刪除商品！');
                renderCarts(res.data);
            } catch(error) { errorHandle(error) }
        }
    })

}

function deleteAllCartItem(button) {

    showConfirmMessage({
        title: '確定刪除全部商品？',
        icon: 'warning',
        fn: async() => {
            try {
                button.setAttribute('disabled','true');
                const res = await axios.delete(`${apiUrl}/carts`);
                toastMessage('success','成功刪除全部商品！');
                renderCarts(res.data);
                button.removeAttribute('disabled');
            } catch(error) { 
                errorHandle(error);
                button.removeAttribute('disabled');
            }
        }
    })

}

// 修改商品數量

function checkItemQty(e) {

    const id = e.target.closest('tr').dataset.id;

    const currentValue = Number(e.target.getAttribute('value'));
    const newValue = Number(e.target.value);

    if (currentValue === newValue) return;

    const constraints = {
        quantity: {
            numericality: {
                strict: true,
                onlyInteger: true,
                greaterThanOrEqualTo: 1,
                message: "必須是不為零的正整數"
            }
        }
    }
    
    const error = validate({ quantity: newValue }, constraints);
    
    error ? 
    toastMessage('warning', tweakMessage(error.quantity[0])) : changeItemQty(id, newValue);

}

function changeItemQty(id, quantity) {
    axios.patch(`${apiUrl}/carts`, {
        data: {
            id,
            quantity
        }
    })
    .then(res => {

        toastMessage('success','成功修改商品數量！');
        getCarts();

        // 因為要及時修改儲存至全域變數的購物車資料，所以這裡無法使用 renderCarts(res.data)
    
    })
    .catch(error => errorHandle(error))
}

// 驗證表單

const form = document.querySelector('.order-form');
form.addEventListener('submit', checkOrder);

function checkOrder(e) {

    e.preventDefault();

    const errors = validate(e.target, orderConstraints);

    if (errors) {

        Object.keys(errors).forEach(item => {
            const element = e.target.querySelector(`[name=${item}]`);
            const feedback = element.nextElementSibling;
            feedback.textContent = tweakMessage(errors[item][0]);
        })

    } else { 
        
        const info = { user: {} };

        Object.keys(orderConstraints).forEach(attr => {
            const value = e.target.querySelector(`[name=${attr}]`).value.trim();
            info.user[attr] = value;
            info.time = new Date().toDateString();
        });

        createOrder(info);

    }

}

form.addEventListener('input', function(e){
    const feedback = e.target.nextElementSibling;
    feedback.textContent = '';
})

const inputs = form.querySelectorAll('[name]');

inputs.forEach(input => input.addEventListener('blur', function(e){

    const { name } = e.target;

    const error = validate(form, orderConstraints);
    
    if (error[name]) {

        const feedback = e.target.nextElementSibling;
        feedback.textContent = tweakMessage(error[name][0]);

    }

}))

// 新增訂單

function createOrder(data) {

    showConfirmMessage({
        title: '確定送出訂單？',
        icon: 'warning',
        fn: async() => {
            try {

                const res = await axios.post(`${apiUrl}/orders`, { data });
                toastMessage('success','感謝您的訂購！');
                form.reset();
                getCarts();

            } catch(error) { errorHandle(error) }
        }
    })

}