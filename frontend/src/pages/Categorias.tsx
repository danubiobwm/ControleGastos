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
  IconButton,
  Stack,
  MenuItem,
} from "@mui/material";
import { Tag, Plus, Save, Pencil, Trash2, Filter } from "lucide-react";

export function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState("despesa");
  const [salvando, setSalvando] = useState(false);

  async function carregarCategorias() {
    setLoading(true);
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleOpenModal = (cat?: any) => {
    if (cat) {
      setEditId(cat.id);
      setDescricao(cat.descricao);
      setFinalidade(cat.finalidade);
    } else {
      setEditId(null);
      setDescricao("");
      setFinalidade("despesa");
    }
    setOpen(true);
  };

  const handleSalvar = async () => {
    if (!descricao.trim()) return alert("Digite uma descrição!");

    setSalvando(true);
    try {
      const payload = { descricao, finalidade };
      if (editId) {
        await api.put(`/categorias/${editId}`, payload);
      } else {
        await api.post("/categorias", payload);
      }
      setOpen(false);
      carregarCategorias();
    } catch (err) {
      alert("Erro ao salvar categoria.");
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm("Excluir esta categoria?")) {
      try {
        await api.delete(`/categorias/${id}`);
        carregarCategorias();
      } catch (err) {
        alert("Erro ao deletar.");
      }
    }
  };

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
            <Tag size={32} color="#a78bfa" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 900 }}>
              Categorias
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Gerencie os tipos de gastos e receitas
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={() => handleOpenModal()}
          startIcon={<Plus size={20} />}
          sx={{ bgcolor: "#7c3aed", fontWeight: 700, borderRadius: 2, px: 3 }}
        >
          Nova Categoria
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categorias.map((cat) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={cat.id}>
            <GlassCard
              sx={{
                position: "relative",
                py: 3,
                borderLeft: `6px solid ${cat.finalidade === "receita" ? "#10b981" : "#ef4444"}`,
              }}
            >
              <Box sx={{ position: "absolute", top: 5, right: 5 }}>
                <IconButton
                  size="small"
                  onClick={() => handleOpenModal(cat)}
                  sx={{ color: "#a78bfa" }}
                >
                  <Pencil size={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeletar(cat.id)}
                  sx={{ color: "#ef4444" }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Box>

              <Typography
                variant="h6"
                sx={{ color: "#fff", fontWeight: 800, mb: 1 }}
              >
                {cat.descricao}
              </Typography>
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor:
                    cat.finalidade === "receita"
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                  color: cat.finalidade === "receita" ? "#10b981" : "#ef4444",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                {cat.finalidade}
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            bgcolor: "#121214",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#fff", fontWeight: 800, mb: 3 }}
          >
            {editId ? "Editar Categoria" : "Nova Categoria"}
          </Typography>

          <Stack spacing={2}>
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
            <TextField
              select
              fullWidth
              label="Finalidade"
              variant="filled"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 1,
                "& .MuiSelect-select": { color: "#fff" },
                label: { color: "#6b7280" },
              }}
            >
              <MenuItem value="despesa">Despesa</MenuItem>
              <MenuItem value="receita">Receita</MenuItem>
              <MenuItem value="ambas">Ambas</MenuItem>
            </TextField>
          </Stack>

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              fullWidth
              variant="outlined"
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
              startIcon={
                salvando ? <CircularProgress size={20} /> : <Save size={20} />
              }
              sx={{ bgcolor: "#7c3aed" }}
            >
              Salvar
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}
