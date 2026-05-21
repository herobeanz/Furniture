import apiClient from "./client";
import { unwrapResponseData } from "./response";

export interface CollectionCategoryRef {
  id: number;
  name: string;
  slug: string;
  orderIndex?: number;
}

export interface CollectionProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  thumbnail?: string;
  material?: string;
  categoryId?: number;
  category?: CollectionCategoryRef;
  orderIndex?: number;
  breadcrumb: { name: string; slug: string }[];
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  orderIndex: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  productCount?: number;
  categories?: CollectionCategoryRef[];
  products?: CollectionProduct[];
  createdAt?: string;
  updatedAt?: string;
}

export const collectionApi = {
  async getCollections(): Promise<Collection[]> {
    const response = await apiClient.get("/collections");
    return unwrapResponseData<Collection[]>(response);
  },

  async getCollectionBySlug(slug: string): Promise<Collection> {
    const response = await apiClient.get(`/collections/${slug}`);
    return unwrapResponseData<Collection>(response);
  },

  async listAdmin(): Promise<Collection[]> {
    const response = await apiClient.get("/collections/list/all");
    const data = unwrapResponseData<Collection[]>(response);
    return Array.isArray(data) ? data : [];
  },

  async getById(id: number): Promise<Collection> {
    const response = await apiClient.get(`/collections/by-id/${id}`);
    return unwrapResponseData<Collection>(response);
  },

  async create(
    payload: Omit<Collection, "id" | "productCount" | "categories" | "products">,
  ): Promise<Collection> {
    const response = await apiClient.post("/collections", payload);
    return unwrapResponseData<Collection>(response);
  },

  async update(
    id: number,
    payload: Partial<
      Omit<Collection, "id" | "productCount" | "categories" | "products">
    >,
  ): Promise<Collection> {
    const response = await apiClient.patch(`/collections/${id}`, payload);
    return unwrapResponseData<Collection>(response);
  },

  async reorder(collections: { id: number; orderIndex: number }[]): Promise<void> {
    await apiClient.patch("/collections/reorder", { collections });
  },

  async addProduct(
    collectionId: number,
    productId: number,
    orderIndex?: number,
  ): Promise<void> {
    await apiClient.post(`/collections/${collectionId}/products`, {
      productId,
      ...(orderIndex !== undefined ? { orderIndex } : {}),
    });
  },

  async removeProduct(collectionId: number, productId: number): Promise<void> {
    await apiClient.delete(`/collections/${collectionId}/products/${productId}`);
  },

  async updateProductOrder(
    collectionId: number,
    products: { productId: number; orderIndex: number }[],
  ): Promise<void> {
    await apiClient.patch(`/collections/${collectionId}/products/order`, {
      products,
    });
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/collections/${id}`);
  },
};
