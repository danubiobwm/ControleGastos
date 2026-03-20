import { useEffect, useState } from "react";

import { Trash2, Edit, Plus, X } from "lucide-react";
import api from "../api/api";

interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

interface PessoaRequest {
  nome: string;
  idade: number;
}

export function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<PessoaRequest>({
    nome: "",
    idade: 0,
  });

  useEffect(() => {
    carregarPessoas();
  }, []);

  async function carregarPessoas() {
    const res = await api.get("/pessoas");
    setPessoas(res.data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      await api.put(`/pessoas/${editingId}`, formData);
    } else {
      await api.post("/pessoas", formData);
    }

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
    if (
      confirm(
        "Tem certeza? Todas as transações desta pessoa serão apagadas do banco.",
      )
    ) {
      await api.delete(`/pessoas/${id}`);
      carregarPessoas();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">
          Gerenciamento de Pessoas
        </h2>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingId(null);
            setFormData({ nome: "", idade: 0 });
          }}
          className="bg-brand-purple-btn text-white px-4 py-2 rounded-lg flex items-center hover:bg-opacity-80 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Pessoa
        </button>
      </div>

      <div className="bg-brand-dark-card rounded-lg shadow-xl overflow-hidden">
        <table className="w-full text-left text-gray-200">
          <thead className="bg-brand-dark-bg bg-opacity-40 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-300">Nome</th>
              <th className="px-6 py-3 font-semibold text-gray-300">Idade</th>
              <th className="px-6 py-3 font-semibold text-gray-300 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-700 hover:bg-brand-dark-bg hover:bg-opacity-50"
              >
                <td className="px-6 py-4">{p.nome}</td>
                <td className="px-6 py-4">{p.idade} anos</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-brand-blue-accent hover:text-blue-300 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-300 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-brand-dark-card rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-100">
                {editingId ? "Editar" : "Nova"} Pessoa
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  maxLength={200}
                  required
                  className="w-full border border-gray-600 bg-brand-dark-bg text-gray-100 rounded-lg p-2.5 focus:ring-1 focus:ring-brand-blue-accent"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Idade
                </label>
                <input
                  type="number"
                  required
                  className="w-full border border-gray-600 bg-brand-dark-bg text-gray-100 rounded-lg p-2.5 focus:ring-1 focus:ring-brand-blue-accent"
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
                className="w-full bg-brand-purple-btn text-white py-2.5 rounded-lg hover:bg-opacity-80 transition"
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
