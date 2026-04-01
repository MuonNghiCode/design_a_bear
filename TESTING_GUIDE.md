# Design A Bear - Huong dan test tong the (E2E + Regression)

## 1) Muc tieu

Tai lieu nay giup tester kiem thu toan bo luong chinh cua he thong:

- User flow: dang nhap, mua hang, checkout, thanh toan, profile, review.
- Staff flow: quan ly review, orders, products, reports.
- Admin flow: quan ly review, orders, products, customers, staff, analytics, settings.

## 2) Moi truong test

- Frontend: http://localhost:3000
- Backend API: http://localhost:7002
- Runtime: Next.js App Router

### 2.1 Bien moi truong can co

Tao/cap nhat file .env:

- NEXT_PUBLIC_BASE_URL=http://localhost:7002
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud_name>
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<upload_preset>
- NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google_client_id>

### 2.2 Lenh chay

- npm install
- npm run dev

## 3) Tai khoan test de nghi

Can chuan bi toi thieu 3 tai khoan:

- User role = user
- User role = staff
- User role = admin

Can co du lieu san pham, carts, orders, reviews de test.

## 4) Danh sach route can test

### 4.1 Public/User

- /
- /auth
- /products
- /products/[id]
- /customize
- /checkout
- /success
- /cancel
- /profile
- /story
- /connect

### 4.2 Staff

- /staff
- /staff/orders
- /staff/products
- /staff/reviews
- /staff/reports

### 4.3 Admin

- /admin
- /admin/orders
- /admin/products
- /admin/customers
- /admin/staff
- /admin/reviews
- /admin/analytics
- /admin/settings

## 5) Smoke test nhanh (phai pass truoc)

1. Trang chu load khong crash.
2. /products load danh sach.
3. Dang nhap thanh cong voi user, staff, admin.
4. /checkout mo duoc va submit duoc voi gio hang co item.
5. /staff/reviews va /admin/reviews hien thi table va co du lieu.
6. /profile load profile khong loi.

## 6) Chi tiet test theo luong

## 6.1 Auth flow

### TC-AUTH-01 Dang nhap tai khoan thuong

- Precondition: co tai khoan user hop le.
- Steps:
  1. Mo /auth.
  2. Nhap email/password dung.
  3. Bam Dang nhap.
- Expected:
  - Dang nhap thanh cong.
  - Dieu huong dung role (user -> /, staff -> /staff, admin -> /admin).

### TC-AUTH-02 Dang nhap sai mat khau

- Steps: Dang nhap voi password sai.
- Expected: hien thong bao loi ro rang, khong vao he thong.

### TC-AUTH-03 Google login

- Precondition: NEXT_PUBLIC_GOOGLE_CLIENT_ID dung.
- Steps: bam nut Google va chon tai khoan.
- Expected: login thanh cong hoac vao flow bo sung profile neu backend tra registrationToken.

## 6.2 Product + Cart + Checkout flow

### TC-CK-01 Them san pham vao gio

- Steps:
  1. Mo /products.
  2. Vao chi tiet 1 san pham.
  3. Them vao gio.
- Expected: gio hang cap nhat dung so luong va gia.

### TC-CK-02 Checkout load thong tin profile + address

- Precondition: user da co profile/address.
- Steps: vao /checkout.
- Expected:
  - Ho ten/sdt/dia chi duoc prefill dung.
  - Tinh/thanh va quan/huyen map dung vao dropdown.
  - Dia chi cu the KHONG bi chen city/state vao cung field street.

### TC-CK-03 Dat hang COD

- Steps: chon COD va dat hang.
- Expected: tao don thanh cong, hien man hinh ket qua hop le.

### TC-CK-04 Thanh toan online - success

- Steps: thanh toan online -> quay ve /success?....
- Expected:
  - Hien trang thai thanh toan thanh cong.
  - Ma don + tong tien hien thi dung.
  - Cart duoc clear sau khi confirm thanh cong.

### TC-CK-05 Thanh toan online - cancel

- Steps: huy giao dich -> quay ve /cancel?code=..&id=..&cancel=true&status=CANCELLED&orderCode=....
- Expected:
  - Trang cancel hien dung thong tin callback.
  - Co CTA quay lai checkout, tiep tuc mua sam, ve trang chu.

## 6.3 Profile flow

### TC-PRO-01 Xem profile

- Steps: vao /profile.
- Expected: thong tin profile load tu API /api/Users/profile.

### TC-PRO-02 Cap nhat profile

- Steps:
  1. Sua fullName, phone, thong tin ca nhan.
  2. Luu.
- Expected:
  - Goi PUT /api/Users/profile thanh cong.
  - Hien toast thanh cong/that bai.
  - Header/avatar/name dong bo ngay sau khi save.

### TC-PRO-03 Validate phone

