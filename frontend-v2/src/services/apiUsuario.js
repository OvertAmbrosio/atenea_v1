import { restAuth, restPrivate } from './requestHelper';

export const login = async (data) => restAuth({
  url: 'private/auth/login', method: 'POST', data
});
/**
 * @param {boolean} toast false si debe buscar sin mostrar avisos
 */
export const session = async (toast) => restPrivate({
  url: 'private/auth/session', method: 'GET'
}, toast);
/**
 * @param {boolean} toast 
 */
export const logout = async (toast=true) => restPrivate({
  url: 'private/auth/logout', method: 'GET'
}, toast);
