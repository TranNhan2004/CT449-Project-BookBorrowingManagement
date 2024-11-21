import createApiClient from "../api.service";

class ReviewService {
  constructor(baseURL = "/api/reviews") {
    this.api = createApiClient(baseURL);
  }  

  async getAll(params = {}) {
    console.log(params);
    return (await this.api.get("/", { params })).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async deleteAll(params = {}) {
    return (await this.api.delete("/", { params })).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.patch(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new ReviewService();