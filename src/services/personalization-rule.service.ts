import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  CreatePersonalizationRuleRequest,
  UpdatePersonalizationRuleRequest,
  GetPersonalizationRulesAdminResponse,
  GetPersonalizationRuleResponse,
  CreatePersonalizationRuleResponse,
  UpdatePersonalizationRuleResponse,
  DeletePersonalizationRuleResponse,
} from "@/types";

class PersonalizationRuleService extends BaseApiService {
  async getRules(): Promise<GetPersonalizationRulesAdminResponse> {
    return this.get(API_ENDPOINTS.PERSONALIZATION_RULES.BASE, undefined, {
      withCredentials: false,
    });
  }

  async getRuleById(id: string): Promise<GetPersonalizationRuleResponse> {
    const url = API_ENDPOINTS.PERSONALIZATION_RULES.BY_ID.replace("{id}", id);
    return this.get(url, undefined, { withCredentials: false });
  }

  async createRule(
    payload: CreatePersonalizationRuleRequest,
  ): Promise<CreatePersonalizationRuleResponse> {
    return this.post(API_ENDPOINTS.PERSONALIZATION_RULES.BASE, payload, {
      withCredentials: false,
    });
  }

  async updateRule(
    id: string,
    payload: UpdatePersonalizationRuleRequest,
  ): Promise<UpdatePersonalizationRuleResponse> {
    const url = API_ENDPOINTS.PERSONALIZATION_RULES.BY_ID.replace("{id}", id);
    return this.put(url, payload, { withCredentials: false });
  }

  async deleteRule(id: string): Promise<DeletePersonalizationRuleResponse> {
    const url = API_ENDPOINTS.PERSONALIZATION_RULES.BY_ID.replace("{id}", id);
    return this.delete(url, { withCredentials: false });
  }
}

export const personalizationRuleService = new PersonalizationRuleService();