- Steps: nhap so dien thoai sai dinh dang va save.
- Expected: bi chan, hien thong bao hop le.

### TC-PRO-04 Address replacement policy

- Steps: cap nhat dia chi moi trong profile.
- Expected: dia chi cu duoc thay the theo policy (khong de trung lap ngoai mong doi).

## 6.4 User Review flow (Product + Profile)

### TC-REV-U-01 Hien thi review theo product

- Steps: vao trang product detail co review.
- Expected: danh sach review load dung, co thong tin rating/title/body/status/replies.

### TC-REV-U-02 Quyen can-review

- Steps: vao product detail voi account khong du dieu kien review.
- Expected: form viet review bi an/disable theo API can-review.

### TC-REV-U-03 Tao/Sua/Xoa review

- Steps:
  1. Tao review moi.
  2. Sua review vua tao.
  3. Xoa review vua tao.
- Expected:
  - API create/update/delete thanh cong.
  - UI cap nhat dung.

### TC-REV-U-04 Profile tab Reviews

- Steps: vao /profile tab reviews.
- Expected:
  - Load du danh gia cua user.
  - Review co status PUBLISHED/REJECTED thi khong cho edit/delete.

## 6.5 Staff Review Moderation flow

### TC-REV-S-01 Danh sach review

- Route: /staff/reviews
- Expected:
  - Load bang review tu GET /api/Reviews/all.
  - Co pagination dung pageIndex/pageSize.

### TC-REV-S-02 Map ten that

- Expected:
  - User/Product hien ten that (map tu API users/products), khong hien userId/productId tren UI.

### TC-REV-S-03 Filter nhanh

- Expected co cac tab:
  - Tat ca
  - Cho duyet
  - Chua phan hoi
  - Da duyet
  - Tu choi

### TC-REV-S-04 Kiem tra review da reply/chua

- Expected:
  - He thong goi GET /api/Reviews/{id}/replies.
  - Trang thai Da phan hoi/Chua phan hoi tinh theo do dai danh sach replies.

### TC-REV-S-05 Approve/Reject

- Steps: thao tac review PENDING.
- Expected:
  - Approve -> PUT /api/Reviews/{id}/approve thanh cong.
  - Reject -> PUT /api/Reviews/{id}/reject thanh cong.
  - UI refresh dung.

### TC-REV-S-06 Reply review

- Steps: mo modal reply va gui.
- Expected:
  - POST /api/Reviews/{id}/reply gui payload gom:
    - reviewId
    - staffUserId
    - content
  - Reply thanh cong va review hien la da phan hoi.

## 6.6 Admin Review Moderation flow

### TC-REV-A-01 Tuong duong staff

- Route: /admin/reviews
- Expected:
  - Cung bo chuc nang nhu staff: list, filter, unanswered, approve/reject, reply, map ten that.
  - Van dung staffUserId (id user dang login admin/staff) khi reply.

## 6.7 Staff Orders flow

### TC-ORD-S-01 List + filter + search

- Route: /staff/orders
- Expected: hien list don, filter theo tab trang thai, search dung.

### TC-ORD-S-02 Advance status

- Expected:
  - pending -> packing
  - packing/processing -> shipping
  - cap nhat thanh cong + toast.

## 6.8 Admin pages smoke

Test mo va tuong tac co ban:

- /admin/products
- /admin/orders
- /admin/customers
- /admin/staff
- /admin/analytics
- /admin/settings
  Expected: khong crash, du lieu load, khong loi runtime.

## 7) Regression checklist sau moi lan merge

1. Auth role redirect van dung.
2. Checkout callback success/cancel van dung.
3. Profile update + toast + sync header van dung.
4. User review create/update/delete van dung.
5. Staff reviews moderation van dung.
6. Admin reviews moderation van dung.
7. Khong route nao trong danh sach o muc 4 bi trang trang hoac runtime error.

## 8) Goi y kiem tra API bang DevTools

Trong Network, xac nhan cac endpoint sau duoc goi dung:

- GET /api/Reviews/all
- GET /api/Reviews/{id}/replies
- PUT /api/Reviews/{id}/approve
- PUT /api/Reviews/{id}/reject
- POST /api/Reviews/{id}/reply
- GET/PUT /api/Users/profile
- GET /api/Addresses/my-addresses
- Payment create/confirm endpoint trong luong checkout

## 9) Mau bao loi cho tester

Khi bug, bao cao theo format:

- Tieu de: [Module] Mo ta ngan
- Moi truong: local/staging + branch + commit (neu co)
- Steps to reproduce
- Actual result
- Expected result
- Network request/response lien quan
- Screenshot/recording

## 10) Tieu chi pass release

- 100% test case smoke pass.
- 100% test case review moderation (staff + admin) pass.
- Khong con bug blocker/critical.
- Cac bug major da co workaround duoc xac nhan.
