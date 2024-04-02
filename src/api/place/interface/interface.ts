export interface IKakaoSearchImageResponse {
  documents: IKakaoSearchImageDocuments[];
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
}

export interface IKakaoSearchImageDocuments {
  collection: string;
  datetime: string;
  display_sitename: string;
  doc_url: string;
  height: number;
  image_url: string;
  thumbnail_url: string;
}

export interface IPlaceUpdateRatingInput {
  overallRating: number;
  scentRating: number;
  cleanlinessRating: number;
  overallRatingCount: number;
  scentRatingCount: number;
  cleanlinessRatingCount: number;
}
