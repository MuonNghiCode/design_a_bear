"use client";

import { useCallback, useState } from "react";
import { orderService } from "@/services/order.service";
import type { Order } from "@/types";

function unwrapValue<T>(response: {
  value: T;
  isFailure: boolean;
  error?: { description?: string };
}): T {
  if (response.isFailure) {
    throw new Error(response.error?.description || "API request failed");
  }
  return response.value;
}

export function useOrderApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrdersByUserId = useCallback(async (userId: string): Promise<Order[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrdersByUserId(userId);
      return unwrapValue(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể lấy lịch sử đơn hàng";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (orderId: string): Promise<Order> => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrderById(orderId);
      return unwrapValue(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể lấy chi tiết đơn hàng";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, getOrdersByUserId, getOrderById };
}
