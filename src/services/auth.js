export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export async function login(email, password) {
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
    localStorage.setItem('userName', login.name);
    localStorage.setItem('userEmail', login.email);
    return true;
  }
  return false;
}

export async function doLogout() {
  try {

    await fetch('http://localhost:9000/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

  } catch (e) {
    console.error('Erro ao chamar logout:', e)

  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('hasLevelConfig');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    window.location.href = '/login'
  }
}
