import { useEffect, useState } from "react";
import api from "../api/api";
import { AppLayout } from "../layouts/AppLayout";
import { GlassCard } from "../components/GlassCard";
// ADICIONADO: Import do Box que estava faltando
import { Grid, Typography, Avatar, Box } from "@mui/material";

export function Pessoas() {
  const [pessoas, setPessoas] = useState<any[]>([]);

  useEffect(() => {
    api.get("/pessoas").then((res) => setPessoas(res.data));
  }, []);

  return (
    <AppLayout
      title="Pessoas"
      actionLabel="Nova Pessoa"
      onAction={() => alert("Abrir Modal")}
    >
      <Grid container spacing={3}>
        {pessoas.map((p) => (
          /* CORREÇÃO: Removido 'item' e adicionado 'size' */
          <Grid size={{ xs: 12, md: 4 }} key={p.id}>
            <GlassCard sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "#7c3aed",
                  width: 56,
                  height: 56,
                  fontWeight: 800,
                }}
              >
                {p.nome.substring(0, 1).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {p.nome}
                </Typography>
                <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                  ID: {p.id}
                </Typography>
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
    </AppLayout>
  );
}
