export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export async function login(email, password) {
  // TODO: chame sua API real aqui e salve o token retornado
  if (email && password) {

    const credentials = {
      email: email,
      password: password,
    }

    const response = await fetch('http://localhost:9000/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) return false;

    const login = await response.json()
    localStorage.setItem('token', login.token);
    localStorage.setItem('hasLevelConfig', login.hasLevelConfig);
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('hasLevelConfig');
}
