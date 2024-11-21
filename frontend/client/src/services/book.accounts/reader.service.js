import createApiClient from "../api.service";

class ReaderService {
  constructor(baseURL = "/api/readers") {
    this.api = createApiClient(baseURL);
  }  

  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async get(id, params = {}) {
    return (await this.api.get(`/${id}`, { params })).data;
  }

  async update(id, data) {
    return (await this.api.patch(`/${id}`, data)).data;
  }

  async updateValidation(id, data) {
    return (await this.api.patch(`/validation/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  async getMe(params = {}) {
    return (await this.api.get("/me", { params })).data;
  }

  async updateMe(data) {
    return (await this.api.patch("/me/update", data)).data;
  }

  async changeMyPassword(data) {
    return (await this.api.patch("/me/change-password", data)).data;
  }
}

export default new ReaderService();