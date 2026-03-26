import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  Address,
  ApiResponse,
  GetAddressByIdResponse,
  AddressDetail,
} from "@/types";

class AddressService extends BaseApiService {
  async getMyAddresses(): Promise<ApiResponse<Address[]>> {
    return this.get<Address[]>(
      API_ENDPOINTS.ADDRESSES.MY_ADDRESSES,
      undefined,
      { withCredentials: false },
    );
  }

  async createAddress(
    addressData: Partial<Address>,
  ): Promise<ApiResponse<{ addressId: string }>> {
    return this.post<{ addressId: string }>(
      API_ENDPOINTS.ADDRESSES.CREATE,
      addressData,
      { withCredentials: false },
    );
  }

  async getAddressById(id: string): Promise<GetAddressByIdResponse> {
    return this.get<AddressDetail>(
      `${API_ENDPOINTS.ADDRESSES.GET_BY_ID}/${id}`,
      undefined,
      { withCredentials: false },
    );
  }
}

export const addressService = new AddressService();
