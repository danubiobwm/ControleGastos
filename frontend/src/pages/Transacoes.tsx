import { useEffect, useState } from "react";
import api from "../api/api";
import { GlassCard } from "../components/GlassCard";
import {
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

  const [open, setOpen] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | string>("");
  const [tipo, setTipo] = useState("despesa");
  const [pessoaId, setPessoaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Estilo padrão para os inputs aparecerem brancos no fundo escuro
  const inputStyle = {
    bgcolor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 1,
    "& .MuiInputBase-input": { color: "#fff" }, // Texto digitado
    "& .MuiInputLabel-root": { color: "#9ca3af" }, // Label normal
    "& .MuiInputLabel-root.Mui-focused": { color: "#a78bfa" }, // Label focada
    "& .MuiFilledInput-underline:before": {
      borderBottomColor: "rgba(255,255,255,0.1)",
    },
    "& .MuiSelect-icon": { color: "#fff" }, // Ícone do dropdown
  };

  async function carregarDados() {
    try {
      const [resT, resP, resC] = await Promise.all([
        api.get("/transacoes"),
        api.get("/pessoas"),
        api.get("/categorias"),
      ]);
      setTransacoes(resT.data || []);
      setPessoas(resP.data || []);
      setCategorias(resC.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvar = async () => {
    if (!descricao || !valor || !pessoaId || !categoriaId) {
      return alert("Por favor, preencha todos os campos.");
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
      setDescricao("");
      setValor("");
      carregarDados();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao salvar transação.");
    } finally {
      setSalvando(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4, width: "100%" }}>
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
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 900 }}>
            Movimentações
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<Plus />}
          sx={{ bgcolor: "#7c3aed" }}
        >
          Nova Transação
        </Button>
      </Box>

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
              {t.tipo === "receita" ? (
                <ArrowUpCircle color="#10b981" />
              ) : (
                <ArrowDownCircle color="#ef4444" />
              )}
              <Box>
                <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                  {t.descricao}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip
                    label={t.categoria?.descricao}
                    size="small"
                    sx={{ color: "#9ca3af", borderColor: "#374151" }}
                    variant="outlined"
                  />
                  <Chip
                    label={t.pessoa?.nome}
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
                color: t.tipo === "receita" ? "#10b981" : "#ef4444",
                fontWeight: 900,
                fontSize: "1.2rem",
              }}
            >
              {t.tipo === "receita" ? "+ " : "- "} R${" "}
              {t.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Typography>
          </GlassCard>
        ))}
      </Stack>

      {/* MODAL CORRIGIDO */}
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
            bgcolor: "#1a1a1e",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: 24,
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#fff", mb: 3, fontWeight: 700 }}
          >
            Nova Transação
          </Typography>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Descrição"
              variant="filled"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              sx={inputStyle}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Valor"
                type="number"
                variant="filled"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                sx={inputStyle}
              />
              <TextField
                select
                fullWidth
                label="Tipo"
                variant="filled"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                sx={inputStyle}
              >
                <MenuItem value="despesa">Despesa</MenuItem>
                <MenuItem value="receita">Receita</MenuItem>
              </TextField>
            </Stack>

            <TextField
              select
              fullWidth
              label="Pessoa"
              variant="filled"
              value={pessoaId}
              onChange={(e) => setPessoaId(e.target.value)}
              sx={inputStyle}
            >
              {pessoas.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nome} ({p.idade} anos)
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Categoria"
              variant="filled"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              sx={inputStyle}
            >
              {categorias
                .filter(
                  (c) => c.finalidade === "ambas" || c.finalidade === tipo,
                )
                .map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.descricao}
                  </MenuItem>
                ))}
            </TextField>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                fullWidth
                onClick={() => setOpen(false)}
                sx={{ color: "#9ca3af" }}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSalvar}
                disabled={salvando}
                sx={{ bgcolor: "#7c3aed", "&:hover": { bgcolor: "#6d28d9" } }}
              >
                {salvando ? "Processando..." : "Salvar"}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Modal>
    </Box>
  );
}
