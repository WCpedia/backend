export interface IKakaoSearchImageResponse {
  documents: IKakaoSearchImageDocuments[];
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
}
export interface IKakaoPlaceMenuInfo {
  menuInfo: {
    moreyn: string;
    menuList: IMenuItem[];
    productyn: string;
    menuboardphotourl: string;
    menuboardphotocount: number;
    timeexp: string;
  };
}

export interface IMenuItem {
  price: string;
  recommend: boolean;
  menu: string;
  desc: string;
  img: string;
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
  accessibilityRating: number;
  facilityRating: number;
  cleanlinessRating: number;
  reviewCount: number;
}

export interface ICalculatedRating extends IPlaceUpdateRatingInput {
  userRatingAverage: number;
}
