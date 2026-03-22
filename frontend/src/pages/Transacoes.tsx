import { useEffect, useState } from "react";
import api from "../api/api";
import { GlassCard } from "../components/GlassCard";
import {
  Grid as Grid,
  Typography,
  Box,
  CircularProgress,
  Button,
  Modal,
  TextField,
  Paper,
  Stack,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  ArrowLeftRight,
  Plus,
  Save,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

export function Transacoes() {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para o Modal
  const [open, setOpen] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | string>("");
  const [tipo, setTipo] = useState("despesa");
  const [pessoaId, setPessoaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregarDados() {
    setLoading(true);
    try {
      // Busca tudo em paralelo para ser mais rápido
      const [resTrans, resPessoas, resCats] = await Promise.all([
        api.get("/transacoes"),
        api.get("/pessoas"),
        api.get("/categorias"),
      ]);
      setTransacoes(resTrans.data || []);
      setPessoas(resPessoas.data || []);
      setCategorias(resCats.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvar = async () => {
    if (!descricao || !valor || !pessoaId || !categoriaId) {
      return alert("Preencha todos os campos!");
    }

    setSalvando(true);
    try {
      await api.post("/transacoes", {
        descricao,
        valor: Number(valor),
        tipo,
        pessoaId,
        categoriaId,
      });
      setOpen(false);
      resetForm();
      carregarDados(); // Recarrega a lista
    } catch (err: any) {
      // Exibe erro de regra de negócio do backend (ex: Menor de idade tentando receita)
      alert(err.response?.data?.message || "Erro ao salvar transação");
    } finally {
      setSalvando(false);
    }
  };

  const resetForm = () => {
    setDescricao("");
    setValor("");
    setTipo("despesa");
    setPessoaId("");
    setCategoriaId("");
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#7c3aed" }} />
      </Box>
    );

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      {/* HEADER */}
      <Box
        sx={{
          mb: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{ bgcolor: "rgba(124, 58, 237, 0.1)", p: 1.5, borderRadius: 3 }}
          >
            <ArrowLeftRight size={32} color="#a78bfa" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 900 }}>
              Movimentações
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Histórico financeiro
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<Plus size={20} />}
          sx={{ bgcolor: "#7c3aed", fontWeight: 700, borderRadius: 2, px: 3 }}
        >
          Nova Transação
        </Button>
      </Box>

      {/* LISTAGEM */}
      <Stack spacing={2}>
        {transacoes.map((t) => (
          <GlassCard
            key={t.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              {t.tipo.toLowerCase() === "receita" ? (
                <ArrowUpCircle size={32} color="#10b981" />
              ) : (
                <ArrowDownCircle size={32} color="#ef4444" />
              )}
              <Box>
                <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                  {t.descricao}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip
                    label={t.categoriaDescricao}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#9ca3af" }}
                  />
                  <Chip
                    label={t.pessoaNome}
                    size="small"
                    sx={{
                      bgcolor: "rgba(124, 58, 237, 0.1)",
                      color: "#a78bfa",
                    }}
                  />
                </Stack>
              </Box>
            </Box>
            <Typography
              sx={{
                color:
                  t.tipo.toLowerCase() === "receita" ? "#10b981" : "#ef4444",
                fontWeight: 900,
                fontSize: "1.2rem",
              }}
            >
              {t.tipo.toLowerCase() === "receita" ? "+ " : "- "}{" "}
              {formatBRL(t.valor)}
            </Typography>
          </GlassCard>
        ))}
      </Stack>

      {/* MODAL DE CADASTRO */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 450,
            bgcolor: "#121214",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#fff", fontWeight: 800, mb: 3 }}
          >
            Nova Transação
          </Typography>

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Descrição"
              variant="filled"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 1,
                input: { color: "#fff" },
                label: { color: "#6b7280" },
              }}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Valor (R$)"
                type="number"
                variant="filled"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 1,
                  input: { color: "#fff" },
                  label: { color: "#6b7280" },
                }}
              />
              <TextField
                select
                fullWidth
                label="Tipo"
                variant="filled"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 1,
                  "& .MuiSelect-select": { color: "#fff" },
                  label: { color: "#6b7280" },
                }}
              >
                <MenuItem value="despesa">Despesa</MenuItem>
                <MenuItem value="receita">Receita</MenuItem>
              </TextField>
            </Stack>

            {/* SELETOR DE PESSOA */}
            <TextField
              select
              fullWidth
              label="Pessoa"
              variant="filled"
              value={pessoaId}
              onChange={(e) => setPessoaId(e.target.value)}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 1,
                "& .MuiSelect-select": { color: "#fff" },
                label: { color: "#6b7280" },
              }}
            >
              {pessoas.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nome} ({p.idade} anos)
                </MenuItem>
              ))}
            </TextField>

            {/* SELETOR DE CATEGORIA */}
            <TextField
              select
              fullWidth
              label="Categoria"
              variant="filled"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 1,
                "& .MuiSelect-select": { color: "#fff" },
                label: { color: "#6b7280" },
              }}
            >
              {categorias.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.descricao}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpen(false)}
              sx={{ color: "#9ca3af", borderColor: "#374151" }}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSalvar}
              disabled={salvando}
              startIcon={
                salvando ? <CircularProgress size={20} /> : <Save size={20} />
              }
              sx={{ bgcolor: "#7c3aed", "&:hover": { bgcolor: "#6d28d9" } }}
            >
              Salvar
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}
