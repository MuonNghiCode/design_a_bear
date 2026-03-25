import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { CreateBuildRequest, CreateBuildResponse, Build } from "@/types";

class BuildService extends BaseApiService {

    async createBuild(data: CreateBuildRequest): Promise<CreateBuildResponse> {
        return this.post<Build>(
            API_ENDPOINTS.BUILDS.BASE,
            data,
            { withCredentials: false },
        );
    }
}

export const buildService = new BuildService();
