"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useCart } from "@/contexts/CartContext";
import {
  IoArrowBack,
  IoArrowForward,
  IoCheckmarkCircle,
  IoLockClosedOutline,
} from "react-icons/io5";
import { PawPrint, fmt } from "./checkout.atoms";
import { FREE_SHIP, deliverySchema } from "./checkout.config";
import type { DeliveryForm } from "./checkout.types";
import { StepTracker } from "./StepTracker";
import { StepDelivery } from "./StepDelivery";
import { StepPayment } from "./StepPayment";
import { StepConfirm } from "./StepConfirm";
import { SuccessScreen } from "./SuccessScreen";
import { OrderSummary } from "./OrderSummary";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { userService } from "@/services/user.service";
import { addressService } from "@/services/address.service";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { shippingService } from "@/services/shipping.service";
import { inventoryService } from "@/services/inventory.service";
import { STORAGE_KEYS } from "@/constants";
import type { Address } from "@/types";
import { normalizePhoneNumber } from "@/utils/address";
/*  Main Component */
export default function CheckoutClient() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<DeliveryForm>({
    name: "",
    phone: "",
    email: "",
    province: "",
    provinceName: "",
    district: "",
    districtName: "",
    ward: "",
    wardName: "",
    address: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupons, setAppliedCoupons] = useState<
    {
      code: string;
      productDiscount: number;
      shippingDiscount: number;
      totalDiscount: number;
      discountType: string;
    }[]
  >([]);
  const [agreed, setAgreed] = useState(false);
  const [showDeliveryErrors, setShowDeliveryErrors] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(
    () => "DAB" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  );

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, totalPrice, clearCart, totalItems, closeCart } = useCart();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [resolvedAddressId, setResolvedAddressId] = useState<string | null>(
    null,
  );

  // Calculated from applied coupons
  const totalProductDiscount = appliedCoupons.reduce(
    (sum, c) => sum + c.productDiscount,
    0,
  );
  const totalShippingDiscount = appliedCoupons.reduce(
    (sum, c) => sum + c.shippingDiscount,
    0,
  );
  const DISCOUNT = totalProductDiscount + totalShippingDiscount;
  const FINAL_TOTAL =
    totalPrice + (shippingFee - totalShippingDiscount) - totalProductDiscount;
  const couponApplied = appliedCoupons.length > 0;

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  useEffect(() => {
    const cancel = searchParams.get("cancel") || "false";
    const status = searchParams.get("status") || "";
    const orderCodeFromQuery =
      searchParams.get("orderCode") ||
      searchParams.get("paymentCode") ||
      searchParams.get("code");

    if (!orderCodeFromQuery) return;

    const handlePaymentReturn = async () => {
      try {
        setSubmitting(true);

        // 1. Mark as CANCELLED if cancelled or failed to trigger backend stock release
        if (cancel === "true" || (status && status.toUpperCase() !== "PAID")) {
          // No manual stock release here, handled by status update below
        }

        const pendingOrder = localStorage.getItem(
          STORAGE_KEYS.PENDING_PAYMENT_ORDER,
        );

        if (cancel === "true" || (status && status.toUpperCase() !== "PAID")) {
          if (pendingOrder) {
            try {
              const parsed = JSON.parse(pendingOrder);
              if (parsed?.orderDetails?.orderId) {
                await orderService.cancelOrder(parsed.orderDetails.orderId);
              }
            } catch {}
          }
          localStorage.removeItem(STORAGE_KEYS.PENDING_PAYMENT_ORDER);
          toast.error(
            cancel === "true"
              ? "Bạn đã hủy thanh toán. Đơn hàng đã chuyển CANCELLED."
              : `Thanh toán thất bại: ${status}`,
          );
          return;
        }

        const confirmRes =
          await paymentService.confirmPayment(orderCodeFromQuery);

        if (!confirmRes.isSuccess) {
          throw new Error(
            confirmRes.error?.description || "Xác nhận thanh toán thất bại",
          );
        }

        if (pendingOrder) {
          try {
            const parsed = JSON.parse(pendingOrder);
            setOrderDetails(parsed.orderDetails ?? null);
          } catch {}
          localStorage.removeItem(STORAGE_KEYS.PENDING_PAYMENT_ORDER);
        }

        if (orderPlaced) {
          // Order placed successfully
        }

        setOrderPlaced(true);
        clearCart();
        toast.success("Thanh toán thành công!");
      } catch (error: any) {
        toast.error(error.message || "Không thể xác nhận thanh toán");
      } finally {
        setSubmitting(false);
      }
    };

    handlePaymentReturn();
  }, [searchParams, clearCart, toast]);

  const handleApplyCoupon = async () => {
    const input = couponInput.trim();
    if (!input) {
      toast.error("Vui lòng nhập mã khuyến mãi");
      return;
    }

    // Split by comma, space or semicolon
    const codes = input
      .split(/[,\s;]+/)
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c !== "");

    if (codes.length === 0) {
      toast.error("Vui lòng nhập mã khuyến mãi hợp lệ");
      return;
    }

    setSubmitting(true);
    let successCount = 0;

    try {
      const userObj = localStorage.getItem(STORAGE_KEYS.USER);
      const userId = userObj ? JSON.parse(userObj).id : null;

      for (const code of codes) {
        // Check for duplicate in already applied list
        if (appliedCoupons.some((c) => c.code === code)) {
          toast.info(`Mã ${code} đã được áp dụng rồi.`);
          continue;
        }

        try {
          const res = await paymentService.applyPromotion({
            code,
            userId,
            orderAmount: totalPrice,
            shippingAmount: shippingFee,
          });

          if (res.isSuccess && res.value) {
            setAppliedCoupons((prev) => [
              ...prev,
              {
                code,
                productDiscount: res.value.productDiscount,
                shippingDiscount: res.value.shippingDiscount,
                totalDiscount: res.value.totalDiscount,
                discountType: res.value.discountType,
              },
            ]);
            successCount++;
            toast.success(`Áp dụng mã ${code} thành công!`);
          } else {
            toast.error(
              `Mã ${code}: ${res.error?.description || "Không hợp lệ"}`,
            );
          }
        } catch (err) {
          toast.error(`Mã ${code}: Lỗi kết nối`);
        }
      }

      if (successCount > 0) {
        setCouponInput("");
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi xử thực mã khuyến mãi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveCoupon = (codeToRemove: string) => {
    setAppliedCoupons((prev) => prev.filter((c) => c.code !== codeToRemove));
  };

  // Fetch initial profile & address data
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thanh toán.");
      router.push("/auth");
      return;
    }

    // Initial load logic

    if (totalItems === 0) {
      setLoadingInitial(false);
      return;
    }

    const loadData = async () => {
      try {
        let defaultForm = { ...form };

        // 1. Get Profile
        try {
          const profileRes = await userService.getProfile();
          if (profileRes.isSuccess && profileRes.value) {
            defaultForm.name = profileRes.value.fullName || "";
            defaultForm.email = profileRes.value.email || "";
          }
        } catch (e) {}

        // 2. Get Addresses
        try {
          const addressRes = await addressService.getMyAddresses();
          if (
            addressRes.isSuccess &&
            addressRes.value &&
            addressRes.value.length > 0
          ) {
            const defAddr =
              addressRes.value.find((a) => a.isDefaultShipping) ||
              addressRes.value[0];
            defaultForm.name = defAddr.fullName || defaultForm.name;
            defaultForm.phone = defAddr.phoneNumber || "";
            defaultForm.email = defAddr.email || defaultForm.email;
            defaultForm.address = defAddr.line1 || "";
            defaultForm.wardName = defAddr.line2 || "";
            defaultForm.note = defAddr.label || "";
            defaultForm.provinceName = defAddr.city || "";
            defaultForm.districtName = defAddr.state || "";
            setAddresses(addressRes.value);

            if (defAddr.addressId) {
              setResolvedAddressId(defAddr.addressId);
              calculateFee(defAddr.addressId);
            }
          }
        } catch (e) {}

        setForm(defaultForm);
      } finally {
        setLoadingInitial(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /*  Step transitions  */
  const transition = useCallback((nextStep: number, direction: 1 | -1) => {
    gsap.to(contentRef.current, {
      x: direction * -40,
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        setStep(nextStep);
        gsap.fromTo(
          contentRef.current,
          { x: direction * 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.38, ease: "power3.out" },
        );
      },
    });
  }, []);

  /**
   * Resolve shipping address (reuse existing address if equivalent or create a new one)
   * This is needed both for shipping fee calculation and final order placement.
   */
  const getOrResolveAddressId = async (): Promise<string> => {
    const userObj = localStorage.getItem(STORAGE_KEYS.USER);
    const userId = userObj ? JSON.parse(userObj).id : null;
    const normalizedPhone = normalizePhoneNumber(form.phone);

    const city = (form.provinceName || form.province).trim();
    const state = (form.districtName || form.district).trim();

    const normalizedCurrent = {
      fullName: form.name.trim().toLowerCase(),
      phoneNumber: normalizedPhone,
      email: (form.email || "").trim().toLowerCase(),
      line1: form.address.trim().toLowerCase(),
      line2: (form.wardName || "").trim().toLowerCase(),
      city: city.toLowerCase(),
      state: state.toLowerCase(),
    };

    let addrId =
      addresses.find((a) => {
        return (
          a.fullName.trim().toLowerCase() === normalizedCurrent.fullName &&
          normalizePhoneNumber(a.phoneNumber) ===
            normalizedCurrent.phoneNumber &&
          (a.email || "").trim().toLowerCase() === normalizedCurrent.email &&
          a.line1.trim().toLowerCase() === normalizedCurrent.line1 &&
          (a.line2 || "").trim().toLowerCase() === normalizedCurrent.line2 &&
          a.city.trim().toLowerCase() === normalizedCurrent.city &&
          a.state.trim().toLowerCase() === normalizedCurrent.state
        );
      })?.addressId ?? null;

    if (!addrId) {
      if (!userId) {
        throw new Error("Không xác định được người dùng để tạo địa chỉ.");
      }

      const createAddrRes = await addressService.createAddress({
        userId,
        fullName: form.name.trim(),
        phoneNumber: normalizedPhone,
        email: form.email.trim() || null,
        city,
        state,
        line1: form.address.trim(),
        line2: form.wardName || null,
        label: form.note || null,
        isDefaultShipping: true,
        isDefaultBilling: true,
        postalCode: null,
        country: null,
      });

      if (!createAddrRes.isSuccess || !createAddrRes.value?.addressId) {
        throw new Error("Không thể tạo địa chỉ giao hàng. Vui lòng thử lại.");
      }

      addrId = createAddrRes.value.addressId;
      // Update local address list to prevent duplicate creation next time
      const freshAddrs = await addressService.getMyAddresses();
      if (freshAddrs.isSuccess && freshAddrs.value) {
        setAddresses(freshAddrs.value);
      }
    }

    return addrId;
  };

  const calculateFee = async (addrId: string) => {
    if (!addrId || isCalculatingShipping) return;
    const cartId = localStorage.getItem(STORAGE_KEYS.CART_ID);
    if (!cartId) return;

    try {
      setIsCalculatingShipping(true);
      const res = await shippingService.calculateShippingFee({
        cartId,
        addressId: addrId,
        transport: "road",
      });

      if (res.isSuccess && res.value?.fee?.fee !== undefined) {
        setShippingFee(res.value.fee.fee);
      } else {
        setShippingFee(0);
      }
    } catch (error) {
      console.error("Lỗi tính phí vận chuyển:", error);
      setShippingFee(0);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  useEffect(() => {
    if (step !== 1 || loadingInitial) return;

    const timer = setTimeout(() => {
      const result = deliverySchema.safeParse(form);
      if (result.success) {
        (async () => {
          try {
            const addrId = await getOrResolveAddressId();
            if (addrId && addrId !== resolvedAddressId) {
              setResolvedAddressId(addrId);
              await calculateFee(addrId);
            }
          } catch (e) {
            toast.error("Đã có lỗi xảy ra : " + e);
          }
        })();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [form, step, loadingInitial, resolvedAddressId]);

  /**
   * Final validation of stock for all items in the cart before placing the order.
   */
  const validateCartStock = async (): Promise<boolean> => {
    setStockErrors({});
    const newErrors: Record<string, string> = {};
    let hasError = false;

    for (const item of items) {
      // Use the server-enriched availableStock property
      const stock = item.availableStock ?? 0;

      if (stock <= 0) {
        newErrors[item.cartItemId] = "Sản phẩm này hiện đã hết hàng.";
        hasError = true;
      } else if (item.quantity > stock) {
        newErrors[item.cartItemId] = `Chỉ còn ${stock} sản phẩm sẵn có.`;
        hasError = true;
      }
    }

    if (hasError) {
      setStockErrors(newErrors);
      toast.error(
        "Có sản phẩm trong giỏ hàng không đủ tồn kho. Vui lòng kiểm tra lại.",
      );
      return false;
    }
    return true;
  };

  const goNext = useCallback(() => {
    if (submitting || isSubmittingRef.current) return;

    if (step === 1) {
      const result = deliverySchema.safeParse({
        name: form.name,
        phone: form.phone,
        email: form.email,
        province: form.province,
        district: form.district,
        ward: form.ward,
        address: form.address,
      });
      if (!result.success) {
        setShowDeliveryErrors(true);
        return;
      }
      setShowDeliveryErrors(false);

      (async () => {
        try {
          setSubmitting(true);
          const addrId = await getOrResolveAddressId();
          setResolvedAddressId(addrId);
          await calculateFee(addrId);
          transition(step + 1, 1);
        } catch (error: any) {
          toast.error(error.message || "Đã có lỗi xảy ra");
        } finally {
          setSubmitting(false);
        }
      })();
      return;
    }

    if (step === 2) {
      (async () => {
        const isValid = await validateCartStock();
        if (isValid) {
          transition(step + 1, 1);
        }
      })();
      return;
    }

    if (step < 3) transition(step + 1, 1);
    else {
      (async () => {
        try {
          if (isSubmittingRef.current) return;
          isSubmittingRef.current = true;
          setSubmitting(true);

          // ── Step 3: Skip manual reservation as backend handles it ──
          console.log(
            "[Checkout] Creating order (Backend will handle reservation)...",
          );

          // ── Proceed with Order Creation ──
          const addrId = await getOrResolveAddressId();

          const cartId = localStorage.getItem(STORAGE_KEYS.CART_ID);
          if (!cartId) throw new Error("Chưa có giỏ hàng.");

          const orderPayload = {
            userId: localStorage.getItem(STORAGE_KEYS.USER)
              ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)!).id
              : null,
            shippingAddressId: addrId,
            billingAddressId: addrId,
            currency: "VND",
            subtotal: totalPrice,
            discountTotal: DISCOUNT,
            taxTotal: 0,
            shippingTotal: shippingFee,
            grandTotal: FINAL_TOTAL,
            notes: form.note || "Order from Design a Bear",
            promoCodes: couponApplied
              ? appliedCoupons.map((c) => c.code)
              : undefined,
          };

          const orderRes = await orderService.createOrderFromCart(
            cartId,
            orderPayload,
          );

          if (orderRes.isSuccess && orderRes.value) {
            const orderId = orderRes.value.orderId;
            const safeDescription = `DAB ${orderRes.value.orderNumber}`.slice(
              0,
              25,
            );

            const createPaymentRes = await paymentService.createPayment({
              orderId,
              itemName: "Design A Bear",
              quantity: Math.max(1, totalItems),
              amount: FINAL_TOTAL,
              description: safeDescription,
            });

            if (!createPaymentRes.isSuccess || !createPaymentRes.value) {
              throw new Error(
                createPaymentRes.error?.description || "Lỗi tạo thanh toán",
              );
            }

            const checkoutUrl =
              createPaymentRes.value.checkoutUrl ||
              createPaymentRes.value.paymentUrl;

            if (checkoutUrl) {
              localStorage.setItem(
                STORAGE_KEYS.PENDING_PAYMENT_ORDER,
                JSON.stringify({
                  orderDetails: orderRes.value,
                  orderCode:
                    (
                      createPaymentRes.value as {
                        orderCode?: string;
                        paymentCode?: string;
                      }
                    ).orderCode ||
                    (
                      createPaymentRes.value as {
                        orderCode?: string;
                        paymentCode?: string;
                      }
                    ).paymentCode ||
                    null,
                  finalTotal: FINAL_TOTAL,
                  createdAt: new Date().toISOString(),
                }),
              );

              window.location.href = checkoutUrl;
              return;
            }

            const paymentCode = String(
              (
                createPaymentRes.value as {
                  paymentCode?: string;
                  orderCode?: string;
                }
              ).paymentCode ??
                (
                  createPaymentRes.value as {
                    paymentCode?: string;
                    orderCode?: string;
                  }
                ).orderCode ??
                "",
            );

            if (!paymentCode) {
              throw new Error("Thiếu paymentCode/orderCode từ create-payment");
            }

            const confirmPaymentRes =
              await paymentService.confirmPayment(paymentCode);

            if (!confirmPaymentRes.isSuccess) {
              throw new Error(
                confirmPaymentRes.error?.description ||
                  "Lỗi xác nhận thanh toán",
              );
            }

            setOrderDetails(orderRes.value);
            toast.success("Đặt hàng thành công!");

            gsap.to(contentRef.current, {
              scale: 0.96,
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                setOrderPlaced(true);
                clearCart();
                gsap.fromTo(
                  contentRef.current,
                  { scale: 0.96, opacity: 0 },
                  {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.out(1.2)",
                  },
                );
              },
            });
          } else {
            throw new Error(orderRes.error?.description || "Lỗi tạo đơn hàng");
          }
        } catch (error: any) {
          toast.error(error.message || "Đã có lỗi xảy ra");
        } finally {
          isSubmittingRef.current = false;
          setSubmitting(false);
        }
      })();
    }
  }, [
    step,
    form,
    transition,
    clearCart,
    totalPrice,
    DISCOUNT,
    shippingFee,
    FINAL_TOTAL,
    couponApplied,
    appliedCoupons,
    toast,
    totalItems,
  ]);

  const goBack = useCallback(() => {
    if (step > 1) transition(step - 1, -1);
    else router.back();
  }, [step, transition, router]);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.15 },
    );
  }, []);

  if (totalItems === 0 && !orderPlaced) {
    if (loadingInitial) return <div className="min-h-screen bg-[#F4F7FF]" />; // prevent flicker

    return (
      <div
        className="min-h-screen flex items-center justify-center flex-col gap-5"
        style={{
          fontFamily: "'Nunito', sans-serif",
          backgroundColor: "#F4F7FF",
        }}
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: "#E8EDF7" }}
        >
          <PawPrint color="#17409A" size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black mb-1" style={{ color: "#1A1A2E" }}>
            Giỏ hàng trống
          </h2>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Hãy thêm sản phẩm trước khi thanh toán nhé!
          </p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105"
          style={{ backgroundColor: "#17409A" }}
        >
          <IoArrowBack />
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  if (loadingInitial) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#17409A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        fontFamily: "'Nunito', sans-serif",
        backgroundColor: "#F4F7FF",
      }}
    >
      {/*  LEFT PANEL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mini nav header  */}
        <header
          className="px-8 py-5 flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid #E5E7EB" }}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: "#17409A" }}
            >
              <Image
                src="/logo.webp"
                alt="Design a Bear Logo"
                width={60}
                height={60}
                className="object-contain w-14 h-14 md:w-16 md:h-16"
              />
            </div>
            <span
              className="font-black text-base"
              style={{ color: "#17409A", fontFamily: "'Nunito', sans-serif" }}
            >
              Design a Bear
            </span>
          </Link>

          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "#9CA3AF" }}
          >
            <IoLockClosedOutline />
            <span>Thanh toán an toàn & bảo mật</span>
          </div>
        </header>

        {/*  Scrollable content  */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-10">
            {/* Page title */}
            {!orderPlaced && (
              <div className="mb-8">
                <h1
                  className="text-3xl font-black mb-1"
                  style={{
                    color: "#1A1A2E",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  Hoàn tất đơn hàng
                </h1>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1 w-12 rounded-full"
                    style={{ backgroundColor: "#17409A" }}
                  />
                  <div
                    className="h-1 w-6 rounded-full"
                    style={{ backgroundColor: "#FF6B9D" }}
                  />
                  <div
                    className="h-1 w-3 rounded-full"
                    style={{ backgroundColor: "#4ECDC4" }}
                  />
                </div>
              </div>
            )}

            {/* Step tracker */}
            {!orderPlaced && <StepTracker current={step} />}

            {/* Step content */}
            <div ref={contentRef} className="relative">
              {orderPlaced ? (
                <SuccessScreen
                  orderId={
                    orderDetails?.orderNumber ||
                    orderDetails?.orderId ||
                    orderId
                  }
                />
              ) : (
                <>
                  {step === 1 && (
                    <StepDelivery
                      form={form}
                      onChange={setForm}
                      showErrors={showDeliveryErrors}
                    />
                  )}
                  {step === 2 && (
                    <StepPayment
                      method={paymentMethod}
                      onChange={setPaymentMethod}
                      couponInput={couponInput}
                      onCouponInputChange={setCouponInput}
                      appliedCoupons={appliedCoupons}
                      onApplyCoupon={handleApplyCoupon}
                      onRemoveCoupon={handleRemoveCoupon}
                      totalDiscount={DISCOUNT}
                      totalPrice={totalPrice}
                      shippingFee={shippingFee}
                      isLoading={submitting}
                    />
                  )}
                  {step === 3 && (
                    <StepConfirm
                      form={form}
                      method={paymentMethod}
                      agreed={agreed}
                      setAgreed={setAgreed}
                    />
                  )}
                </>
              )}
            </div>

            {/* Navigation buttons  */}
            {!orderPlaced && (
              <div
                className="flex items-center justify-between mt-10 pt-6"
                style={{ borderTop: "1px solid #E5E7EB" }}
              >
                {/* Back */}
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: "#F4F7FF",
                    color: "#6B7280",
                    border: "2px solid #E5E7EB",
                  }}
                >
                  <IoArrowBack className="text-base" />
                  {step === 1 ? "Giỏ hàng" : "Quay lại"}
                </button>

                {/* Next / Submit */}
                <button
                  onClick={goNext}
                  disabled={(step === 3 && !agreed) || submitting}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-black text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: step === 3 && !agreed ? "#D1D5DB" : "#17409A",
                    boxShadow:
                      step === 3 && !agreed
                        ? "none"
                        : "0 6px 20px rgba(23,64,154,0.35)",
                  }}
                >
                  {submitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mx-8" />
                  ) : step < 3 ? (
                    <>
                      Tiếp theo
                      <IoArrowForward className="text-base" />
                    </>
                  ) : (
                    <>
                      Đặt hàng ngay
                      <IoCheckmarkCircle className="text-base" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL Order Summary*/}
      <div
        className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen overflow-hidden"
        style={{ width: 400 }}
      >
        <OrderSummary
          shippingFee={shippingFee}
          isCalculatingShipping={isCalculatingShipping}
          discount={DISCOUNT}
          finalTotal={FINAL_TOTAL}
          couponInput={couponInput}
          onCouponInputChange={setCouponInput}
          onApplyCoupon={handleApplyCoupon}
          appliedCoupons={appliedCoupons}
          onRemoveCoupon={handleRemoveCoupon}
          step={step}
          stockErrors={stockErrors}
        />
      </div>

      {/* MOBILE: Bottom bar */}
      {!orderPlaced && (
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 p-4 flex items-center justify-between z-50"
          style={{
            backgroundColor: "#0E2A66",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Tổng cộng
            </p>
            <p className="text-lg font-black" style={{ color: "white" }}>
              {fmt(FINAL_TOTAL)}
            </p>
          </div>
          <button
            onClick={goNext}
            disabled={(step === 3 && !agreed) || submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black text-white transition-all duration-200 disabled:opacity-50"
            style={{
              background: "#17409A",
            }}
          >
            {submitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : step < 3 ? (
              <>
                Tiếp theo
                <IoArrowForward className="text-sm" />
              </>
            ) : (
              "Đặt hàng"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
