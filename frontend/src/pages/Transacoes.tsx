import { useEffect, useState } from "react";
import api from "../api/api";
import { Plus, X, ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react";

export function Transacoes() {
  const [data, setData] = useState({ t: [], p: [], c: [] });
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    descricao: "",
    valor: 0,
    tipo: "despesa",
    pessoaId: "",
    categoriaId: "",
  });

  const load = async () => {
    const [t, p, c] = await Promise.all([
      api.get("/transacoes"),
      api.get("/pessoas"),
      api.get("/categorias"),
    ]);
    setData({ t: t.data, p: p.data, c: c.data });
  };
  useEffect(() => {
    load();
  }, []);

  const save = async (e: any) => {
    e.preventDefault();
    setError("");
    const pessoa: any = data.p.find((p: any) => p.id === form.pessoaId);
    const cat: any = data.c.find((c: any) => c.id === form.categoriaId);

    if (form.tipo === "receita" && pessoa?.idade < 18)
      return setError("ERRO #11: Menores não podem registrar RECEITA.");
    if (cat?.finalidade !== "ambas" && cat?.finalidade !== form.tipo)
      return setError(`ERRO #12: Categoria exclusiva para ${cat.finalidade}.`);

    try {
      await api.post("/transacoes", form);
      setModal(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro no Servidor");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-8 items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          LANÇAMENTOS FINANCEIROS
        </h2>
        <button
          onClick={() => setModal(true)}
          className="bg-purple-600 px-4 py-2 rounded-lg font-bold flex gap-2 items-center"
        >
          <Plus size={18} /> Nova Transação
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="p-4">Descrição</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Pessoa</th>
              <th className="p-4">Categoria</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.t.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-800/50">
                <td className="p-4 flex gap-2 items-center">
                  {t.tipo === "receita" ? (
                    <ArrowUpCircle className="text-green-500" size={18} />
                  ) : (
                    <ArrowDownCircle className="text-red-500" size={18} />
                  )}{" "}
                  {t.descricao}
                </td>
                <td
                  className={`p-4 font-bold ${t.tipo === "receita" ? "text-green-400" : "text-red-400"}`}
                >
                  R$ {t.valor.toFixed(2)}
                </td>
                <td className="p-4 text-slate-400">{t.pessoaNome}</td>
                <td className="p-4 text-slate-400">{t.categoriaDescricao}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={async () => {
                      await api.delete(`/transacoes/${t.id}`);
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
            className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 w-full max-w-lg shadow-2xl"
          >
            <div className="flex justify-between mb-6 items-center">
              <h3 className="text-xl font-bold">Nova Transação</h3>
              <X onClick={() => setModal(false)} className="cursor-pointer" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                required
                className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
                onChange={(e) => setForm({ ...form, pessoaId: e.target.value })}
              >
                <option value="">Morador ▼</option>
                {data.p.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.idade} anos)
                  </option>
                ))}
              </select>
              <select
                required
                className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
                onChange={(e) =>
                  setForm({ ...form, categoriaId: e.target.value })
                }
              >
                <option value="">Categoria ▼</option>
                {data.c.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.descricao}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 p-3 bg-slate-900 rounded-lg justify-around my-4 text-sm font-bold">
              <label className="flex gap-2 items-center">
                <input
                  type="radio"
                  checked={form.tipo === "receita"}
                  onChange={() => setForm({ ...form, tipo: "receita" })}
                />{" "}
                RECEITA
              </label>
              <label className="flex gap-2 items-center">
                <input
                  type="radio"
                  checked={form.tipo === "despesa"}
                  onChange={() => setForm({ ...form, tipo: "despesa" })}
                />{" "}
                DESPESA
              </label>
            </div>
            <input
              placeholder="Descrição"
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg mb-4"
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Valor R$ 0,00"
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-sky-400 font-bold text-xl mb-4"
              onChange={(e) =>
                setForm({ ...form, valor: Number(e.target.value) })
              }
            />
            {error && (
              <p className="text-red-400 bg-red-900/20 p-3 rounded border border-red-900/50 text-sm font-bold mb-4">
                {error}
              </p>
            )}
            <button className="w-full bg-purple-600 p-4 rounded-xl font-bold text-lg shadow-lg">
              LANÇAR TRANSAÇÃO
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
