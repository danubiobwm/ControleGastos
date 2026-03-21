import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
} from "@mui/material";
import api from "../api/api";

interface ModalTransacaoProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalTransacao({
  open,
  onClose,
  onSuccess,
}: ModalTransacaoProps) {
  const [loading, setLoading] = useState(false);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    tipo: "despesa",
    pessoaId: "",
    categoriaId: "",
  });

  useEffect(() => {
    if (open) {
      api.get("/pessoas").then((res) => setPessoas(res.data));
      api.get("/categorias").then((res) => setCategorias(res.data));
    }
  }, [open]);

  const handleSalvar = async () => {
    if (!form.descricao || !form.valor || !form.pessoaId || !form.categoriaId) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        descricao: form.descricao,
        valor: Number(form.valor),
        tipo: form.tipo,
        pessoaId: form.pessoaId,
        categoriaId: form.categoriaId,
      };

      await api.post("/transacoes", payload);

      setForm({
        descricao: "",
        valor: "",
        tipo: "despesa",
        pessoaId: "",
        categoriaId: "",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro detalhado da API:", error.response?.data);

      const erroApi = error.response?.data;
      const mensagemAmigavel =
        typeof erroApi === "string"
          ? erroApi
          : erroApi?.message ||
            "Erro 400: Verifique se a pessoa é maior de idade ou se a categoria permite este tipo de transação.";

      alert(mensagemAmigavel);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Nova Transação</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Descrição"
            fullWidth
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Valor (R$)"
              type="number"
              fullWidth
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
            />
            <TextField
              select
              label="Tipo"
              sx={{ minWidth: 150 }}
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <MenuItem value="receita">Receita</MenuItem>
              <MenuItem value="despesa">Despesa</MenuItem>
            </TextField>
          </Box>

          <TextField
            select
            label="Pessoa"
            fullWidth
            value={form.pessoaId}
            onChange={(e) => setForm({ ...form, pessoaId: e.target.value })}
          >
            {pessoas.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.nome} {p.idade < 18 ? "(Menor)" : "(Maior)"}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Categoria"
            fullWidth
            value={form.categoriaId}
            onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
          >
            {categorias.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.descricao} ({c.finalidade})
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSalvar}
          variant="contained"
          disabled={loading}
          sx={{ background: "linear-gradient(90deg, #7c3aed, #9333ea)", px: 4 }}
        >
          {loading ? "PROCESSANDO..." : "SALVAR"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
