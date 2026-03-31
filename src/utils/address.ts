export function normalizePhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length >= 11) {
    return `0${digits.slice(2)}`;
  }
  if (!digits.startsWith("0") && digits.length === 9) {
    return `0${digits}`;
  }
  return digits;
}

export function isValidVietnamPhoneNumber(phone: string): boolean {
  return /^0\d{8,10}$/.test(phone);
}

export interface ParsedAddressParts {
  line1: string;
  line2: string;
  state: string;
  city: string;
}

export function parseAddressTextDetailed(text: string): ParsedAddressParts {
  const normalized = text
    .replace(/[\n;|]+/g, ",")
    .replace(/\s+/g, " ")
    .trim();

  const parts = normalized
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 4) {
    return {
      line1: parts[0],
      line2: parts.slice(1, -2).join(", "),
      state: parts[parts.length - 2],
      city: parts[parts.length - 1],
    };
  }

  if (parts.length === 3) {
    return {
      line1: parts[0],
      line2: "",
      state: parts[1],
      city: parts[2],
    };
  }

  if (parts.length === 2) {
    return {
      line1: parts[0],
      line2: "",
      state: "",
      city: parts[1],
    };
  }

  return {
    line1: normalized || "Chưa cập nhật",
    line2: "",
    state: "",
    city: "",
  };
}

export function composeAddressText(parts: {
  line1?: string | null;
  line2?: string | null;
  state?: string | null;
  city?: string | null;
}): string {
  return [parts.line1, parts.line2, parts.state, parts.city]
    .map((v) => (v || "").trim())
    .filter(Boolean)
    .join(", ");
}
