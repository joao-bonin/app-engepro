export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export async function login(email, password) {
  // TODO: chame sua API real aqui e salve o token retornado
  if (email && password) {
    localStorage.setItem('token', 'fake-token');
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem('token');
}
