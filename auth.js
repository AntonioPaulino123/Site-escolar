// js/auth.js
(function(global){
  const AUTH_KEY = 'escola_auth_v1';

  function currentUser() {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  function setUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
  function logout() {
    localStorage.removeItem(AUTH_KEY);
    location.href = 'index.html';
  }

  const api = {
    login(role, emailOrMatricula, senha) {
      // Carregar seed se ainda não existir
      if (!window.Data.getAlunos().length) window.Data.seed();

      let user = null;

      if (role === 'aluno') {
        const byEmail = window.Data.getAlunos().find(a => a.email === emailOrMatricula);
        const byMatricula = window.Data.getAlunos().find(a => a.matricula === emailOrMatricula);
        user = byEmail || byMatricula;
      } else if (role === 'professor') {
        user = window.Data.getProfByEmail(emailOrMatricula);
      } else {
        user = window.Data.getAdminByEmail(emailOrMatricula);
      }

      if (!user || user.senha !== senha) {
        return { ok: false, message: 'Usuário ou senha incorretos.' };
      }

      setUser({ id: user.id, nome: user.nome, role });
      return { ok: true, user: { id: user.id, nome: user.nome, role } };
    },

    require(role) {
      const user = currentUser();
      if (!user) return (location.href = 'index.html');
      if (role && user.role !== role) {
        // Redireciona para o painel correto do perfil
        if (user.role === 'aluno') location.href = 'aluno.html';
        else if (user.role === 'professor') location.href = 'professor.html';
        else location.href = 'admin.html';
      }
      return user;
    },

    currentUser,
    logout
  };

  global.Auth = api;
})(window);
