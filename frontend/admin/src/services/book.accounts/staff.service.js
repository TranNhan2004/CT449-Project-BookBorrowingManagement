import createApiClient from "../api.service";

class StaffService {
  constructor(baseURL = "/api/staffs") {
    this.api = createApiClient(baseURL);
  }  

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async getAll() {
    return (await this.api.get("/")).data;
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

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  async getMe() {
    return (await this.api.get("/me")).data;
  }

  async updateMe(data) {
    return (await this.api.patch("/me", data)).data;
  }
}

export default new StaffService();