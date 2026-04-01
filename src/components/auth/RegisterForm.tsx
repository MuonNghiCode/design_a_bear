"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import SocialButtons from "./SocialButtons";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoCallOutline,
  IoImageOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import type { GoogleCompleteProfileRequest, RegisterRequest } from "@/types";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { z } from "zod";

interface RegisterFormProps {
  onSwitchLogin: () => void;
}

const registerSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ in hoa")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Số điện thoại phải gồm đúng 10 chữ số"),
  avatarUrl: z
    .string()
    .trim()
    .url("Avatar phải là URL hợp lệ")
    .refine((value) => /^https?:\/\//i.test(value), {
      message: "Avatar URL phải bắt đầu bằng http:// hoặc https://",
    }),
  dateOfBirth: z
    .string()
    .min(1, "Vui lòng chọn ngày sinh")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Ngày sinh không hợp lệ",
    }),
  gender: z.enum(["M", "F"], {
    error: "Giới tính không hợp lệ",
  }),
});

const googleCompleteProfileSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^0[0-9]{9}$/,
      "Phone number must be exactly 10 digits, start with 0, and not be a popular fake number.",
    ),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ in hoa")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  dateOfBirth: z
    .string()
    .min(1, "Vui lòng chọn ngày sinh")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Ngày sinh không hợp lệ",
    }),
  gender: z.enum(["M", "F"], {
    error: "Giới tính không hợp lệ",
  }),
});

type RegisterFieldErrors = Partial<Record<keyof RegisterRequest, string>>;
type GoogleProfilePayload = Omit<
  GoogleCompleteProfileRequest,
  "registrationToken"
>;
type GoogleProfileErrors = Partial<Record<keyof GoogleProfilePayload, string>>;

const GENDER_OPTIONS = [
  { label: "Nam", value: "M" },
  { label: "Nữ", value: "F" },
];

const MATCHED_INPUT_CLASS =
  "w-full pl-5 pr-4 py-4 rounded-2xl border border-[#E5E7EB] bg-white/50 text-[#1A1A2E] text-sm focus:outline-none focus:border-[#17409A] focus:bg-white/80 transition-all duration-200";

