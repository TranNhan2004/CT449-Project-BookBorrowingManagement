import createApiClient from "../api.service";

class AuthenticationService {
  constructor(baseURL = "/api/auth") {
    this.api = createApiClient(baseURL);
  }  

  async signup(data) {
    return (await this.api.post("/staff-signup", data)).data;
  }

  async login(data) {
    return (await this.api.post("/login", data)).data;
  }

  async logout() {
    return (await this.api.get("/logout")).data;
  }

  async validate() {
    return (await this.api.get("/validate")).data;
  }
}

export default new AuthenticationService();