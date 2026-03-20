import { useEffect, useState } from "react";
import api from "../api/api";
import { Trash2, Edit, Plus, X, UserPlus } from "lucide-react";

interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nome: "", idade: 0 });

  useEffect(() => {
    carregarPessoas();
  }, []);

  async function carregarPessoas() {
    const res = await api.get("/pessoas");
    setPessoas(res.data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) await api.put(`/pessoas/${editingId}`, formData);
    else await api.post("/pessoas", formData);

    setFormData({ nome: "", idade: 0 });
    setEditingId(null);
    setIsModalOpen(false);
    carregarPessoas();
  }

  function handleEdit(p: Pessoa) {
    setFormData({ nome: p.nome, idade: p.idade });
    setEditingId(p.id);
    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (confirm("Deseja excluir? As transações vinculadas serão apagadas.")) {
      await api.delete(`/pessoas/${id}`);
      carregarPessoas();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-100">
            Gerenciamento de Pessoas
          </h2>
          <p className="text-slate-400 mt-1">
            Cadastre os moradores da residência
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingId(null);
            setFormData({ nome: "", idade: 0 });
          }}
          className="bg-purple-600 text-white px-5 py-2.5 rounded-xl flex items-center hover:bg-opacity-80 transition shadow-lg shadow-purple-900/20 active:scale-95"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Nova Pessoa
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-xl shadow-xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-slate-200">
          <thead className="bg-[#0f172a] border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-300">
                Nome do Morador
              </th>
              <th className="px-6 py-4 font-semibold text-slate-300">Idade</th>
              <th className="px-6 py-4 font-semibold text-slate-300 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pessoas.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-5 font-medium">{p.nome}</td>
                <td className="px-6 py-5 text-slate-300">{p.idade} anos</td>
                <td className="px-6 py-5 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-sky-400 hover:text-sky-300 p-2 rounded-lg hover:bg-sky-400/10"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-gray-100">
                {editingId ? "Editar" : "Nova"} Pessoa
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  className="w-full border border-slate-700 bg-[#0f172a] text-gray-100 rounded-xl p-3 focus:ring-1 focus:ring-sky-400 outline-none transition"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Idade
                </label>
                <input
                  type="number"
                  required
                  className="w-full border border-slate-700 bg-[#0f172a] text-gray-100 rounded-xl p-3 focus:ring-1 focus:ring-sky-400 outline-none transition"
                  value={formData.idade || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      idade: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-500 transition font-bold text-lg shadow-lg active:scale-95 mt-4"
              >
                {editingId ? "Salvar Alterações" : "Cadastrar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
