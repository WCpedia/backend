import { Injectable } from '@nestjs/common';
import { SearchRepository } from '../repository/search.repository';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class SearchService {
  constructor(private readonly searchRepository: SearchRepository) {}

  async searchPlaces(value) {
    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword`,
      {
        headers: {
          Authorization: `KakaoAK `,
          'Content-type': 'application/x-www-form-urlencoded',
        },
        params: {
          query: value,
        },
      },
    );
    console.log(response.data.documents);
  }
}
