import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { GetAddressesResponse, Address, ApiResponse } from "@/types";

class AddressService extends BaseApiService {
    async getMyAddresses(): Promise<ApiResponse<Address[]>> {
        return this.get<Address[]>(
            API_ENDPOINTS.ADDRESSES.MY_ADDRESSES,
            undefined,
            { withCredentials: false } 
        );
    }

    async createAddress(addressData: Partial<Address>): Promise<ApiResponse<{ addressId: string }>> {
        return this.post<{ addressId: string }>(
            API_ENDPOINTS.ADDRESSES.CREATE,
            addressData,
            { withCredentials: false } 
        );
    }
}

export const addressService = new AddressService();
