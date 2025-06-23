# mô tả hệ thống website bán hàng shopmrkin  
## Yêu cầu chức năng của hệ thống:  
1. Quản lý tài khoản:  
    - Lưu thông tin người dùng.
    - Kiểm soát đăng nhập.
    - Phân quyền.

2. Quản lý sản phẩm:
    - Lưu thông tin về sản phẩm.
    - Phân quyền ai có thể tác động vào một sản phẩm nào đó.

3. Quản lý bán hàng:
    - Cho phép người dùng mua hàng.
    - Lưu thông tin mua hàng của người dùng.
    - Sử dụng mã giảm giá cho đơn hàng.
    - Tạo đơn hàng thanh toán online.

4. Quản lý mã giảm giá:
    - Lưu chữ thông tin về mã giảm giá.
    - Lượt sử dụng của mã giảm giá đó.

4. Các chức năng khác:
    - Tự động tạo đơn GHTK, GHN,...
    - Thanh toán online.
    - Đăng nhập bằng google.

## Phân tích cơ sở dữ liệu.

### Chức năng quản lý người dùng + phân quyền.
**Mô tả chức năng:**  
Hệ thống lưu thông tin của người dùng và dùng thông tin đó để kiểm soát đăng nhập và phân vai trò, quyền hạn mà người dùng có. 

1. Bảng Users: bảng này lưu trữ thông tin người dùng.
    - userId: Mã định danh người dùng.
    - nickname: Tên tài khoản, tên này dùng để hiển thị,
    - phoneNumber: Số điện thoại liên kết với tài khoản, số này được dùng như tên đăng nhập.
    - email: Tài khoản email, dùng để cấp lại mật khẩu hoặc đăng nhập bằng Oauth2.
    - password: Mật khẩu truy cập tài khoản.
    - createdAt: Ngày tài khoản được tạo.
    - updatedAt: Lần sửa đổi thông tin cuối cùng.

2. Bảng Roles: bảng này chứa các vai trò ví dụ như ADMIN, CUSTOMER, ATTRIBUTOR,...
    - roleId: ID của role.
    - roleName: tên của role.

3. Bảng Permissions: bảng này chứa thông tin về các quyền cụ thể ví dụ như: add_product, modify_product.
    - permissionId: ID của permission.
    - permissionName: tên của permission.

4. Bảng UsersRoles: bảng này liên kết Users và Roles, một User có thể có nhiều Role và một Role cũng có nhiều User sở hữu.
    - userId: ID của user cần liên kết.
    - roleId: ID của role cần liên kết.

5. Bảng RolesPermissions: bảng này liên kết Roles và Permissions, một Role có thể có nhiều quyền và một quyền cũng có thể thuộc về nhiều Role.
    - roleId: ID của role cần liên kết.
    - permissionId: ID của permission cần liên kết.

---
### Chức năng quản lý sản phẩm.
**Mô tả chức năng:**  
Hệ thống cần cho phép đăng tải sản phẩm để bán. Sản phẩm cần có những thông tin như: Mã SP, Tên, phân loại của sản phẩm(màu sắc,...), gian hàng thuộc (Đồ điện, Thời trang), ai là người đăng sản phẩm, số lượng còn lại trong kho, số lượng đã bán, đánh giá của người dùng,