export default function RegisterForm({ onSwitchLogin }: RegisterFormProps) {
  const router = useRouter();
  const {
    signup,
    verifyEmail,
    pendingVerification,
    clearPendingVerification,
    pendingGoogleProfile,
    completeGoogleProfile,
    clearPendingGoogleProfile,
  } = useAuth();
  const { success, error: toastError, info } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFileName, setAvatarFileName] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [googleProfileErrors, setGoogleProfileErrors] =
    useState<GoogleProfileErrors>({});

  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Registration form state
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    avatarUrl: "",
    dateOfBirth: "",
    gender: "M",
  });

  // Email verification form state
  const [verificationData, setVerificationData] = useState({
    otp: "",
  });

  const [googleProfileData, setGoogleProfileData] =
    useState<GoogleProfilePayload>({
      phoneNumber: "",
      password: "",
      fullName: "",
      dateOfBirth: "",
      gender: "M",
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
    setError("");
  };

  const handleInputFieldChange =
    (name: keyof RegisterRequest) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
      setError("");
    };

  const handleVerificationOtpChange = (value: string) => {
    setVerificationData((prev) => ({
      ...prev,
      otp: value,
    }));
    setError("");
  };

  const handleGoogleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setGoogleProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setGoogleProfileErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
    setError("");
  };

  const setGoogleProfileField =
    (name: keyof GoogleProfilePayload) => (value: string) => {
      setGoogleProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setGoogleProfileErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
      setError("");
    };

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      const message = "Vui lòng chọn file ảnh hợp lệ";
      setError(message);
      toastError(message);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const message = "Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB";
      setError(message);
      toastError(message);
      return;
    }

    try {
      // Use object URL only for local preview; keep payload short for BE limits.
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setAvatarFileName(file.name);
      setError("");

      if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
        info(
          "Chưa cấu hình upload ảnh tự động. Bạn hãy dán Avatar URL thủ công.",
        );
        return;
      }

      setIsUploadingAvatar(true);
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", cloudinaryUploadPreset);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: "POST",
          body: form,
        },
      );

      if (!uploadResponse.ok) {
        throw new Error("Upload ảnh thất bại");
      }

      const uploaded = (await uploadResponse.json()) as {
        secure_url?: string;
      };

      const uploadedUrl = uploaded.secure_url;
      if (!uploadedUrl) {
        throw new Error("Không nhận được URL ảnh sau khi upload");
      }

      setFormData((prev) => ({
        ...prev,
        avatarUrl: uploadedUrl,
      }));
      setFieldErrors((prev) => ({
        ...prev,
        avatarUrl: undefined,
      }));
      success("Đã tải ảnh lên và tự điền Avatar URL");
    } catch {
      const message = "Không thể tải ảnh từ máy của bạn";
      setError(message);
      toastError(message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  useEffect(() => {
    if (!pendingGoogleProfile) return;

    setGoogleProfileData((prev) => ({
      ...prev,
      phoneNumber: pendingGoogleProfile.phoneNumber ?? prev.phoneNumber,
      fullName: pendingGoogleProfile.fullName ?? prev.fullName,
      dateOfBirth: pendingGoogleProfile.dateOfBirth ?? prev.dateOfBirth,
      gender: pendingGoogleProfile.gender ?? prev.gender,
    }));
  }, [pendingGoogleProfile]);

  const passwordStrength = useMemo(() => {
    const password = formData.password;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    const score = checks.filter(Boolean).length;

    if (!password)
      return { score: 0, label: "Chưa nhập", color: "bg-gray-300" };
    if (score <= 2) return { score, label: "Yếu", color: "bg-red-500" };
    if (score <= 4)
      return { score, label: "Trung bình", color: "bg-amber-500" };
    return { score, label: "Mạnh", color: "bg-emerald-500" };
  }, [formData.password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const validated = registerSchema.safeParse(formData);
      if (!validated.success) {
        const nextErrors: RegisterFieldErrors = {};
        const flattened = validated.error.flatten().fieldErrors;

        (Object.keys(flattened) as Array<keyof RegisterRequest>).forEach(
          (key) => {
            const firstError = flattened[key]?.[0];
            if (firstError) {
              nextErrors[key] = firstError;
            }
          },
        );

        setFieldErrors(nextErrors);
        const message = "Vui lòng kiểm tra lại thông tin đăng ký";
        setError(message);
        toastError(message);
        return;
      }

      await signup(validated.data);
      success("Đăng ký thành công, vui lòng kiểm tra email để lấy OTP");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng ký thất bại";
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!verificationData.otp) {
        const message = "Vui lòng nhập mã OTP";
        setError(message);
        toastError(message);
        setIsLoading(false);
        return;
      }

      if (!pendingVerification?.email) {
        const message = "Email không hợp lệ";
        setError(message);
        toastError(message);
        setIsLoading(false);
        return;
      }

      await verifyEmail(pendingVerification.email, verificationData.otp);
      success("Xác nhận email thành công");

      // verifyEmail already stores token + user in localStorage; redirect by role like login flow
      const stored = localStorage.getItem("dab_user");
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === "admin") {
        router.push("/admin");
      } else if (user?.role === "staff") {
        router.push("/staff");
      } else {
        router.push("/");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Xác nhận email thất bại";
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setGoogleProfileErrors({});

    try {
      const validated =
        googleCompleteProfileSchema.safeParse(googleProfileData);
      if (!validated.success) {
        const nextErrors: GoogleProfileErrors = {};
        const flattened = validated.error.flatten().fieldErrors;

        (Object.keys(flattened) as Array<keyof GoogleProfilePayload>).forEach(
          (key) => {
            const firstError = flattened[key]?.[0];
            if (firstError) {
              nextErrors[key] = firstError;
            }
          },
        );

        setGoogleProfileErrors(nextErrors);
        const message = "Vui lòng kiểm tra lại hồ sơ Google";
        setError(message);
        toastError(message);
        return;
      }

      await completeGoogleProfile(validated.data);
      success("Hoàn tất hồ sơ Google thành công");

      const stored = localStorage.getItem("dab_user");
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === "admin") {
        router.push("/admin");
      } else if (user?.role === "staff") {
        router.push("/staff");
      } else {
        router.push("/");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Hoàn tất hồ sơ Google thất bại";
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingGoogleProfile) {
    return (
      <>
        <div className="field-item text-center mb-6">
          <h1 className="font-black text-[#1A1A2E] text-3xl leading-tight mb-2">
            Hoàn tất hồ sơ Google
          </h1>
          <p className="text-[#6B7280] text-sm">
            {pendingGoogleProfile.email
              ? `Tài khoản ${pendingGoogleProfile.email} cần bổ sung thông tin trước khi đăng nhập.`
              : "Bạn cần bổ sung thông tin trước khi đăng nhập bằng Google."}
          </p>
        </div>

        <form
          onSubmit={handleGoogleCompleteProfile}
          className="field-item grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div>
            <InputField
              type="text"
              placeholder="Họ và tên"
              name="fullName"
              value={googleProfileData.fullName}
              onChange={setGoogleProfileField("fullName")}
              rightIcon={<IoPersonOutline />}
            />
            {googleProfileErrors.fullName && (
              <p className="mt-1 text-xs text-red-500">
                {googleProfileErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <InputField
              type="text"
              placeholder="Số điện thoại"
              name="phoneNumber"
              value={googleProfileData.phoneNumber}
              onChange={setGoogleProfileField("phoneNumber")}
              rightIcon={<IoCallOutline />}
            />
            {googleProfileErrors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">
                {googleProfileErrors.phoneNumber}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <InputField
              type="password"
              placeholder="Tạo mật khẩu"
              name="password"
              value={googleProfileData.password}
              onChange={setGoogleProfileField("password")}
              rightIcon={<IoLockClosedOutline />}
            />
            {googleProfileErrors.password && (
              <p className="mt-1 text-xs text-red-500">
                {googleProfileErrors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={googleProfileData.dateOfBirth}
              onChange={handleGoogleProfileChange}
              className={MATCHED_INPUT_CLASS}
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.95rem",
              }}
            />
            {googleProfileErrors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">
                {googleProfileErrors.dateOfBirth}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">
              Giới tính
            </label>
            <CustomDropdown
              options={GENDER_OPTIONS}
              value={googleProfileData.gender}
              onChange={setGoogleProfileField("gender")}
              buttonClassName={`${MATCHED_INPUT_CLASS} flex items-center justify-between`}
              chevronClassName="text-[#9CA3AF] text-xl transition-transform"
              menuClassName="absolute z-30 mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white shadow-xl py-1"
              ariaLabel="Giới tính"
            />
            {googleProfileErrors.gender && (
              <p className="mt-1 text-xs text-red-500">
                {googleProfileErrors.gender}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm md:col-span-2">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#17409A] text-white font-bold py-3.5 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2"
          >
            {isLoading ? "Đang hoàn tất..." : "Hoàn tất và đăng nhập"}
          </button>
        </form>

        <div className="field-item text-center text-sm text-[#6B7280] mt-4">
          <button
            type="button"
            onClick={() => {
              clearPendingGoogleProfile();
              onSwitchLogin();
            }}
            className="text-[#17409A] font-bold hover:underline underline-offset-2"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </>
    );
  }

  // Show email verification form if registration is pending
  if (pendingVerification) {
    return (
      <>
        <div className="field-item text-center mb-8">
          <h1 className="font-black text-[#1A1A2E] text-3xl leading-tight mb-2">
            Xác nhận email
          </h1>
          <p className="text-[#6B7280] text-sm">
            Chúng tôi đã gửi mã OTP đến <br />
            <span className="font-semibold text-[#1A1A2E]">
              {pendingVerification.email}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerifyEmail} className="field-item space-y-4">
          <InputField
            type="text"
            placeholder="Nhập mã OTP"
            name="otp"
            value={verificationData.otp}
            onChange={handleVerificationOtpChange}
            rightIcon={<IoMailOutline />}
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#17409A] text-white font-bold py-4 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang xác nhận..." : "Xác nhận"}
          </button>
        </form>

        <div className="field-item text-center text-sm text-[#6B7280] mt-4">
          <button
            type="button"
            onClick={() => {
              clearPendingVerification();
              setVerificationData({ otp: "" });
              setError("");
            }}
            className="text-[#17409A] font-bold hover:underline underline-offset-2"
          >
            Quay lại đăng ký
          </button>
        </div>
      </>
    );
  }

  // Show registration form
  return (
    <>
      <div className="field-item text-center mb-4">
        <h1 className="font-black text-[#1A1A2E] text-2xl md:text-3xl leading-tight mb-1">
          Tham gia cùng chúng tôi
        </h1>
        <p className="text-[#6B7280] text-sm md:text-[15px]">
          Chỉ vài bước để bắt đầu thiết kế và học tập
        </p>
      </div>

      <form
        onSubmit={handleSignup}
        className="field-item grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <div>
          <InputField
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputFieldChange("email")}
            rightIcon={<IoMailOutline />}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <InputField
            type="password"
            placeholder="Mật khẩu"
            name="password"
            value={formData.password}
            onChange={handleInputFieldChange("password")}
            rightIcon={<IoLockClosedOutline />}
          />
          <div className="mt-2">
            <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">
              Độ mạnh mật khẩu:{" "}
              <span className="font-semibold">{passwordStrength.label}</span>
            </p>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <InputField
            type="text"
            placeholder="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputFieldChange("fullName")}
            rightIcon={<IoPersonOutline />}
          />
          {fieldErrors.fullName && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>
          )}
        </div>

        <div>
          <InputField
            type="text"
            placeholder="Số điện thoại"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputFieldChange("phoneNumber")}
            rightIcon={<IoCallOutline />}
          />
          {fieldErrors.phoneNumber && (
            <p className="mt-1 text-xs text-red-500">
              {fieldErrors.phoneNumber}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="w-full px-4 py-4 rounded-2xl border border-[#E5E7EB] bg-white/50 text-[#1A1A2E] text-sm focus-within:border-[#17409A] cursor-pointer flex items-center justify-between gap-3 transition-colors">
            <span className="truncate">
              {avatarPreview
                ? `Đã chọn: ${avatarFileName || "Ảnh đại diện"}`
                : "Chọn ảnh từ máy"}
            </span>
            <IoImageOutline className="text-xl text-[#9CA3AF]" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hidden"
            />
          </label>

          {isUploadingAvatar && (
            <p className="mt-2 text-xs text-[#17409A] font-semibold">
              Đang upload ảnh để lấy URL...
            </p>
          )}

          {avatarPreview && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-12 w-12 rounded-full object-cover border border-[#E5E7EB]"
              />
              <button
                type="button"
                onClick={() => {
                  if (avatarPreview.startsWith("blob:")) {
                    URL.revokeObjectURL(avatarPreview);
                  }
                  setAvatarPreview("");
                  setAvatarFileName("");
                  setFormData((prev) => ({
                    ...prev,
                    avatarUrl: "",
                  }));
                }}
                className="text-sm text-[#17409A] font-semibold hover:underline"
              >
                Xóa anh
              </button>
            </div>
          )}

          <div className="mt-2">
            <InputField
              type="text"
              placeholder="Avatar URL (https://...)"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleInputFieldChange("avatarUrl")}
              rightIcon={<IoImageOutline />}
            />
          </div>

          {fieldErrors.avatarUrl && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.avatarUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">
            Ngày sinh
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={MATCHED_INPUT_CLASS}
            style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem" }}
          />
          {fieldErrors.dateOfBirth && (
            <p className="mt-1 text-xs text-red-500">
              {fieldErrors.dateOfBirth}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">
            Giới tính
          </label>
          <CustomDropdown
            options={GENDER_OPTIONS}
            value={formData.gender}
            onChange={handleInputFieldChange("gender")}
            buttonClassName={`${MATCHED_INPUT_CLASS} flex items-center justify-between`}
            chevronClassName="text-[#9CA3AF] text-xl transition-transform"
            menuClassName="absolute z-30 mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white shadow-xl py-1"
            ariaLabel="Giới tính"
          />
          {fieldErrors.gender && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.gender}</p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm md:col-span-2">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading || isUploadingAvatar}
          className="w-full bg-[#17409A] text-white font-bold py-3.5 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2"
        >
          {isLoading ? "Đang đăng ký..." : "Đăng ký ngay"}
        </button>
      </form>

      <div className="field-item mt-4">
        <SocialButtons label="đăng ký" />
      </div>

      <div className="field-item text-center text-sm text-[#6B7280] mt-4">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchLogin}
          className="text-[#17409A] font-bold hover:underline underline-offset-2"
        >
          Đăng nhập ngay
        </button>
      </div>
    </>
  );
}
