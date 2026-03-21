import React from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  LayoutDashboard,
  Users,
  Tags,
  ArrowRightLeft,
  Plus,
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom"; // 1. Adicionado Outlet

interface AppLayoutProps {
  title: string;
  children?: React.ReactNode; // 2. O "?" torna o children opcional para o App.tsx não reclamar
  actionLabel?: string;
  onAction?: () => void;
}

const menuItems = [
  { text: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
  { text: "Pessoas", icon: <Users size={20} />, path: "/pessoas" },
  { text: "Categorias", icon: <Tags size={20} />, path: "/categorias" },
  {
    text: "Transações",
    icon: <ArrowRightLeft size={20} />,
    path: "/transacoes",
  },
];

export const AppLayout = ({
  title,
  actionLabel,
  onAction,
  children,
}: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#0b0f1a" }}>
      <Box
        sx={{
          width: 280,
          background: "linear-gradient(180deg, #111827, #0b0f1a)",
          p: 3,
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#fff", fontWeight: 900, mb: 5, letterSpacing: -1 }}
        >
          GASTO RESIDENCIAL
        </Typography>

        {menuItems.map((item) => (
          <Box
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              mb: 1,
              borderRadius: 3,
              cursor: "pointer",
              color: location.pathname === item.path ? "#a78bfa" : "#9ca3af",
              background:
                location.pathname === item.path
                  ? "rgba(139, 92, 246, 0.1)"
                  : "transparent",
              transition: "0.3s",
              "&:hover": {
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
              },
            }}
          >
            {item.icon}
            <Typography sx={{ fontWeight: 600 }}>{item.text}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ flex: 1, p: 5, overflowY: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", fontWeight: 600 }}
            >
              BEM-VINDO AO SISTEMA
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: "#fff", fontWeight: 800, letterSpacing: -2 }}
            >
              {title}
            </Typography>
          </Box>
          {actionLabel && (
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={onAction}
              sx={{
                background: "linear-gradient(90deg, #7c3aed, #9333ea)",
                borderRadius: 4,
                px: 3,
                py: 1.2,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.3)",
              }}
            >
              {actionLabel}
            </Button>
          )}
        </Box>

        {children || <Outlet />}
      </Box>
    </Box>
  );
};
