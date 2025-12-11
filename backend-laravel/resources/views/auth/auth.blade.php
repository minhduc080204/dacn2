<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Eatzy</title>
    <meta content="" name="description">
    <meta content="" name="keywords">
    <!-- icon -->
    <link href="/storage/images/products/logo.png" rel="icon">
    <!-- Google Fonts -->
    <link href="https://fonts.gstatic.com" rel="preconnect">
    <!-- Vendor CSS Files -->
    <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
</head>
<style>
    .form-item {
        background-color: #e1f0f5;
        display: flex;
        padding: 7px !important;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .form-control.input {
        background-color: #e1f0f5;
        border: none !important;
    }

    .form-control.input:focus {
        outline: none !important;
        box-shadow: none !important;
        background-color: unset !important;
        border: none !important;
        background-color: #e1f0f5 !important;
    }

    .icon-login {
        background-color: #00B0B9;
        border-radius: 5px;
        display: flex;
        align-items: center;
    }

    .icon-login>i {
        color: white;
    }

    .form-control.button {
        background-color: #00B0B9;
        border: none !important;
        padding: 14px;
        font-size: 14px;
        font-weight: bold;
        color: white;
    }
</style>

<body>
    <div class="container w-50">
        <div class="">
            <div class="my-5">
                <h1 class="fw-bolder">Đăng nhập!</h1>
                <p class="text muted">Đăng nhập vào quản trị viên</p>
            </div>
            <div>
                <form action="{{ route('account.doLogin') }}" method="post">
                    @csrf
                    <div class="form-item">
                        <span class="icon-login px-1"><i class="bi bi-envelope fs-6 p-1"></i></span>
                        <input type="text" class="form-control input" name="email" placeholder="abc@gmail.com">
                    </div>
                    <div class="form-item">
                        <span class="icon-login px-1"><i class="bi bi-key fs-6 p-1"></i></span>
                        <input type="password" class="form-control input" name="password" placeholder="*******">
                    </div>
                    <div class="text-end">
                        <a href="" style="color:#00B0B9; font-size:12px;">Quên mật khẩu?</a>
                    </div>
                    <div class="mt-3">
                        <button class="form-control button">Đăng nhập</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>

</html>
