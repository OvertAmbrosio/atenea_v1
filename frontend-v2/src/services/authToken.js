import jwtDecode from "jwt-decode";

export class AuthToken {
  constructor(token) {
    this.decodedToken = { 
      nombre: null,
      _id: null,
      cargo: null,
      imagen: null,
      gestor: null, 
      exp: 0 
    };
    
    try {
      if (token) this.decodedToken = jwtDecode(token);
    } catch (e) {
      console.log('Error');
      console.log(e);
    }
  }

  get isValid() {
    return !this.isExpired;
  }

  get expiresAt() {
    return new Date(this.decodedToken.exp * 1000);
  }

  get isExpired() {
    return new Date() > this.expiresAt;
  }

  get authorizationString() {
    return `Bearer ${this.token}`;
  }
};