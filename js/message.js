// Sweet Alert 2 提示訊息視窗

export function toastMessage(icon, text) {
    Swal.fire({
        icon,
        text,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
    })
}

// Sweet Alert 2 提示錯誤訊息

export function errorHandle(error) { 

    // console.log(error);

    if (error.response?.data) { 
        
        const { message } = error.response.data;
        toastMessage('error', message);
    
    } else { console.log(error) }

}

// Sweet Alert 2 確認視窗

export function showConfirmMessage(config) {

    const { icon, title, text, fn } = config;

    Swal.fire({
        icon,
        title,
        text,
        showCancelButton: true,
        cancelButtonText:  '取消',
        confirmButtonText: '確定',
    }).then(result => {
        if (result.isConfirmed && typeof fn === 'function') { fn() }
    })

}

// 調整表單驗證的提示文字

export function tweakMessage(str) { return str.replace(/\w+/,'') }