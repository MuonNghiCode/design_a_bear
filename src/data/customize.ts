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
  {
    id: "female-warm",
    label: "Nữ ấm áp",
    description: "Giọng nữ nhẹ nhàng, đầm ấm, thích hợp cho bé nhỏ",
    sampleText: "Xin chào bé yêu! Chúng ta cùng học bài hôm nay nhé!",
    pitch: 1.25,
    rate: 0.88,
    gender: "female",
  },
  {
    id: "female-energetic",
    label: "Nữ năng động",
    description: "Giọng nữ vui tươi, trẻ trung, đầy năng lượng",
    sampleText: "Uyê! Hôm nay mình sẽ khám phá điều gì thú vị đây!",
    pitch: 1.65,
    rate: 1.18,
    gender: "female",
  },
  {
    id: "female-gentle",
    label: "Nữ dịu dàng",
    description: "Giọng nữ điềm tĩnh, rõ ràng, phù hợp kể chuyện",
    sampleText: "Ngày xửa ngày xưa, có một chú gấu nhỏ sống trong khu rừng xanh...",
    pitch: 1.0,
    rate: 0.78,
    gender: "female",
  },
  {
    id: "male-friendly",
    label: "Nam thân thiện",
    description: "Giọng nam vui vẻ, gần gũi, dễ nghe",
    sampleText: "Chào bạn nhỏ! Hôm nay chúng ta sẽ cùng nhau học điều gì đó tuyệt vời nhé!",
    pitch: 0.65,
    rate: 1.0,
    gender: "male",
  },
  {
    id: "male-deep",
    label: "Nam trầm ấm",
    description: "Giọng nam trầm, rõ ràng, kể chuyện cuốn hút",
    sampleText: "Hãy cùng nhau khám phá thế giới kỳ diệu xung quanh chúng ta.",
    pitch: 0.2,
    rate: 0.75,
    gender: "male",
  },
  {
    id: "child",
    label: "Giọng trẻ em",
    description: "Giọng nhỏ xính, cùng tuổi bé, thân thiết như bạn thân",
    sampleText: "Bạn ơi! Chúng mình chơi trò chơi và học bài cùng nhau nhé!",
    pitch: 1.95,
    rate: 1.12,
    gender: "child",
  },
];
