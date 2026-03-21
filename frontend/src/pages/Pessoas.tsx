import { useEffect, useState } from "react";
import api from "../api/api";
import { AppLayout } from "../layouts/AppLayout";
import { GlassCard } from "../components/GlassCard";
import { Grid, Typography, Avatar, Box } from "@mui/material";
import { ModalPessoa } from "../components/ModalPessoa";

export function Pessoas() {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  const carregarPessoas = () => {
    api.get("/pessoas").then((res) => setPessoas(res.data));
  };

  useEffect(() => {
    carregarPessoas();
  }, []);

  return (
    <AppLayout
      title="Pessoas"
      actionLabel="Nova Pessoa"
      onAction={() => setModalAberto(true)}
    >
      <Grid container spacing={3}>
        {pessoas.map((p) => (
          <Grid size={{ xs: 12, md: 4 }} key={p.id}>
            <GlassCard sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#7c3aed", fontWeight: 800 }}>
                {p.nome.substring(0, 1).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {p.nome}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", fontSize: "0.6rem" }}
                >
                  {p.id}
                </Typography>
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <ModalPessoa
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={carregarPessoas}
      />
    </AppLayout>
  );
}
