const constraints = {
    name: {
        presence: {
            allowEmpty: false,
            message: '必填！'
        }
    },
    tel: {
        presence: {
            allowEmpty: false,
            message: '必填！'
        },
        format: {
            pattern: /^09\d{8}/,
            message: '必須為 09 開頭的十碼手機門號'
        }
    },
    email: {
        presence: {
            allowEmpty: false,
            message: '必填！'
        },
        email: {
            message: '格式不正確'
        }
    },
    address: {
        presence: {
            allowEmpty: false,
            message: '必填！'
        }
    },
    payment: {
        presence: {
            allowEmpty: false,
            message: '必選！'
        }
    }
};

export default constraints;