<template>
  <div class="login-container">
    <div class="login-header">
      <h1>EngePro</h1>
      <p>Faça login para continuar</p>
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          :class="{ error: errors.email }"
          placeholder="Digite seu email"
          required
          @blur="validateEmail"
          @input="clearError('email')"
        >
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          :class="{ error: errors.password }"
          placeholder="Digite sua senha"
          required
          @input="clearError('password')"
        >
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <button
        type="submit"
        class="login-button"
        :disabled="isLoading || !isFormValid"
      >
        <span v-if="isLoading" class="loading"></span>
        {{ isLoading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      errors: {},
      isLoading: false,
      successMessage: ''
    };
  },
  computed: {
    isFormValid() {
      return this.formData.email &&
             this.formData.password &&
             this.isValidEmail(this.formData.email) &&
             Object.keys(this.errors).length === 0;
    }
  },
  methods: {
    isValidEmail(email) {
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      return emailRegex.test(email);
    },
    validateEmail() {
      if (!this.formData.email) {
        this.errors.email = 'Email é obrigatório';
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = 'Digite um email válido';
      }
    },
    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
      }
      this.successMessage = '';
    },
    async handleLogin() {
      this.errors = {};
      this.successMessage = '';

      if (!this.formData.email) {
        this.errors.email = 'Email é obrigatório';
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = 'Digite um email válido';
      }

      if (!this.formData.password) {
        this.errors.password = 'Senha é obrigatória';
      } else if (this.formData.password.length < 6) {
        this.errors.password = 'Senha deve ter pelo menos 6 caracteres';
      }

      if (Object.keys(this.errors).length > 0) {
        return;
      }

      this.isLoading = true;

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.successMessage = 'Login realizado com sucesso!';

        setTimeout(() => {
          this.formData = { email: '', password: '' };
          this.successMessage = '';
        }, 3000);

      } catch (error) {
        this.errors.general = 'Erro ao fazer login. Tente novamente.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>

.login-container {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.login-header h1 {
    color: #333;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
}

.login-header p {
    color: #666;
    font-size: 14px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
    font-size: 14px;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    background-color: #f8f9fa;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error {
    border-color: #e74c3c;
    background-color: #fdf2f2;
}

.error-message {
    color: #e74c3c;
    font-size: 12px;
    margin-top: 5px;
    display: block;
}

.login-button {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.login-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.login-button:active {
    transform: translateY(0);
}

.login-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.success-message {
    background-color: #d4edda;
    color: #155724;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #c3e6cb;
    text-align: center;
}

@media (max-width: 480px) {
    .login-container {
        padding: 30px 20px;
        margin: 10px;
    }

    .login-header h1 {
        font-size: 24px;
    }
}
</style>
