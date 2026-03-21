import { useEffect, useState } from "react";
import api from "../api/api";
import { AppLayout } from "../layouts/AppLayout";
import { GlassCard } from "../components/GlassCard";
import { Grid, Typography, Chip, Box } from "@mui/material";
import { ModalCategoria } from "../components/ModalCategoria";

export function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const carregarCategorias = () => {
    // Usando o endpoint #9 que você enviou
    api.get("/categorias").then((res) => {
      setCategorias(res.data);
    });
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  return (
    <AppLayout
      title="Categorias"
      actionLabel="Nova Categoria"
      onAction={() => setModalOpen(true)}
    >
      <Grid container spacing={2}>
        {categorias.map((c) => (
          <Grid size={{ xs: 12, md: 3 }} key={c.id}>
            <GlassCard>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {/* 1. Descrição em cima (minúsculo conforme seu JSON) */}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#fff" }}
                >
                  {c.descricao}
                </Typography>

                {/* 2. Finalidade embaixo com cor dinâmica */}
                <Chip
                  label={c.finalidade?.toUpperCase()}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    bgcolor:
                      c.finalidade === "receita"
                        ? "rgba(34, 197, 94, 0.1)"
                        : c.finalidade === "despesa"
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(167, 139, 250, 0.1)", // Cor para "ambas"
                    color:
                      c.finalidade === "receita"
                        ? "#4ade80"
                        : c.finalidade === "despesa"
                          ? "#f87171"
                          : "#a78bfa", // Cor para "ambas"
                    fontWeight: 800,
                    fontSize: "0.65rem",
                    borderRadius: "4px",
                  }}
                />
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <ModalCategoria
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={carregarCategorias}
      />
    </AppLayout>
  );
}
