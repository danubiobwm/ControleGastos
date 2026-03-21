import { useEffect, useState } from "react";
import api from "../api/api";
import { AppLayout } from "../layouts/AppLayout";
import { GlassCard } from "../components/GlassCard";
import { Box, Typography } from "@mui/material";

export function Transacoes() {
  const [transacoes, setTransacoes] = useState<any[]>([]);

  useEffect(() => {
    api.get("/transacoes").then((res) => setTransacoes(res.data));
  }, []);

  return (
    <AppLayout title="Transações" actionLabel="Novo Lançamento">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {transacoes.map((t) => (
          <GlassCard
            key={t.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {t.descricao}
              </Typography>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                {new Date(t.data).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: t.tipo === 0 ? "#4ade80" : "#f87171",
              }}
            >
              {t.tipo === 0 ? "+" : "-"} R$ {t.valor.toFixed(2)}
            </Typography>
          </GlassCard>
        ))}
      </Box>
    </AppLayout>
  );
}
