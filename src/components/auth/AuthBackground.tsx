import Image from "next/image";

export default function AuthBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/login-background.png"
        alt="Login background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[#0a1a40]/60" />
    </div>
  );
}
