import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  GetCharactersResponse,
  GetCharacterResponse,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  ApiResponse,
} from "@/types";

class CharacterService extends BaseApiService {
  async getCharacters(): Promise<GetCharactersResponse> {
    return this.get(API_ENDPOINTS.CHARACTERS.GET_ALL, undefined, {
      withCredentials: false,
    });
  }

  async getCharacterById(id: string): Promise<GetCharacterResponse> {
    const url = API_ENDPOINTS.CHARACTERS.GET_BY_ID.replace("{id}", id);
    return this.get(url, undefined, {
      withCredentials: false,
    });
  }

  async createCharacter(
    payload: CreateCharacterRequest,
  ): Promise<GetCharacterResponse> {
    return this.post(API_ENDPOINTS.CHARACTERS.CREATE, payload, {
      withCredentials: false,
    });
  }

  async updateCharacter(
    id: string,
    payload: UpdateCharacterRequest,
  ): Promise<GetCharacterResponse> {
    const url = API_ENDPOINTS.CHARACTERS.UPDATE.replace("{id}", id);
    return this.put(url, payload, {
      withCredentials: false,
    });
  }

  async deleteCharacter(id: string): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.CHARACTERS.DELETE.replace("{id}", id);
    return this.delete(url, {
      withCredentials: false,
    });
  }
}

export const characterService = new CharacterService();
