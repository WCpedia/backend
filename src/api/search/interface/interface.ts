export interface IKakaoSearchResponse {
  documents: IKakaoSearchDocuments[];
  meta: {
    is_end: boolean;
    pageable_count: number;
    same_name: {
      keyword: string;
      region: [];
      selected_region: string;
    };
    total_count: number;
  };
}

export interface IKakaoSearchDocuments {
  id: string;
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
}
