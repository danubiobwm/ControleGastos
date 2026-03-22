import { useEffect, useState } from "react";
import api from "../api/api";
import { GlassCard } from "../components/GlassCard";
import {
  Grid as Grid,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Button,
  Modal,
  TextField,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import { Users, Plus, Save, Pencil, Trash2, Calendar } from "lucide-react";

export function Pessoas() {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState<number | string>("");
  const [salvando, setSalvando] = useState(false);

  async function carregarPessoas() {
    setLoading(true);
    try {
      const response = await api.get("/pessoas");
      setPessoas(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarPessoas();
  }, []);

  const handleOpenModal = (pessoa?: any) => {
    if (pessoa) {
      setEditId(pessoa.id);
      setNome(pessoa.nome);
      setIdade(pessoa.idade);
    } else {
      setEditId(null);
      setNome("");
      setIdade("");
    }
    setOpen(true);
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !idade) return alert("Preencha todos os campos!");

    setSalvando(true);
    try {
      const payload = { nome, idade: Number(idade) };

      if (editId) {
        await api.put(`/pessoas/${editId}`, payload);
      } else {
        await api.post("/pessoas", payload);
      }

      setOpen(false);
      carregarPessoas();
    } catch (err) {
      alert("Erro ao processar requisição.");
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (id: string) => {
    if (
      window.confirm(
        "Deseja realmente excluir esta pessoa e todas as suas transações?",
      )
    ) {
      try {
        await api.delete(`/pessoas/${id}`);
        carregarPessoas();
      } catch (err) {
        alert("Erro ao deletar.");
      }
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
            <Users size={32} color="#a78bfa" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 900 }}>
              Membros
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              {pessoas.length} pessoas cadastradas
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={() => handleOpenModal()}
          startIcon={<Plus size={20} />}
          sx={{ bgcolor: "#7c3aed", fontWeight: 700, borderRadius: 2, px: 3 }}
        >
          Nova Pessoa
        </Button>
      </Box>

      <Grid container spacing={3}>
        {pessoas.map((pessoa) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pessoa.id}>
            <GlassCard
              sx={{
                position: "relative",
                py: 4,
                textAlign: "center",
                borderBottom: "4px solid #7c3aed",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  display: "flex",
                  gap: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleOpenModal(pessoa)}
                  sx={{ color: "#a78bfa" }}
                >
                  <Pencil size={18} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeletar(pessoa.id)}
                  sx={{ color: "#ef4444" }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Box>

              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#7c3aed",
                  mx: "auto",
                  mb: 2,
                  fontSize: "1.5rem",
                  fontWeight: 800,
                }}
              >
                {pessoa.nome?.charAt(0).toUpperCase()}
              </Avatar>

              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>
                {pessoa.nome}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 1, color: "#6b7280" }}
              >
                <Calendar size={14} />
                <Typography variant="body2">{pessoa.idade} anos</Typography>
              </Stack>
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
            {editId ? "Editar Pessoa" : "Nova Pessoa"}
          </Typography>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Nome"
              variant="filled"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 1,
                input: { color: "#fff" },
                label: { color: "#6b7280" },
              }}
            />
            <TextField
              fullWidth
              label="Idade"
              type="number"
              variant="filled"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 1,
                input: { color: "#fff" },
                label: { color: "#6b7280" },
              }}
            />
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
