import { baseApi } from "./baseApi";

export const offeringsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOfferings: builder.query<{ success: boolean; data: any[] }, { semesterId?: string; status?: string } | void>({
      query: (params) => ({
        url: "/offerings",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Offering" as const, id })),
              { type: "Offering", id: "LIST" },
            ]
          : [{ type: "Offering", id: "LIST" }],
    }),
    getOfferingById: builder.query<{ success: boolean; data: any }, string>({
      query: (id) => `/offerings/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Offering", id }],
    }),
    getOfferingRoster: builder.query<{ success: boolean; data: any[] }, string>({
      query: (offeringId) => `/offerings/${offeringId}/roster`,
      providesTags: (_result, _error, offeringId) => [{ type: "Offering", id: `ROSTER_${offeringId}` }],
    }),
  }),
});

export const {
  useGetOfferingsQuery,
  useGetOfferingByIdQuery,
  useGetOfferingRosterQuery,
} = offeringsApi;
