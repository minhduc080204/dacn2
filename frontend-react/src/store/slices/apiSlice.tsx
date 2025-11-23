import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_KEY, AUTHORIZATION_TOKEN, BASE_URL, ENDPOINTS } from '../../config';

import {
  BankInforType,
  BannerType,
  CarouselType,
  CategoryType,
  MessageType,
  OrderType,
  ProductType,
  PromocodeType,
  TagType,
} from '../../types';
import { FavoriteType } from '../../types/FavoriteType';
import { ViewTrackingType } from '../../types/ViewTrackingType';
import { RecommendationType } from '../../types/RecommendationType';
import { RootState } from '../store';

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Thêm header 'authorization' và 'api-key'
      const token = (getState() as RootState).userSlice.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('api-key', API_KEY);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<{ products: ProductType[] }, void>({
      query: () => ENDPOINTS.get.products,
    }),
    getBanners: builder.query<{ banners: BannerType[] }, void>({
      query: () => ENDPOINTS.get.banners,
    }),
    getCarousel: builder.query<{ carousel: CarouselType[] }, void>({
      query: () => ENDPOINTS.get.carousel,
    }),
    getCategories: builder.query<{ categories: CategoryType[] }, void>({
      query: () => ENDPOINTS.get.categories,
    }),
    getReviews: builder.query<{ reviews: any[] }, void>({
      query: () => ENDPOINTS.get.reviews,
    }),
    getUsers: builder.query<{ users: any[] }, void>({
      query: () => ENDPOINTS.get.users,
    }),
    getTags: builder.query<{ tags: TagType[] }, void>({
      query: () => ENDPOINTS.get.tags,
    }),
    getPromocodes: builder.query<{ promocodes: PromocodeType[] }, void>({
      query: () => ENDPOINTS.get.promocodes,
    }),
    getOrders: builder.query<OrderType[], number>({
      query: (orderId) => `${ENDPOINTS.get.orders}/${orderId}`,
    }),
    getBankInfor: builder.query<BankInforType, void>({
      query: () => ENDPOINTS.get.bankinfor,
    }),
    getFavorites: builder.query<ProductType[], void>({
      query: () => ENDPOINTS.get.favorites,
    }),
    getRecommendations: builder.query<RecommendationType, number>({
      query: (userId) => `${ENDPOINTS.get.recommendations}/${userId}`,
    }),
    getTrending: builder.query<ProductType[], void>({
      query: () => ENDPOINTS.get.trending,
    }),
    getSimilar: builder.query<ProductType[], number>({
      query: (productId) => `${ENDPOINTS.get.similar}/${productId}`,
    }),
    // getMessage: builder.query<{messages: MessageType[]}, void>({
    //   query: () => ENDPOINTS.get.message,
    // }),    

    getMessage: builder.mutation<any, { userId: number }>({
      query: (userId) => ({
        url: ENDPOINTS.post.message,
        method: 'POST',
        body: userId,
      }),
    }),

    sendMessage: builder.mutation<{ id: number }, MessageType>({
      query: (message) => ({
        url: ENDPOINTS.post.sendmessage,
        method: 'POST',
        body: message,
      }),
    }),
    createOrder: builder.mutation<{ id: number }, OrderType>({
      query: (orderData) => ({
        url: ENDPOINTS.post.order,
        method: 'POST',
        body: orderData,
      }),
    }),
    checkDiscount: builder.mutation<any, { code: string }>({
      query: (code) => ({
        url: ENDPOINTS.post.discount,
        method: 'POST',
        body: code,
      }),
    }),
    addFavorite: builder.mutation<void, {productId: string}>({
      query: (id) => ({
        url: ENDPOINTS.post.favorite.add,
        method: 'POST',
        body: id
      })
    }),
    removeFavorite: builder.mutation<void, {productId: string}>({
      query: (id) => ({
        url: ENDPOINTS.post.favorite.remove,
        method: 'POST',
        body: id
      })
    }),
    viewTracking: builder.mutation<void, ViewTrackingType>({
      query: (data) => ({
        url: ENDPOINTS.post.tracking.view,
        method: 'POST',
        body: data
      })
    }),
    searchTracking: builder.mutation<void, { code: any }>({
      query: (code) => ({
        url: ENDPOINTS.post.tracking.search,
        method: 'POST',
        body: code
      })
    })
  }),
});

export const {
  useGetTagsQuery,
  useGetUsersQuery,
  useGetBannersQuery,
  useGetReviewsQuery,
  useGetProductsQuery,
  useGetCarouselQuery,
  useGetCategoriesQuery,
  useGetPromocodesQuery,
  useGetOrdersQuery,
  useGetBankInforQuery,
  useGetFavoritesQuery,
  useGetRecommendationsQuery,
  useGetTrendingQuery,
  useGetSimilarQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useViewTrackingMutation,
  useSearchTrackingMutation,
  useGetMessageMutation,
  useSendMessageMutation,
  useCreateOrderMutation,
  useCheckDiscountMutation,
} = apiSlice;

export default apiSlice.reducer;
