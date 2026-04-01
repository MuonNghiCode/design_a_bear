import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  Address,
  ApiResponse,
  GetAddressByIdResponse,
  AddressDetail,
  CreateAddressRequest,
  UpdateAddressRequest,
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
    addressData: CreateAddressRequest,
  ): Promise<ApiResponse<{ addressId: string }>> {
    return this.post<{ addressId: string }>(
      API_ENDPOINTS.ADDRESSES.CREATE,
      addressData,
      { withCredentials: false },
    );
  }

  async getAddressById(id: string): Promise<GetAddressByIdResponse> {
    const endpoint = API_ENDPOINTS.ADDRESSES.GET_BY_ID.replace("{id}", id);
    return this.get<AddressDetail>(
      endpoint,
      undefined,
      { withCredentials: false },
    );
  }

  async updateAddress(
    id: string,
    data: UpdateAddressRequest,
  ): Promise<ApiResponse<AddressDetail>> {
    const endpoint = API_ENDPOINTS.ADDRESSES.UPDATE.replace("{id}", id);
    return this.put<AddressDetail>(endpoint, data, { withCredentials: false });
  }

  async deleteAddress(id: string): Promise<ApiResponse<null>> {
    const endpoint = API_ENDPOINTS.ADDRESSES.DELETE.replace("{id}", id);
    return this.delete<null>(endpoint, { withCredentials: false });
  }
}

export const addressService = new AddressService();
