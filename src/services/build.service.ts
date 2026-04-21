import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { CreateBuildRequest, CreateBuildResponse, Build, ApiResponse } from "@/types";

class BuildService extends BaseApiService {

    async createBuild(data: CreateBuildRequest): Promise<CreateBuildResponse> {
        return this.post<Build>(
            API_ENDPOINTS.BUILDS.BASE,
            data,
            { withCredentials: false },
        );
    }

    async getBuildById(id: string): Promise<ApiResponse<Build>> {
        const url = `${API_ENDPOINTS.BUILDS.BASE}/${id}`;
        return this.get<Build>(url, undefined, { withCredentials: false });
    }
}

export const buildService = new BuildService();
