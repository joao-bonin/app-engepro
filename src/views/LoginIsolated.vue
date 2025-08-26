<template>
  <div class="login-root">
    <div class="login-card">
      <h1 class="login-title">EngePro</h1>

      <form @submit.prevent="onSubmit" class="login-form">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" type="email" placeholder="seu@email.com" required />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input id="password" v-model="password" type="password" placeholder="Digite sua senha" required />
        </div>

        <!-- Exibe erro -->
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <!-- Botão com loader -->
        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <p class="login-footer">© 2025 EngePro</p>
    </div>
  </div>
</template>

<script>
import { login } from "@/services/auth";



export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const success = await login(this.email, this.password);

        if (success) {
          this.$router.push("/");
        } else {
          this.errorMessage = "E-mail ou senha inválidos.";
        }
      } catch (err) {
        this.errorMessage = "Erro no servidor. Tente novamente.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-root {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4a90e2, #50e3c2);
  font-family: "Poppins", sans-serif;
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: transform 0.2s ease-in-out;
}

.login-card:hover {
  transform: translateY(-4px);
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 18px;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-group input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
  outline: none;
}

/* Mensagem de erro */
.error-msg {
  color: #d93025;
  font-size: 14px;
  margin-bottom: 12px;
  text-align: center;
}

/* Botão */
.btn-login {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background: #4a90e2;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-login:disabled {
  background: #a0c4f3;
  cursor: not-allowed;
}

.btn-login:hover:not(:disabled) {
  background: #357ab8;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.login-footer {
  margin-top: 24px;
  font-size: 13px;
  color: #666;
}
</style>
