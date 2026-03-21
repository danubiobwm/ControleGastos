import React from "react";
import { Paper, type SxProps, type Theme } from "@mui/material";

interface GlassCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const GlassCard = ({ children, sx = {} }: GlassCardProps) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 5,
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "#fff",
      transition: "0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
        background: "rgba(255,255,255,0.06)",
      },
      ...sx,
    }}
  >
    {children}
  </Paper>
);
