import createApiClient from "../api.service";

class BookService {
  constructor(baseURL = "/api/books") {
    this.api = createApiClient(baseURL);
    this.formApi = createApiClient(baseURL, true);
  }  

  async getFormData(data) {
    let formData = new FormData();

    for (const key in data) {
      if (Array.isArray(key, data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }

    return formData;
  }

  async create(data) {
    console.log(data);
    const formData = await this.getFormData(data);
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`); 
    }
    console.log(formData);
    const response = (await this.formApi.post("/", formData));
    console.log(response);
    return response.data
  }

  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
  }

  async get(id, params = {}) {
    return (await this.api.get(`/${id}`, { params })).data;
  }

  async update(id, data) {
    const formData = await this.getFormData(data);
    return (await this.formApi.patch(`/${id}`, formData)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
}

export default new BookService();