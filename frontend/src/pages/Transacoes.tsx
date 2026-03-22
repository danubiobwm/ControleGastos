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
  Avatar,
} from "@mui/material";
import {
  ArrowLeftRight,
  Plus,
  Save,
  ArrowUpCircle,
  ArrowDownCircle,
  MoveRight,
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

  const inputStyle = {
    bgcolor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 1,
    "& .MuiInputBase-input": { color: "#fff" },
    "& .MuiInputLabel-root": { color: "#9ca3af" },
    "& .MuiSelect-icon": { color: "#fff" },
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
    if (!descricao || !valor || !pessoaId || !categoriaId)
      return alert("Campos obrigatórios!");
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
      alert(err.response?.data?.message || "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
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
            Extrato Detalhado
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
          <GlassCard key={t.id} sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                {t.tipo.toLowerCase() === "receita" ? (
                  <ArrowUpCircle color="#10b981" size={32} />
                ) : (
                  <ArrowDownCircle color="#ef4444" size={32} />
                )}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#a78bfa",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                    }}
                  >
                    {t.categoriaNome} • {t.pessoaNome}
                  </Typography>
                  <Typography
                    sx={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}
                  >
                    {t.descricao}
                  </Typography>
                </Box>
              </Box>
              <Typography
                sx={{
                  color:
                    t.tipo.toLowerCase() === "receita" ? "#10b981" : "#ef4444",
                  fontWeight: 900,
                  fontSize: "1.3rem",
                }}
              >
                {t.tipo.toLowerCase() === "receita" ? "+ " : "- "}{" "}
                {formatBRL(t.valor)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                pt: 1.5,
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Saldo:
              </Typography>
              <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                {formatBRL(t.saldoAnterior)}
              </Typography>
              <MoveRight size={12} color="#4b5563" />
              <Typography
                variant="caption"
                sx={{ color: "#fff", fontWeight: 700 }}
              >
                {formatBRL(t.saldoAtual)}
              </Typography>
            </Box>
          </GlassCard>
        ))}
      </Stack>

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
            <Button
              fullWidth
              variant="contained"
              onClick={handleSalvar}
              disabled={salvando}
              sx={{ mt: 2, bgcolor: "#7c3aed" }}
            >
              {salvando ? "Processando..." : "Confirmar"}
            </Button>
          </Stack>
        </Paper>
      </Modal>
    </Box>
  );
}
