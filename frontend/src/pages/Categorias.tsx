import { useEffect, useState } from "react";
import api from "../api/api";
import { Plus, Trash2, X } from "lucide-react";

export function Categorias() {
  const [cats, setCats] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ descricao: "", finalidade: "ambas" });

  const load = () => api.get("/categorias").then((r) => setCats(r.data));
  useEffect(() => {
    load();
  }, []);

  const save = async (e: any) => {
    e.preventDefault();
    await api.post("/categorias", form);
    setModal(false);
    setForm({ descricao: "", finalidade: "ambas" });
    load();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-8 items-center">
        <h2 className="text-2xl font-bold">CATEGORIAS</h2>
        <button
          onClick={() => setModal(true)}
          className="bg-purple-600 px-4 py-2 rounded-lg font-bold flex gap-2 items-center"
        >
          <Plus size={18} /> Nova Categoria
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-slate-800">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="p-4">Descrição</th>
              <th className="p-4">Finalidade</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {cats.map((c: any) => (
              <tr key={c.id} className="hover:bg-slate-800/50">
                <td className="p-4 text-white font-medium">{c.descricao}</td>
                <td className="p-4">
                  <span className="bg-slate-900 px-3 py-1 rounded text-xs uppercase">
                    {c.finalidade}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={async () => {
                      await api.delete(`/categorias/${c.id}`);
                      load();
                    }}
                    className="text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={save}
            className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between mb-6 items-center">
              <h3 className="text-xl font-bold">Nova Categoria</h3>
              <X onClick={() => setModal(false)} className="cursor-pointer" />
            </div>
            <div className="space-y-4">
              <label className="block">
                Descrição:
                <input
                  required
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg mt-1"
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                />
              </label>
              <div className="flex gap-4 p-3 bg-slate-900 rounded-lg justify-around">
                {["receita", "despesa", "ambas"].map((f) => (
                  <label
                    key={f}
                    className="flex gap-2 items-center text-sm capitalize"
                  >
                    <input
                      type="radio"
                      name="fin"
                      checked={form.finalidade === f}
                      onChange={() => setForm({ ...form, finalidade: f })}
                    />{" "}
                    {f}
                  </label>
                ))}
              </div>
              <button className="w-full bg-purple-600 p-3 rounded-lg font-bold mt-4">
                SALVAR CATEGORIA
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
