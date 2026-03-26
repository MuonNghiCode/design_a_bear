import type {
  StoryMetric,
  StoryMilestone,
  StoryValue,
  StoryPromise,
} from "@/types/story";

export const STORY_METRICS: StoryMetric[] = [
  { label: "Gia đình đồng hành", value: "12.500+", color: "#17409A" },
  { label: "Bài học đã triển khai", value: "2,1 triệu", color: "#4ECDC4" },
  { label: "Gấu IoT đang hoạt động", value: "38.000+", color: "#7C5CFC" },
  { label: "Đánh giá hài lòng", value: "98%", color: "#FF8C42" },
];

export const STORY_MILESTONES: StoryMilestone[] = [
  {
    id: "m1",
    year: "2021",
    title: "Khởi đầu từ một nỗi trăn trở",
    description:
      "Đội ngũ sáng lập bắt đầu từ câu hỏi: làm sao để trẻ em học vui hơn mà vẫn an toàn trong môi trường số.",
    impact: "10 nguyên mẫu đầu tiên được thử nghiệm tại lớp học STEAM.",
    icon: "spark",
  },
  {
    id: "m2",
    year: "2022",
    title: "Gấu bông bước vào lớp học",
    description:
      "Design a Bear hợp tác với giáo viên mầm non và tiểu học để xây dựng lộ trình học thông qua hội thoại cùng gấu bông.",
    impact: "Hơn 3.000 học sinh trải nghiệm chương trình học tương tác.",
    icon: "classroom",
  },
  {
    id: "m3",
    year: "2024",
    title: "Nâng cấp AI + IoT",
    description:
      "Hệ thống được nâng cấp với AI hội thoại tiếng Việt và bộ cảm biến IoT để phản hồi theo thói quen học của bé.",
    impact: "Thời lượng tự học trung bình của bé tăng 42%.",
    icon: "ai",
  },
  {
    id: "m4",
    year: "2026",
    title: "Mở rộng cộng đồng học tập",
    description:
      "Chúng tôi xây dựng hệ sinh thái phụ huynh - giáo viên - trẻ em, để mọi chủ đề học đều có tài nguyên và hướng dẫn đồng hành.",
    impact: "12.500+ gia đình đang sử dụng Design a Bear mỗi ngày.",
    icon: "community",
  },
];

export const STORY_VALUES: StoryValue[] = [
  {
    id: "v1",
    title: "An toàn trước tiên",
    description:
      "Nội dung được kiểm duyệt bởi đội ngũ giáo dục. Trẻ em luôn học trong không gian tích cực và được bảo vệ.",
    color: "#17409A",
  },
  {
    id: "v2",
    title: "Học bằng sự tò mò",
    description:
      "Mỗi bài học được thiết kế như một cuộc phiêu lưu nhỏ, giúp bé chủ động hỏi, thử và khám phá.",
    color: "#FF8C42",
  },
  {
    id: "v3",
    title: "Công nghệ ấm áp",
    description:
      "AI và IoT được sử dụng để kết nối, không thay thế tình cảm. Gấu bông vẫn là người bạn gần gũi của bé.",
    color: "#7C5CFC",
  },
];

export const STORY_PROMISES: StoryPromise[] = [
  {
    id: "p1",
    title: "Nội dung học cập nhật theo độ tuổi",
    detail:
      "Phụ huynh có thể tuỳ chỉnh chủ đề, mức độ và thời lượng học linh hoạt.",
  },
  {
    id: "p2",
    title: "Tương tác đo lường được",
    detail:
      "Bảng thống kê rõ ràng giúp gia đình theo dõi tiến bộ của bé theo từng tuần.",
  },
  {
    id: "p3",
    title: "Đồng hành bởi đội ngũ giáo dục",
    detail:
      "Mọi cập nhật sản phẩm đều có hướng dẫn sư phạm để phụ huynh dễ dàng áp dụng tại nhà.",
  },
];
