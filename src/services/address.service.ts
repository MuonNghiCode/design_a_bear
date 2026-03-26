import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { GetAddressByIdResponse, AddressDetail } from "@/types";

class AddressService extends BaseApiService {
  async getAddressById(id: string): Promise<GetAddressByIdResponse> {
    return this.get<AddressDetail>(
      `${API_ENDPOINTS.ADDRESSES.GET_BY_ID}/${id}`,
      undefined,
      { withCredentials: false }
    );
  }
}

export const addressService = new AddressService();
