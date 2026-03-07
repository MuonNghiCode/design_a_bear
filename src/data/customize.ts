import {
  type FurOption,
  type ThemeOption,
  type SubjectOption,
  type VoiceOption,
} from "@/types/customize";

export const FUR_OPTIONS: FurOption[] = [
  { id: "cream", label: "Kem ivory", color: "#F5E6C8", textureLabel: "Lông tơ mịn mượt" },
  { id: "brown", label: "Nâu socola", color: "#8B5E3C", textureLabel: "Lông nhung dày ấm" },
  { id: "pink", label: "Hồng pastel", color: "#FFB5C8", textureLabel: "Lông tơ siêu mềm" },
  { id: "gray", label: "Xám bạc", color: "#B0B8C1", textureLabel: "Lông nhung cao cấp" },
  { id: "lavender", label: "Tím oải hương", color: "#C9B8E8", textureLabel: "Lông tơ mịn mượt" },
  { id: "mint", label: "Xanh bạc hà", color: "#A8DDD9", textureLabel: "Lông nhung nhẹ" },
];

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "astronaut",
    label: "Phi hành gia",
    icon: "astronaut",
    description: "Khám phá vũ trụ cùng gấu yêu",
    accent: "#17409A",
  },
  {
    id: "forest",
    label: "Khu rừng ma thuật",
    icon: "forest",
    description: "Cuộc phiêu lưu giữa thiên nhiên",
    accent: "#4ECDC4",
  },
  {
    id: "music",
    label: "Nhạc sĩ nhí",
    icon: "music",
    description: "Âm nhạc và nhịp điệu sống động",
    accent: "#FF6B9D",
  },
  {
    id: "scientist",
    label: "Nhà khoa học",
    icon: "scientist",
    description: "Thí nghiệm thú vị hàng ngày",
    accent: "#7C5CFC",
  },
  {
    id: "chef",
    label: "Đầu bếp nhỏ",
    icon: "chef",
    description: "Học nấu ăn và dinh dưỡng",
    accent: "#FF8C42",
  },
  {
    id: "athlete",
    label: "Vận động viên",
    icon: "athlete",
    description: "Thể thao và rèn luyện thể chất",
    accent: "#4ECDC4",
  },
];

export const SUBJECT_OPTIONS: SubjectOption[] = [
  { id: "math", label: "Toán học", icon: "math", ageMin: 3, ageMax: 10, accent: "#17409A" },
  { id: "language", label: "Ngôn ngữ", icon: "language", ageMin: 2, ageMax: 8, accent: "#FF6B9D" },
  { id: "science", label: "Khoa học", icon: "science", ageMin: 5, ageMax: 12, accent: "#7C5CFC" },
  { id: "music", label: "Âm nhạc", icon: "music", ageMin: 2, ageMax: 10, accent: "#FF8C42" },
  { id: "art", label: "Nghệ thuật", icon: "art", ageMin: 3, ageMax: 10, accent: "#FF6B9D" },
  { id: "nature", label: "Thiên nhiên", icon: "nature", ageMin: 4, ageMax: 12, accent: "#4ECDC4" },
  { id: "code", label: "Lập trình", icon: "code", ageMin: 6, ageMax: 14, accent: "#7C5CFC" },
  { id: "social", label: "Kỹ năng sống", icon: "social", ageMin: 3, ageMax: 8, accent: "#FFD93D" },
];

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: "warm", label: "Ấm áp & dịu dàng", description: "Giọng nữ nhẹ nhàng, thích hợp cho bé nhỏ" },
  { id: "fun", label: "Vui nhộn & năng động", description: "Giọng trẻ trung, đầy năng lượng" },
  { id: "calm", label: "Điềm tĩnh & sâu lắng", description: "Giọng nam ấm, kể chuyện cuốn hút" },
  { id: "buddy", label: "Bạn thân thân thiết", description: "Giọng trẻ em, cùng tuổi với bé" },
];
