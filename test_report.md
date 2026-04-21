# Báo cáo kết quả kiểm thử: Quản lý Tồn kho & Chi phí

Hệ thống đã được kiểm thử thông qua các Unit Test để đảm bảo tính chính xác của luồng giữ hàng (Reservation) và trừ kho (Deduction).

## Tóm tắt kết quả
- **Tổng số kịch bản**: 14
- **Thành công**: 14
- **Thất bại**: 0

---

## Các kịch bản kiểm thử chi tiết

### 1. Dịch vụ Tồn kho (InventoryService)
| Kịch bản | Mô tả | Kết quả |
| :--- | :--- | :--- |
| **Bảo lưu hàng thành công** | Khi kho (`OnHand - Reserved`) đủ số lượng, tăng `Reserved`. | ✅ PASS |
| **Bảo lưu hàng thất bại** | Khi kho không đủ, ném ra `InvalidOperationException`. | ✅ PASS |
| **Xác nhận trừ kho** | Sau khi thanh toán, giảm đồng thời `OnHand` và `Reserved`. | ✅ PASS |
| **Giải tỏa bảo lưu** | Khi đơn hủy, giảm `Reserved` và đảm bảo không âm. | ✅ PASS |

### 2. Quy trình đặt hàng (OrderService)
| Kịch bản | Mô tả | Kết quả |
| :--- | :--- | :--- |
| **Kiểm tra kho trước khi tạo đơn** | Nếu bất kỳ món nào trong giỏ hàng hết hàng, chặn tạo đơn và báo lỗi chi tiết. | ✅ PASS |
| **Bảo lưu hàng khi tạo đơn** | Tự động gọi `ReserveStockAsync` cho từng sản phẩm trong transaction. | ✅ PASS |
| **Tính toàn vẹn giao dịch** | Nếu có lỗi xảy ra (ví dụ: lỗi DB), toàn bộ quá trình giữ hàng sẽ được Rollback. | ✅ PASS |

### 3. Quy trình thanh toán (PaymentService)
| Kịch bản | Mô tả | Kết quả |
| :--- | :--- | :--- |
| **Trừ kho vĩnh viễn** | Khi nhận Webhook thành công, `OnHand` được trừ theo đúng số lượng đã bán. | ✅ PASS |
| **Cập nhật doanh số** | `TotalSales` của sản phẩm và chip AI được tăng chính xác. | ✅ PASS |

---

## Kết luận
Cơ chế quản lý tồn kho hoạt động ổn định, đảm bảo không xảy ra tình trạng bán quá số lượng (Overselling) và theo dõi sát sao dòng hàng. Các trường chi phí (`BaseCost`, `AssemblyCost`) đã sẵn sàng để phục vụ báo cáo doanh thu.
