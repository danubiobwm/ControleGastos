import { useEffect, useState } from "react";
import api from "../api/api";
import { Plus, ArrowUpCircle, ArrowDownCircle, X, Search } from "lucide-react";

export function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    valor: 0,
    tipo: "despesa",
    pessoaId: "",
    categoriaId: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const [t, p, c] = await Promise.all([
      api.get("/transacoes"),
      api.get("/pessoas"),
      api.get("/categorias"),
    ]);
    setTransacoes(t.data);
    setPessoas(p.data);
    setCategorias(c.data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/transacoes", formData);
      setIsModalOpen(false);
      carregarDados();
      setFormData({
        descricao: "",
        valor: 0,
        tipo: "despesa",
        pessoaId: "",
        categoriaId: "",
      });
    } catch (err: any) {
      alert(err.response?.data || "Erro na validação do Backend");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Transações</h2>
          <p className="text-gray-400">
            Gerencie entradas e saídas financeiras
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20"
        >
          <Plus size={20} /> Novo Lançamento
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#161e2b]">
            <tr>
              <th className="p-4 text-gray-400 font-medium border-b border-gray-800">
                Descrição
              </th>
              <th className="p-4 text-gray-400 font-medium border-b border-gray-800">
                Pessoa
              </th>
              <th className="p-4 text-gray-400 font-medium border-b border-gray-800">
                Tipo
              </th>
              <th className="p-4 text-gray-400 font-medium border-b border-gray-800 text-right">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {transacoes.map((t: any) => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{t.descricao}</td>
                <td className="p-4 text-gray-300">{t.pessoaNome}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${t.tipo === "receita" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                  >
                    {t.tipo === "receita" ? (
                      <ArrowUpCircle size={14} />
                    ) : (
                      <ArrowDownCircle size={14} />
                    )}
                    {t.tipo}
                  </span>
                </td>
                <td
                  className={`p-4 text-right font-mono font-bold text-lg ${t.tipo === "receita" ? "text-green-400" : "text-red-400"}`}
                >
                  R${" "}
                  {t.valor.toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-gray-700 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Novo Lançamento</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <select
                  required
                  className="w-full bg-[#0f172a] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-purple-500"
                  value={formData.pessoaId}
                  onChange={(e) =>
                    setFormData({ ...formData, pessoaId: e.target.value })
                  }
                >
                  <option value="">Selecione a Pessoa...</option>
                  {pessoas.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
                <select
                  required
                  className="w-full bg-[#0f172a] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-purple-500"
                  value={formData.categoriaId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoriaId: e.target.value })
                  }
                >
                  <option value="">Selecione a Categoria...</option>
                  {categorias.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.descricao}
                    </option>
                  ))}
                </select>
                <div className="flex bg-[#0f172a] rounded-xl p-1 border border-gray-700">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tipo: "receita" })
                    }
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${formData.tipo === "receita" ? "bg-green-600 text-white" : "text-gray-500"}`}
                  >
                    RECEITA
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tipo: "despesa" })
                    }
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${formData.tipo === "despesa" ? "bg-red-600 text-white" : "text-gray-500"}`}
                  >
                    DESPESA
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Descrição"
                  required
                  className="w-full bg-[#0f172a] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-purple-500"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor R$"
                  required
                  className="w-full bg-[#0f172a] border border-gray-700 p-3 rounded-xl text-white text-2xl font-bold outline-none focus:border-purple-500 text-sky-400"
                  value={formData.valor || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valor: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold mt-2 transition-all"
              >
                SALVAR TRANSAÇÃO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
