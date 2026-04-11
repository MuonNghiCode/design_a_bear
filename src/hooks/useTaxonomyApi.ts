"use client";

import { useCallback, useState } from "react";
import { taxonomyService } from "@/services/taxonomy.service";
import type { ProductCategory, CharacterItem } from "@/types";

export function useTaxonomyApi() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [characters, setCharacters] = useState<CharacterItem[]>([]);

  const fetchTaxonomy = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesRes, charactersRes] = await Promise.all([
        taxonomyService.getCategories(),
        taxonomyService.getCharacters(),
      ]);

      if (categoriesRes.isSuccess && categoriesRes.value) {
        setCategories(categoriesRes.value);
      } else {
        setCategories([]);
      }

      if (charactersRes.isSuccess && charactersRes.value) {
        setCharacters(charactersRes.value);
      } else {
        setCharacters([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    categories,
    characters,
    fetchTaxonomy,
  };
}
