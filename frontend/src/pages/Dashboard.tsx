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
import { LayoutDashboard } from "lucide-react";

export function Dashboard() {
  const [detalhes, setDetalhes] = useState<any[]>([]);
  const [detalhesCat, setDetalhesCat] = useState<any[]>([]);
  const [totais, setTotais] = useState({ receitas: 0, despesas: 0, saldo: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const response = await api.get("/transacoes/dashboard");
        const data = response.data;
        setDetalhes(data.detalhesPorPessoa || []);
        setDetalhesCat(data.detalhesPorCategoria || []);
        setTotais({
          receitas: data.totalGeralReceitas || 0,
          despesas: data.totalGeralDespesas || 0,
          saldo: data.saldoLiquidoGeral || 0,
        });
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
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#7c3aed" }} />
      </Box>
    );

  return (
    <Box sx={{ p: 4, width: "100%" }}>
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
          <GlassCard sx={{ p: 3, borderLeft: "4px solid #7c3aed" }}>
            <Typography
              variant="overline"
              sx={{
                color: "#a78bfa",
                fontWeight: 900,
                display: "block",
                mb: 1,
              }}
            >
              SALDO EM CONTA
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "2.5rem",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {formatBRL(totais.saldo)}
            </Typography>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 3, borderLeft: "4px solid #10b981" }}>
            <Typography
              variant="overline"
              sx={{
                color: "#10b981",
                fontWeight: 900,
                display: "block",
                mb: 1,
              }}
            >
              ENTRADAS
            </Typography>
            <Typography
              sx={{
                color: "#4ade80",
                fontSize: "2.5rem",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {formatBRL(totais.receitas)}
            </Typography>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 3, borderLeft: "4px solid #ef4444" }}>
            <Typography
              variant="overline"
              sx={{
                color: "#ef4444",
                fontWeight: 900,
                display: "block",
                mb: 1,
              }}
            >
              SAÍDAS
            </Typography>
            <Typography
              sx={{
                color: "#f87171",
                fontSize: "2.5rem",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {formatBRL(totais.despesas)}
            </Typography>
          </GlassCard>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ color: "#fff", mb: 2, fontWeight: 800 }}>
        Fluxo por Pessoa
      </Typography>
      <GlassCard sx={{ p: 0, mb: 5 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    color: "#9ca3af",
                    fontWeight: 700,
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                  },
                }}
              >
                <TableCell>MEMBRO</TableCell>
                <TableCell align="right">ENTRADAS</TableCell>
                <TableCell align="right">SAÍDAS</TableCell>
                <TableCell align="right">SALDO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detalhes.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{
                    "& td": {
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  <TableCell sx={{ color: "#fff" }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "#7c3aed",
                          width: 28,
                          height: 28,
                          fontSize: "0.7rem",
                        }}
                      >
                        {row.nome?.charAt(0)}
                      </Avatar>
                      {row.nome}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#4ade80" }}>
                    {formatBRL(row.receitas)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#f87171" }}>
                    {formatBRL(row.despesas)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: row.saldo >= 0 ? "#4ade80" : "#f87171",
                      fontWeight: 700,
                    }}
                  >
                    {formatBRL(row.saldo)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: "rgba(124, 58, 237, 0.1)" }}>
                <TableCell sx={{ color: "#fff", fontWeight: 900 }}>
                  TOTAL GERAL
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#4ade80", fontWeight: 900 }}
                >
                  {formatBRL(totais.receitas)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#f87171", fontWeight: 900 }}
                >
                  {formatBRL(totais.despesas)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#fff", fontWeight: 900 }}
                >
                  {formatBRL(totais.saldo)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>

      <Typography variant="h6" sx={{ color: "#fff", mb: 2, fontWeight: 800 }}>
        Fluxo por Categoria
      </Typography>
      <GlassCard sx={{ p: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    color: "#9ca3af",
                    fontWeight: 700,
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                  },
                }}
              >
                <TableCell>CATEGORIA</TableCell>
                <TableCell align="right">RECEITAS</TableCell>
                <TableCell align="right">DESPESAS</TableCell>
                <TableCell align="right">SALDO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detalhesCat.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{
                    "& td": {
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  <TableCell sx={{ color: "#fff" }}>{row.descricao}</TableCell>
                  <TableCell align="right" sx={{ color: "#4ade80" }}>
                    {formatBRL(row.receitas)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#f87171" }}>
                    {formatBRL(row.despesas)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: row.saldo >= 0 ? "#4ade80" : "#f87171",
                      fontWeight: 700,
                    }}
                  >
                    {formatBRL(row.saldo)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}>
                <TableCell sx={{ color: "#fff", fontWeight: 900 }}>
                  TOTAL CATEGORIAS
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#4ade80", fontWeight: 900 }}
                >
                  {formatBRL(totais.receitas)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#f87171", fontWeight: 900 }}
                >
                  {formatBRL(totais.despesas)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#fff", fontWeight: 900 }}
                >
                  {formatBRL(totais.saldo)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );
}
