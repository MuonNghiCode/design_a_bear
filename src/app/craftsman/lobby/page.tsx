import CraftsmanLobbyClient from "@/components/craftsman/lobby/CraftsmanLobbyClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sảnh chờ việc | Design a Bear",
  description: "Nhận các đơn hàng chế tác gấu bông mới",
};

export default function CraftsmanLobbyPage() {
  return <CraftsmanLobbyClient />;
}
