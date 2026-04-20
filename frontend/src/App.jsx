import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [abrigos, setAbrigos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  
  // Estado inicial do formulário para facilitar a limpeza
  const estadoInicialForm = {
    nome: '', 
    endereco: '', 
    telefone: '', 
    capacidade_total: '', 
    vagas_disponiveis: '', 
    aceita_pets: false, 
    tem_cozinha: false
  };

  const [novoAbrigo, setNovoAbrigo] = useState(estadoInicialForm);

  // 1. CARREGAR (Read)
  const carregarAbrigos = async () => {
    try {
      const resposta = await axios.get('http://localhost:3000/abrigos');
      setAbrigos(resposta.data);
    } catch (err) {
      console.error("Erro ao buscar abrigos", err);
    }
  };

  // 2. CADASTRAR OU EDITAR (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        // Modo Edição
        const res = await axios.put(`http://localhost:3000/abrigos/${editandoId}`, novoAbrigo);
        setAbrigos(abrigos.map(a => a.id === editandoId ? res.data : a));
        setEditandoId(null);
      } else {
        // Modo Cadastro
        const res = await axios.post('http://localhost:3000/abrigos', novoAbrigo);
        setAbrigos([...abrigos, res.data]);
      }
      setNovoAbrigo(estadoInicialForm);
    } catch (err) {
      alert("Erro ao processar a requisição.");
    }
  };

  // 3. PREPARAR EDIÇÃO (Leva os dados do card para o form)
  const prepararEdicao = (abrigo) => {
    setEditandoId(abrigo.id);
    setNovoAbrigo(abrigo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. ALTERAR VAGAS RÁPIDO (Patch)
  const alterarVagas = async (id, novaQuantidade) => {
    if (novaQuantidade < 0) return;
    try {
      await axios.patch(`http://localhost:3000/abrigos/${id}/vagas`, { 
        vagas_disponiveis: novaQuantidade 
      });
      setAbrigos(abrigos.map(a => a.id === id ? { ...a, vagas_disponiveis: novaQuantidade } : a));
    } catch (err) {
      alert("Erro ao atualizar vagas.");
    }
  };

  // 5. REMOVER (Delete)
  const removerAbrigo = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este abrigo?")) return;
    try {
      await axios.delete(`http://localhost:3000/abrigos/${id}`);
      setAbrigos(abrigos.filter(a => a.id !== id));
    } catch (err) {
      alert("Erro ao remover abrigo.");
    }
  };

  useEffect(() => { carregarAbrigos(); }, []);

  return (
    <div className="container">
      <header>
        <h1>🆘 AbrigoSeguro</h1>
        <p>Conectando quem precisa a quem pode ajudar</p>
      </header>

      <section className="form-cadastro">
        <h2>{editandoId ? "📝 Editando Abrigo" : "➕ Cadastrar Novo Abrigo"}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nome do Abrigo" value={novoAbrigo.nome} onChange={e => setNovoAbrigo({...novoAbrigo, nome: e.target.value})} required />
          <input type="text" placeholder="Endereço Completo" value={novoAbrigo.endereco} onChange={e => setNovoAbrigo({...novoAbrigo, endereco: e.target.value})} required />
          <input type="number" placeholder="Capacidade Total" value={novoAbrigo.capacidade_total} onChange={e => setNovoAbrigo({...novoAbrigo, capacidade_total: e.target.value})} required />
          <input type="number" placeholder="Vagas Atuais" value={novoAbrigo.vagas_disponiveis} onChange={e => setNovoAbrigo({...novoAbrigo, vagas_disponiveis: e.target.value})} required />
          
          <div className="checkboxes">
            <label><input type="checkbox" checked={novoAbrigo.aceita_pets} onChange={e => setNovoAbrigo({...novoAbrigo, aceita_pets: e.target.checked})} /> Aceita Pets</label>
            <label><input type="checkbox" checked={novoAbrigo.tem_cozinha} onChange={e => setNovoAbrigo({...novoAbrigo, tem_cozinha: e.target.checked})} /> Tem Cozinha</label>
          </div>
          
          <button type="submit" className={editandoId ? "btn-editar" : "btn-enviar"}>
            {editandoId ? "Salvar Alterações" : "Registrar Abrigo"}
          </button>
          {editandoId && <button type="button" className="btn-cancelar" onClick={() => {setEditandoId(null); setNovoAbrigo(estadoInicialForm)}}>Cancelar</button>}
        </form>
      </section>

      <div className="grid-abrigos">
        {abrigos.map((abrigo) => (
          <div key={abrigo.id} className="card">
            <div className="card-header">
              <h2>{abrigo.nome}</h2>
              <div className="card-actions">
                <button className="btn-icon" onClick={() => prepararEdicao(abrigo)}>✏️</button>
                <button className="btn-icon btn-del" onClick={() => removerAbrigo(abrigo.id)}>🗑️</button>
              </div>
            </div>
            
            <p>📍 {abrigo.endereco}</p>
            
            <div className={`status-container ${abrigo.vagas_disponiveis > 0 ? 'vagas' : 'lotado'}`}>
              <button onClick={() => alterarVagas(abrigo.id, abrigo.vagas_disponiveis - 1)}>-</button>
              <div className="vagas-info">
                <span>{abrigo.vagas_disponiveis}</span>
                <small>vagas livres</small>
              </div>
              <button onClick={() => alterarVagas(abrigo.id, abrigo.vagas_disponiveis + 1)}>+</button>
            </div>

            <div className="tags">
              {abrigo.aceita_pets && <span>🐾 Pets</span>}
              {abrigo.tem_cozinha && <span>🍲 Cozinha</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;