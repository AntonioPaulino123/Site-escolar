// js/data.js
(function(global){
  const KEY = 'escola_data_v1';

  const defaultState = {
    alunos: [],
    professores: [
      { id: 'p1', nome: 'Prof. Silva', email: 'prof@escola.com', senha: '123456' },
    ],
    admins: [
      { id: 'a1', nome: 'Admin', email: 'admin@escola.com', senha: 'admin' },
    ],
    disciplinas: [],
    notas: [], // {id, alunoId, disciplinaId, valor}
    materiais: [] // {id, alunoId, disciplina, titulo, url}
  };

  function load() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { ...defaultState };
  }
  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  function uid(prefix='id') {
    return `${prefix}_${Math.random().toString(36).slice(2,8)}_${Date.now().toString(36)}`;
  }

  const api = {
    seed() {
      const state = load();
      if (state.alunos.length) return state;

      state.alunos = [
        { id: 'al1', nome: 'Ana Santos', email: 'aluno@escola.com', senha: '123456', matricula: '2025001' },
        { id: 'al2', nome: 'Bruno Costa', email: 'aluno2@escola.com', senha: '123456', matricula: '2025002' },
      ];
      state.disciplinas = [
        { id: 'd1', nome: 'Matemática' },
        { id: 'd2', nome: 'Português' },
        { id: 'd3', nome: 'História' },
      ];
      state.notas = [
        { id: uid('n'), alunoId: 'al1', disciplinaId: 'd1', valor: 12.5 },
        { id: uid('n'), alunoId: 'al1', disciplinaId: 'd2', valor: 14.0 },
        { id: uid('n'), alunoId: 'al2', disciplinaId: 'd1', valor: 8.0 },
      ];
      state.materiais = [
        { id: uid('m'), alunoId: 'al1', disciplina: 'Matemática', titulo: 'Lista de exercícios 1', url: '#' },
        { id: uid('m'), alunoId: 'al1', disciplina: 'Português', titulo: 'Leitura: crônica', url: '#' },
      ];
      save(state);
      return state;
    },

    // Alunos
    getAlunos() { return load().alunos; },
    upsertAluno(a) {
      const state = load();
      if (a.id) {
        const idx = state.alunos.findIndex(x => x.id === a.id);
        state.alunos[idx] = { ...state.alunos[idx], ...a };
      } else {
        a.id = uid('al');
        a.senha = a.senha || '123456';
        state.alunos.push(a);
      }
      save(state);
    },
    deleteAluno(id) {
      const state = load();
      state.alunos = state.alunos.filter(a => a.id !== id);
      state.notas = state.notas.filter(n => n.alunoId !== id);
      save(state);
    },

    // Professores/Admins
    getProfByEmail(email){ return load().professores.find(p => p.email === email); },
    getAdminByEmail(email){ return load().admins.find(a => a.email === email); },

    // Disciplinas
    getDisciplinas(){ return load().disciplinas; },
    upsertDisciplina(d) {
      const state = load();
      if (d.id) {
        const idx = state.disciplinas.findIndex(x => x.id === d.id);
        state.disciplinas[idx] = { ...state.disciplinas[idx], ...d };
      } else {
        d.id = uid('d');
        state.disciplinas.push(d);
      }
      save(state);
    },
    deleteDisciplina(id) {
      const state = load();
      state.disciplinas = state.disciplinas.filter(d => d.id !== id);
      state.notas = state.notas.filter(n => n.disciplinaId !== id);
      save(state);
    },

    // Notas
    getNotas(){ return load().notas; },
    getNotaById(id){ return load().notas.find(n => n.id === id); },
    getNotasByAluno(alunoId){ return load().notas.filter(n => n.alunoId === alunoId); },
    upsertNota({ alunoId, disciplinaId, valor }) {
      const state = load();
      const exists = state.notas.find(n => n.alunoId === alunoId && n.disciplinaId === disciplinaId);
      if (exists) {
        exists.valor = valor;
      } else {
        state.notas.push({ id: uid('n'), alunoId, disciplinaId, valor });
      }
      save(state);
    },
    deleteNota(id) {
      const state = load();
      state.notas = state.notas.filter(n => n.id !== id);
      save(state);
    },
    calcMedia(alunoId, disciplinaId) {
      const ns = load().notas.filter(n => n.alunoId === alunoId && n.disciplinaId === disciplinaId);
      if (!ns.length) return 0;
      const soma = ns.reduce((acc, n) => acc + n.valor, 0);
      return soma / ns.length;
    },

    // Materiais
    getMateriaisAluno(alunoId){ return load().materiais.filter(m => m.alunoId === alunoId); },
  };

  global.Data = api;
})(window);
