import { useCallback, useState, useRef } from "react";
import { orderService } from "@/services/order.service";
import { userService } from "@/services/user.service";
import type { GetOrdersRequest, GetOrdersResponseData, UserDetail } from "@/types";

type FetchOrdersParams = GetOrdersRequest & { fetchAllPages?: boolean };

export function useAdminOrdersApi() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetOrdersResponseData | null>(null);
  const [usersMap, setUsersMap] = useState<Record<string, UserDetail>>({});
  const requestedUsers = useRef<Set<string>>(new Set());

  const fetchOrders = useCallback(async (params?: FetchOrdersParams) => {
    setLoading(true);
    try {
      const pageIndex = params?.pageIndex || 1;
      const pageSize = params?.pageSize || 10;
      const fetchAllPages = params?.fetchAllPages || false;

      const res = await orderService.getOrders({
        pageIndex,
        pageSize,
      });

      if (res.isSuccess && res.value) {
        let mergedItems = [...res.value.items];

        if (fetchAllPages && res.value.totalPages > 1) {
          const remainingPages = Array.from(
            { length: res.value.totalPages - 1 },
            (_, idx) => idx + 2,
          );

          const restResults = await Promise.allSettled(
            remainingPages.map((page) =>
              orderService.getOrders({ pageIndex: page, pageSize }),
            ),
          );

          restResults.forEach((result) => {
            if (result.status === "fulfilled" && result.value.isSuccess && result.value.value) {
              mergedItems.push(...result.value.value.items);
            }
          });

          const uniqueByOrderId = new Map(mergedItems.map((item) => [item.orderId, item]));
          mergedItems = Array.from(uniqueByOrderId.values());
        }

        setData({
          ...res.value,
          items: mergedItems,
          totalCount: mergedItems.length,
          totalPages: Math.max(1, Math.ceil(mergedItems.length / pageSize)),
          pageIndex,
          pageSize,
          hasPreviousPage: pageIndex > 1,
          hasNextPage: pageIndex < Math.max(1, Math.ceil(mergedItems.length / pageSize)),
        });
        
        // Fetch missing users concurrently
        const uniqueUserIds = Array.from(
          new Set(mergedItems.map((o) => o.userId).filter(Boolean))
        ) as string[];

        // Only fetch users not already requested
        const missingUserIds = uniqueUserIds.filter((id) => !requestedUsers.current.has(id));

        if (missingUserIds.length > 0) {
          try {
            const userResults = await Promise.allSettled(
              missingUserIds.map((id) => userService.getUserById(id))
            );

            const newUsers: Record<string, UserDetail> = {};
            userResults.forEach((result, index) => {
              const currentUserId = missingUserIds[index];
              if (result.status === "fulfilled" && result.value.isSuccess && result.value.value) {
                const u = result.value.value;
                newUsers[u.userId] = u;
                requestedUsers.current.add(u.userId);
              } else {
                // Keep failed IDs retryable on next fetch to avoid permanent missing names.
                requestedUsers.current.delete(currentUserId);
              }
            });

            if (Object.keys(newUsers).length > 0) {
              setUsersMap((prev) => ({ ...prev, ...newUsers }));
            }
          } catch (e) {
            console.error("Failed to fetch some user profiles", e);
            missingUserIds.forEach((id) => requestedUsers.current.delete(id));
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
