import createApiClient from '../api.service';

class AuthenticationService {
  constructor(baseURL = '/api/auth') {
    this.api = createApiClient(baseURL);
  }  

  async signupForStaff(data) {
    return (await this.api.post('/signup/staff', data)).data;
  }

  async signupForReader(data) {
    return (await this.api.post('/signup/reader', data)).data;
  }

  async login(data) {
    return (await this.api.post('/login', data)).data;
  }

  async logout() {
    return (await this.api.get('/logout')).data;
  }

  async validate() {
    return (await this.api.get('/validate')).data;
  }
}

export default new AuthenticationService();