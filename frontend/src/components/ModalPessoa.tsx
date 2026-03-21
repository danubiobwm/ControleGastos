import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import api from "../api/api";

interface ModalPessoaProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalPessoa({ open, onClose, onSuccess }: ModalPessoaProps) {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!nome) return;
    setLoading(true);
    try {
      await api.post("/pessoas", { nome });
      setNome("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>Nova Pessoa</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Nome da Pessoa"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: "#9ca3af" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSalvar}
          variant="contained"
          disabled={loading}
          sx={{
            background: "linear-gradient(90deg, #7c3aed, #9333ea)",
            fontWeight: 700,
          }}
        >
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
