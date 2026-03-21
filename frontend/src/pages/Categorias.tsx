import { useEffect, useState } from "react";
import api from "../api/api";
import { AppLayout } from "../layouts/AppLayout";
import { GlassCard } from "../components/GlassCard";
import { Grid, Typography, Chip } from "@mui/material";

export function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    api.get("/categorias").then((res) => setCategorias(res.data));
  }, []);

  return (
    <AppLayout title="Categorias" actionLabel="Nova Categoria">
      <Grid container spacing={2}>
        {categorias.map((c) => (
          <Grid size={{ xs: 12, md: 3 }} key={c.id}>
            <GlassCard>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {c.nome}
              </Typography>
              <Chip
                label={c.tipo === 0 ? "Receita" : "Despesa"}
                size="small"
                sx={{
                  bgcolor:
                    c.tipo === 0
                      ? "rgba(34, 197, 94, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                  color: c.tipo === 0 ? "#4ade80" : "#f87171",
                  fontWeight: 700,
                }}
              />
            </GlassCard>
          </Grid>
        ))}
      </Grid>
    </AppLayout>
  );
}
