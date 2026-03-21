import { useEffect, useState } from "react";
import api from "../api/api";
import { AppLayout } from "../layouts/AppLayout";
import { GlassCard } from "../components/GlassCard";
import {
  Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
} from "lucide-react";

export function Dashboard() {
  const [detalhes, setDetalhes] = useState<any[]>([]);
  const [totais, setTotais] = useState({ receitas: 0, despesas: 0, saldo: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const response = await api.get("/pessoas/totais");
        const data = response.data;
        if (data) {
          setDetalhes(data.detalhesPorPessoa || []);
          setTotais({
            receitas: data.totalGeralReceitas || 0,
            despesas: data.totalGeralDespesas || 0,
            saldo: data.saldoLiquidoGeral || 0,
          });
        }
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f1a",
        }}
      >
        <Typography sx={{ color: "#6b7280", fontWeight: 800 }}>
          CARREGANDO DADOS...
        </Typography>
      </Box>
    );

  return (
    <AppLayout title="Dashboard Financeiro">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ borderLeft: "4px solid #7c3aed" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography
                variant="overline"
                sx={{ color: "#9ca3af", fontWeight: 700 }}
              >
                Saldo Geral
              </Typography>
              <Wallet size={20} color="#7c3aed" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {formatBRL(totais.saldo)}
            </Typography>
          </GlassCard>
        </Grid>

        {/* CARD RECEITAS */}
        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ borderLeft: "4px solid #10b981" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography
                variant="overline"
                sx={{ color: "#9ca3af", fontWeight: 700 }}
              >
                Receitas
              </Typography>
              <ArrowUpCircle size={20} color="#10b981" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#4ade80" }}>
              {formatBRL(totais.receitas)}
            </Typography>
          </GlassCard>
        </Grid>

        {/* CARD DESPESAS */}
        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ borderLeft: "4px solid #ef4444" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography
                variant="overline"
                sx={{ color: "#9ca3af", fontWeight: 700 }}
              >
                Despesas
              </Typography>
              <ArrowDownCircle size={20} color="#ef4444" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#f87171" }}>
              {formatBRL(totais.despesas)}
            </Typography>
          </GlassCard>
        </Grid>

        {/* TABELA - size={12} ocupa a largura toda */}
        <Grid size={{ xs: 12 }}>
          <GlassCard>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <TrendingUp size={20} color="#a78bfa" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Resumo por Membro
              </Typography>
            </Box>

            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        color: "#6b7280",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                      },
                    }}
                  >
                    <TableCell>Membro</TableCell>
                    <TableCell align="right">Receitas</TableCell>
                    <TableCell align="right">Despesas</TableCell>
                    <TableCell align="right">Saldo Líquido</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detalhes.map((row) => (
                    <TableRow
                      key={row.nome}
                      sx={{
                        "& td": {
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          color: "#fff",
                          py: 2.5,
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>{row.nome}</TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#4ade80", fontWeight: 700 }}
                      >
                        {formatBRL(row.totalReceitas)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#f87171", fontWeight: 700 }}
                      >
                        {formatBRL(row.totalDespesas)}
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            background:
                              row.saldo >= 0
                                ? "rgba(34, 197, 94, 0.1)"
                                : "rgba(239, 68, 68, 0.1)",
                            color: row.saldo >= 0 ? "#4ade80" : "#f87171",
                            fontWeight: 800,
                          }}
                        >
                          {formatBRL(row.saldo)}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
