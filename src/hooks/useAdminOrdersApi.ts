import { useCallback, useState, useRef } from "react";
import { orderService } from "@/services/order.service";
import { userService } from "@/services/user.service";
import type { GetOrdersRequest, GetOrdersResponseData, UserDetail } from "@/types";

export function useAdminOrdersApi() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetOrdersResponseData | null>(null);
  const [usersMap, setUsersMap] = useState<Record<string, UserDetail>>({});
  const requestedUsers = useRef<Set<string>>(new Set());

  const fetchOrders = useCallback(async (params?: GetOrdersRequest) => {
    setLoading(true);
    try {
      const res = await orderService.getOrders({
        pageIndex: params?.pageIndex || 1,
        pageSize: params?.pageSize || 50,
        ...params,
      });

      if (res.isSuccess && res.value) {
        setData(res.value);
        
        // Fetch missing users concurrently
        const uniqueUserIds = Array.from(
          new Set(res.value.items.map((o) => o.userId).filter(Boolean))
        ) as string[];

        // Only fetch users not already requested
        const missingUserIds = uniqueUserIds.filter((id) => !requestedUsers.current.has(id));

        if (missingUserIds.length > 0) {
          missingUserIds.forEach(id => requestedUsers.current.add(id));
          
          try {
            const userResults = await Promise.allSettled(
              missingUserIds.map((id) => userService.getUserById(id))
            );

            const newUsers: Record<string, UserDetail> = {};
            userResults.forEach((result) => {
              if (result.status === "fulfilled" && result.value.isSuccess && result.value.value) {
                const u = result.value.value;
                newUsers[u.userId] = u;
              }
            });

            if (Object.keys(newUsers).length > 0) {
              setUsersMap((prev) => ({ ...prev, ...newUsers }));
            }
          } catch (e) {
            console.error("Failed to fetch some user profiles", e);
          }
        }
      } else {
        console.error("Failed to fetch orders:", res.error);
        setData(null);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, data, fetchOrders, usersMap };
}
