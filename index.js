const apiUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/ataraxia';

const carts = document.querySelector('#carts');
carts.addEventListener('click', cartsListener);

const form = document.querySelector('.order-form');
form.addEventListener('submit', checkOrder);

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
        renderCategoryOptions(res.data.products);
        renderProducts(res.data.products);
    })
    .catch(error => { console.log(error) })
}

// 動態新增篩選按鈕＋綁定監聽事件

function renderCategoryOptions(data) {

    const category = document.querySelector('#category');
    
    const categories = [];
    data.forEach(item => categories.includes(item.category) ? null : categories.push(item.category));
    
    categories.forEach(item => {
        const option = document.createElement('option');
        option.setAttribute('value', item);
        option.textContent = item;
        category.appendChild(option);
    })

    category.addEventListener('change', function(e){

       if (e.target.value === '全部') {

           renderProducts(data);

       } else {

           renderProducts(data.filter(item => item.category === e.target.value));

       }

    });

}

// 渲染商品列表

function renderProducts(data) {

    const productsList = document.querySelector('#products');
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

    productsList.addEventListener('click', function(e){
        if (e.target.nodeName === 'BUTTON') { addCartItem(e.target.dataset.id) }
    })

}

// 取得購物車資料

function getCarts() {
    axios.get(`${apiUrl}/carts`)
    .then(res => {
        renderCarts(res.data);
    })
    .catch(error => { console.log(error) })
}

// 渲染購物車資料

function renderCarts(data) {

    let str = '';

    if (data.carts.length) {

        carts.innerHTML = /*html*/`
        <table class="cart-table w-100 mb-20">
            <thead>
                <tr>
                    <th width="40%">品項</th>
                    <th width="15%">單價</th>
                    <th width="20%">數量</th>
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
                    <form>
                        <input type="number"
                               class="input-small"
                               name="quantity"
                               value="${item.quantity}"
                               min="1">
                        <button type="submit" class="change-qty btn btn-primary-small">修改數量</button>
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

function cartsListener(e) {

    e.preventDefault();

    if (!e.target.closest('button')) return;

    const { classList } = e.target;

    if (classList.contains('delete-all')) {
        
        deleteAllCartItem();
            
    } else if (classList.contains('delete')) {

        const id = e.target.closest('tr').dataset.id;
        deleteCartItem(id);

    } else if (classList.contains('change-qty')) {

        const id = e.target.closest('tr').dataset.id;

        const form = e.target.closest('form');
        const currentValue = Number(form.querySelector('input').getAttribute('value'));
        const newValue = Number(form.querySelector('input').value);

        if (currentValue === newValue) return;

        const constraints = {
            quantity: {
                numericality: {
                    strict: true,
                    onlyInteger: true,
                    greaterThanOrEqualTo: 1,
                    message: "數量必須是不為零的正整數"
                }
            }
        }
        
        const error = validate(form, constraints);
        
        error ? 
        toastMessage('warning', tweakMessage(error.quantity[0])) : changeItemQty(id, newValue);

    }

}

// 新增商品至購物車

function addCartItem(id) {
    axios.post(`${apiUrl}/carts`, {
        data: {
            productId: id,
            quantity: 1,
        }
    })
    .then(res => {
        toastMessage('success','成功加入購物車！');
        getCarts();
    })
    .catch(error => { console.log(error) })
}

// 刪除購物車的商品

function deleteCartItem(id) {
    Swal.fire({
        icon: 'warning',
        title: '確定刪除？',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '確定',
        showLoaderOnConfirm: true,
        preConfirm: async() => {
            try {

                const res = await axios.delete(`${apiUrl}/carts/${id}`);
                toastMessage('success','成功刪除商品！');
                getCarts();

            } catch(error) { console.log(error) }
        }
    })
}

function deleteAllCartItem() {
    Swal.fire({
        icon: 'warning',
        title: '確定刪除全部商品？',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '確定',
        showLoaderOnConfirm: true,
        preConfirm: async() => {
            try {

                const res = await axios.delete(`${apiUrl}/carts`);
                toastMessage('success','成功刪除全部商品！');
                getCarts();
                
            } catch(error) { console.log(error) }
        }
    }) 
}

// 修改商品數量

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
    
    })
    .catch(error => { console.log(error) })
}

// 新增訂單

function checkOrder(e) {

    e.preventDefault();

    const constraints = {
        name: {
            presence: {
                message: '必填！'
            }
        },
        tel: {
            presence: {
                message: '必填！'
            }
        },
        email: {
            presence: {
                message: '必填！'
            },
            email: {
                message: '格式不正確！'
            }
        },
        address: {
            presence: {
                message: '必填！'
            }
        },
        payment: {
            presence: {
                message: '必選！'
            }
        }

    };

    const errors = validate(e.target, constraints);

    if (errors) {

        Object.keys(errors).forEach(item => {
            const element = e.target.querySelector(`[name=${item}]`);
            const feedback = element.nextElementSibling;
            feedback.textContent = tweakMessage(errors[item][0]);
        })

    } else { 
        
        const info = { user: {} };

        Object.keys(constraints).forEach(attr => {
            const value = e.target.querySelector(`[name=${attr}]`).value;
            info.user[attr] = value;
            info.time = new Date().toDateString();
        });

        createOrder(info);

    }

}

function createOrder(data) {
    Swal.fire({
        icon: 'warning',
        title: '確定送出訂單？',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '確定',
        showLoaderOnConfirm: true,
        preConfirm: async() => {
            try {

                const res = await axios.post(`${apiUrl}/orders`, { data });
                toastMessage('success','感謝您的訂購！');
                form.reset();
                getCarts();

            } catch(error) { 
                
                console.log(error);
                toastMessage('error', error.response.data.message);
            
            }
        }
    })
}

form.addEventListener('input', function(e){
    const feedback = e.target.nextElementSibling;
    feedback.textContent = '';
})

// 提示訊息視窗

function toastMessage(icon, text) {
    Swal.fire({
        icon,
        text,
        toast: true,
        showConfirmButton: false,
        timer: 1500,
    })
}

// 千分位

function toThousands(num) {
    return num.toString().split('.')
           .map((item, index) => index === 0 ? item.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : item)
           .join('.');
}

// 調整表單驗證提示文字

function tweakMessage(str) {
    return str.replace(/\w+/,'');
}