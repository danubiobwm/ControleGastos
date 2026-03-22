import { useState } from "react";
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

interface ModalCategoriaProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalCategoria({
  open,
  onClose,
  onSuccess,
}: ModalCategoriaProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("despesa");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!nome) return;
    setLoading(true);

    try {
      await api.post("/categorias", {
        descricao: nome,
        finalidade: tipo,
      });

      setNome("");
      setTipo("despesa");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      alert("Erro ao salvar. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: "1.5rem" }}>
        Nova Categoria
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            label="Nome da Categoria"
            placeholder="Ex: Pet, Feira, Aluguel"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <TextField
            select
            fullWidth
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <MenuItem value="receita">Receita</MenuItem>
            <MenuItem value="despesa">Despesa</MenuItem>
            <MenuItem value="ambas">Ambas (Receita/Despesa)</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: "#9ca3af", fontWeight: 700 }}>
          CANCELAR
        </Button>
        <Button
          onClick={handleSalvar}
          variant="contained"
          disabled={loading}
          sx={{
            background: "linear-gradient(90deg, #7c3aed, #9333ea)",
            fontWeight: 800,
            px: 4,
            borderRadius: 2,
          }}
        >
          {loading ? "SALVANDO..." : "SALVAR"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
