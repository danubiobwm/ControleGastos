import { useEffect, useState } from "react";
import api from "../api/api";
import { GlassCard } from "../components/GlassCard";
import {
  Grid as Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  LayoutDashboard,
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
        console.error(err);
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
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress sx={{ color: "#7c3aed" }} />
      </Box>
    );

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      {/* HEADER */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <LayoutDashboard size={32} color="#a78bfa" />
        <Box>
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 900 }}>
            Visão Geral
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Acompanhamento em tempo real
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard
            sx={{
              borderLeft: "6px solid #7c3aed",
              minHeight: "160px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography
                variant="overline"
                sx={{ color: "#a78bfa", fontWeight: 800 }}
              >
                Saldo em Conta
              </Typography>
              <Wallet size={24} color="#a78bfa" />
            </Box>
            <Typography variant="h3" sx={{ color: "#fff", fontWeight: 900 }}>
              {formatBRL(totais.saldo)}
            </Typography>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard
            sx={{
              borderLeft: "6px solid #10b981",
              minHeight: "160px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography
                variant="overline"
                sx={{ color: "#10b981", fontWeight: 800 }}
              >
                Entradas
              </Typography>
              <ArrowUpRight size={24} color="#10b981" />
            </Box>
            <Typography variant="h3" sx={{ color: "#4ade80", fontWeight: 900 }}>
              {formatBRL(totais.receitas)}
            </Typography>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard
            sx={{
              borderLeft: "6px solid #ef4444",
              minHeight: "160px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography
                variant="overline"
                sx={{ color: "#ef4444", fontWeight: 800 }}
              >
                Saídas
              </Typography>
              <ArrowDownRight size={24} color="#ef4444" />
            </Box>
            <Typography variant="h3" sx={{ color: "#f87171", fontWeight: 900 }}>
              {formatBRL(totais.despesas)}
            </Typography>
          </GlassCard>
        </Grid>
      </Grid>

      {/* FLUXO POR PESSOA */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Users size={24} color="#fff" />
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800 }}>
          Fluxo por Pessoa
        </Typography>
      </Box>

      <GlassCard sx={{ p: 0, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
              <TableRow sx={{ "& th": { color: "#9ca3af", fontWeight: 700 } }}>
                <TableCell>MEMBRO</TableCell>
                <TableCell align="right">ENTRADAS</TableCell>
                <TableCell align="right">SAÍDAS</TableCell>
                <TableCell align="right">RESULTADO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detalhes.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{
                    "& td": {
                      py: 2,
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "#7c3aed",
                          width: 32,
                          height: 32,
                          fontSize: "0.8rem",
                        }}
                      >
                        {row.nome?.charAt(0)}
                      </Avatar>
                      <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                        {row.nome}
                      </Typography>
                    </Box>
                  </TableCell>
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
                        bgcolor:
                          row.saldo >= 0
                            ? "rgba(74,222,128,0.1)"
                            : "rgba(248,113,113,0.1)",
                        color: row.saldo >= 0 ? "#4ade80" : "#f87171",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 900,
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
    </Box>
  );
}
