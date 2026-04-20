import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [abrigos, setAbrigos] = useState([]);
  // Estado para o formulário
  const [novoAbrigo, setNovoAbrigo] = useState({
    nome: '', endereco: '', telefone: '', capacidade_total: '', vagas_disponiveis: '', aceita_pets: false, tem_cozinha: false
  });

  const carregarAbrigos = async () => {
    try {
      const resposta = await axios.get('http://localhost:3000/abrigos');
      setAbrigos(resposta.data);
    } catch (err) {
      console.error("Erro ao buscar abrigos", err);
    }
  };

  const cadastrarAbrigo = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/abrigos', novoAbrigo);
      setAbrigos([...abrigos, res.data]); // Adiciona o novo na lista sem dar F5
      setNovoAbrigo({ nome: '', endereco: '', telefone: '', capacidade_total: '', vagas_disponiveis: '', aceita_pets: false, tem_cozinha: false }); // Limpa campos
    } catch (err) {
      alert("Erro ao cadastrar. Verifique os dados.");
    }
  };

  const alterarVagas = async (id, novaQuantidade) => {
    if (novaQuantidade < 0) return;
    try {
      await axios.patch(`http://localhost:3000/abrigos/${id}/vagas`, { vagas_disponiveis: novaQuantidade });
      setAbrigos(abrigos.map(a => a.id === id ? { ...a, vagas_disponiveis: novaQuantidade } : a));
    } catch (err) {
      alert("Erro ao atualizar.");
    }
  };

  useEffect(() => { carregarAbrigos(); }, []);

  return (
    <div className="container">
      <header>
        <h1>🆘 AbrigoSeguro</h1>
        <p>Conectando quem precisa a quem pode ajudar</p>
      </header>

      {/* FORMULÁRIO DE CADASTRO */}
      <section className="form-cadastro">
        <h2>Cadastrar Novo Abrigo</h2>
        <form onSubmit={cadastrarAbrigo}>
          <input type="text" placeholder="Nome do Abrigo" value={novoAbrigo.nome} onChange={e => setNovoAbrigo({...novoAbrigo, nome: e.target.value})} required />
          <input type="text" placeholder="Endereço Completo" value={novoAbrigo.endereco} onChange={e => setNovoAbrigo({...novoAbrigo, endereco: e.target.value})} required />
          <input type="number" placeholder="Capacidade Total" value={novoAbrigo.capacidade_total} onChange={e => setNovoAbrigo({...novoAbrigo, capacidade_total: e.target.value})} required />
          <input type="number" placeholder="Vagas Iniciais" value={novoAbrigo.vagas_disponiveis} onChange={e => setNovoAbrigo({...novoAbrigo, vagas_disponiveis: e.target.value})} required />
          <div className="checkboxes">
            <label><input type="checkbox" checked={novoAbrigo.aceita_pets} onChange={e => setNovoAbrigo({...novoAbrigo, aceita_pets: e.target.checked})} /> Aceita Pets</label>
            <label><input type="checkbox" checked={novoAbrigo.tem_cozinha} onChange={e => setNovoAbrigo({...novoAbrigo, tem_cozinha: e.target.checked})} /> Tem Cozinha</label>
          </div>
          <button type="submit" className="btn-enviar">Registrar Abrigo</button>
        </form>
      </section>

      <hr />

      <div className="grid-abrigos">
        {abrigos.map((abrigo) => (
          <div key={abrigo.id} className="card">
            {/* ... (mesmo conteúdo do card anterior) ... */}
            <h2>{abrigo.nome}</h2>
            <p>📍 {abrigo.endereco}</p>
            <div className={`status-container ${abrigo.vagas_disponiveis > 0 ? 'vagas' : 'lotado'}`}>
              <button onClick={() => alterarVagas(abrigo.id, abrigo.vagas_disponiveis - 1)}>-</button>
              <div className="vagas-info">
                <span>{abrigo.vagas_disponiveis}</span>
                <small>vagas livres</small>
              </div>
              <button onClick={() => alterarVagas(abrigo.id, abrigo.vagas_disponiveis + 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App