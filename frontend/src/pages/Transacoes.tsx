import { useEffect, useState } from "react";
import api from "../api/api";
import { AppLayout } from "../layouts/AppLayout";
import { GlassCard } from "../components/GlassCard";
import { Grid, Typography, Box, Chip } from "@mui/material";
import { ModalTransacao } from "../components/ModalTransacao";

export function Transacoes() {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const carregarTransacoes = () => {
    api.get("/transacoes").then((res) => setTransacoes(res.data));
  };

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <AppLayout
      title="Movimentações"
      actionLabel="Nova Transação"
      onAction={() => setModalOpen(true)}
    >
      <Grid container spacing={2}>
        {transacoes.map((t) => (
          <Grid size={{ xs: 12 }} key={t.id}>
            <GlassCard
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    fontSize: "0.65rem",
                  }}
                >
                  {t.pessoa?.nome} • {t.categoria?.descricao}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t.descricao}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    color: t.tipo === "receita" ? "#4ade80" : "#f87171",
                  }}
                >
                  {t.tipo === "receita" ? "+" : "-"} {formatBRL(t.valor)}
                </Typography>
                <Chip
                  label={t.tipo}
                  size="small"
                  sx={{
                    fontSize: "0.6rem",
                    height: 18,
                    bgcolor: "rgba(255,255,255,0.05)",
                    color: "#9ca3af",
                  }}
                />
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <ModalTransacao
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={carregarTransacoes}
      />
    </AppLayout>
  );
}
