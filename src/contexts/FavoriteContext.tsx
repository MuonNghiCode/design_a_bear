"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { favoriteService } from "@/services/favorite.service";
import { useRouter } from "next/navigation";
import type { FavoriteResponse } from "@/types/responses";

interface FavoriteContextType {
  favorites: Set<string>;
  items: FavoriteResponse[];
  loading: boolean;
  isOpen: boolean;
  openFavorites: () => void;
  closeFavorites: () => void;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorited: (productId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined,
);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { error, success, warning } = useToast();
  const router = useRouter();

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites(new Set());
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      const res = await favoriteService.getMyFavorites(1, 100);
      if (res.isSuccess && res.value?.items) {
        setFavorites(new Set(res.value.items.map((item) => item.productId)));
        setItems(res.value.items);
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (productId: string) => {
    if (!isAuthenticated) {
      warning(
        "Bạn chưa đăng nhập nên không thể thêm vào danh sách yêu thích. Đang chuyển hướng đến trang đăng nhập...",
      );
      setTimeout(() => {
        router.push("/auth");
      }, 1500);
      return;
    }

    try {
      const res = await favoriteService.toggleFavorite(productId);
      if (res.isSuccess) {
        const isCurrentlyFav = favorites.has(productId);

        setFavorites((prev) => {
          const next = new Set(prev);
          if (next.has(productId)) {
            next.delete(productId);
          } else {
            next.add(productId);
          }
          return next;
        });

        if (isCurrentlyFav) {
          setItems((prev) => prev.filter((i) => i.productId !== productId));
          success("Đã xóa khỏi danh sách yêu thích");
        } else {
          // Refresh from backend to get freshly added object details
          await fetchFavorites();
          success("Đã thêm vào danh sách yêu thích");
        }
      }
    } catch (err) {
      error("Không thể cập nhật danh sách yêu thích");
    }
  };

  const isFavorited = (productId: string) => favorites.has(productId);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        items,
        loading,
        isOpen,
        openFavorites: () => setIsOpen(true),
        closeFavorites: () => setIsOpen(false),
        toggleFavorite,
        isFavorited,
        refreshFavorites: fetchFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return context;
}
