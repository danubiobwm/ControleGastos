import { useEffect, useState } from "react";
import api from "../api/api";
import { Tag, Plus, X } from "lucide-react";

interface Categoria {
  id: string;
  descricao: string;
  finalidade: string;
}

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    finalidade: "ambas",
  });

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    const res = await api.get("/categorias");
    setCategorias(res.data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/categorias", formData);
    setFormData({ descricao: "", finalidade: "ambas" });
    setIsModalOpen(false);
    carregarCategorias();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100 text-brand-blue-accent">
          Categorias
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-purple-btn text-white px-4 py-2 rounded-lg flex items-center hover:bg-opacity-80 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map((c) => (
          <div
            key={c.id}
            className="bg-brand-dark-card p-5 rounded-xl border border-gray-700 shadow-lg flex justify-between items-center"
          >
            <div>
              <p className="text-gray-100 font-semibold text-lg">
                {c.descricao}
              </p>
              <span
                className={`text-xs uppercase px-2 py-1 rounded font-bold ${
                  c.finalidade === "receita"
                    ? "bg-green-900 text-green-300"
                    : c.finalidade === "despesa"
                      ? "bg-red-900 text-red-300"
                      : "bg-blue-900 text-blue-300"
                }`}
              >
                {c.finalidade}
              </span>
            </div>
            <Tag className="text-gray-600 w-8 h-8 opacity-20" />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-brand-dark-card rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-100">
                Nova Categoria
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  maxLength={400}
                  className="w-full border border-gray-600 bg-brand-dark-bg text-gray-100 rounded-lg p-2.5 focus:ring-1 focus:ring-brand-blue-accent outline-none"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Finalidade
                </label>
                <select
                  className="w-full border border-gray-600 bg-brand-dark-bg text-gray-100 rounded-lg p-2.5 outline-none"
                  value={formData.finalidade}
                  onChange={(e) =>
                    setFormData({ ...formData, finalidade: e.target.value })
                  }
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                  <option value="ambas">Ambas</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-brand-purple-btn text-white py-2.5 rounded-lg hover:bg-opacity-80 transition font-semibold"
              >
                Salvar Categoria
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
