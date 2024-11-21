import createApiClient from '../api.service';

class BookBorrowingService {
  constructor(baseURL = '/api/book-borrowings') {
    this.api = createApiClient(baseURL);
  }  

  async getAll(params = {}) {
    return (await this.api.get('/', { params })).data;
  }

  async create(data) {
    return (await this.api.post('/', data)).data;
  }

  async deleteAll() {
    return (await this.api.delete('/')).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async returnBook(id) {
    return (await this.api.patch(`/return/${id}`)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new BookBorrowingService();