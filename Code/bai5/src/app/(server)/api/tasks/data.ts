export interface Task {
  id: number;
  title: string;
  description: string;
}

export const tasks: Task[] = [
  {
    id: 1,
    title: "Gửi email báo cáo",
    description: "Soạn và gửi báo cáo tuần cho đội ngũ trước 5 giờ chiều."
  },
  {
    id: 2,
    title: "Hoàn thành slide thuyết trình",
    description: "Chuẩn bị slide cho cuộc họp khách hàng ngày mai."
  },
  {
    id: 3,
    title: "Mua đồ dùng văn phòng",
    description: "Mua bút, giấy và mực in cho văn phòng."
  },
  {
    id: 4,
    title: "Kiểm tra lịch hẹn",
    description: "Xác nhận lịch hẹn với đối tác vào thứ Tư."
  },
  {
    id: 5,
    title: "Cập nhật tài liệu dự án",
    description: "Sửa đổi tài liệu dự án theo phản hồi mới nhất."
  }
];