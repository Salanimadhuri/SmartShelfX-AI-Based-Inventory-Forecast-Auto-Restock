/**
 * AIInsightCard — Reusable glassmorphism AI insight card
 * Props:
 *   icon        : emoji or string icon
 *   title       : card title
 *   value       : main metric value
 *   subtitle    : short description
 *   badge       : badge text (e.g. "High Priority")
 *   badgeColor  : badge background color
 *   trend       : "up" | "down" | "stable"
 *   trendValue  : string like "+18%"
 *   confidence  : number 0-100
 *   priority    : "critical" | "high" | "medium" | "low"
 *   insight     : longer insight text
 *   animDelay   : CSS animation delay string e.g. "0.1s"
 */
import React from "react";

const priorityColors = {
  critical: { bg: "rgba(255,82,82,0.13)", border: "rgba(255,82,82,0.45)", glow: "rgba(255,82,82,0.2)" },
  high:     { bg: "rgba(255,167,38,0.13)", border: "rgba(255,167,38,0.45)", glow: "rgba(255,167,38,0.2)" },
  medium:   { bg: "rgba(66,165,245,0.13)", border: "rgba(66,165,245,0.45)", glow: "rgba(66,165,245,0.2)" },
  low:      { bg: "rgba(102,187,106,0.13)", border: "rgba(102,187,106,0.45)", glow: "rgba(102,187,106,0.2)" },
};

const trendStyle = {
  up:     { color: "#4caf50", icon: "▲" },
  down:   { color: "#f44336", icon: "▼" },
  stable: { color: "#ff9800", icon: "►" },
};

const AIInsightCard = ({
  icon = "🤖",
  title = "AI Insight",
  value,
  subtitle,
  badge,
  badgeColor = "#1976d2",
  trend,
  trendValue,
  confidence,
  priority = "medium",
  insight,
  animDelay = "0s",
  style = {},
}) => {
  const colors = priorityColors[priority] || priorityColors.medium;
  const tr = trend ? trendStyle[trend] || trendStyle.stable : null;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${colors.bg}, rgba(255,255,255,0.07))`,
        border: `1.5px solid ${colors.border}`,
        borderRadius: "18px",
        padding: "22px 20px 18px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: `0 8px 32px ${colors.glow}, 0 2px 8px rgba(0,0,0,0.08)`,
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "default",
        animation: `aiCardIn 0.6s ease-out ${animDelay} both`,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 16px 40px ${colors.glow}, 0 4px 16px rgba(0,0,0,0.12)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 8px 32px ${colors.glow}, 0 2px 8px rgba(0,0,0,0.08)`;
      }}
    >
      {/* Decorative gradient blob */}
      <div style={{
        position: "absolute", top: "-30px", right: "-30px",
        width: "100px", height: "100px",
        background: colors.border, borderRadius: "50%",
        opacity: 0.18, filter: "blur(20px)", pointerEvents: "none",
      }} />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.7rem", lineHeight: 1 }}>{icon}</span>
          <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#344", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            {title}
          </span>
        </div>
        {badge && (
          <span style={{
            background: badgeColor, color: "#fff", fontSize: "0.7rem",
            fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
            letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap",
          }}>{badge}</span>
        )}
      </div>

      {/* Main value */}
      {value !== undefined && (
        <div style={{ fontSize: "2rem", fontWeight: 800, color: "#141e30", lineHeight: 1.1, marginBottom: "4px" }}>
          {value}
          {tr && (
            <span style={{ fontSize: "1rem", color: tr.color, marginLeft: "8px", fontWeight: 700 }}>
              {tr.icon} {trendValue}
            </span>
          )}
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <div style={{ fontSize: "0.82rem", color: "#546e7a", fontWeight: 500, marginBottom: "10px" }}>
          {subtitle}
        </div>
      )}

      {/* Insight text */}
      {insight && (
        <div style={{
          fontSize: "0.87rem", color: "#37474f", lineHeight: 1.55,
          background: "rgba(255,255,255,0.5)", borderRadius: "10px",
          padding: "9px 12px", marginTop: "8px",
          borderLeft: `3px solid ${colors.border}`,
        }}>
          {insight}
        </div>
      )}

      {/* Confidence bar */}
      {confidence !== undefined && (
        <div style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#78909c", marginBottom: "4px" }}>
            <span>AI Confidence</span>
            <span style={{ fontWeight: 700, color: "#1976d2" }}>{confidence}%</span>
          </div>
          <div style={{ background: "rgba(0,0,0,0.08)", borderRadius: "6px", height: "6px", overflow: "hidden" }}>
            <div style={{
              width: `${confidence}%`, height: "100%",
              background: confidence > 75 ? "linear-gradient(90deg,#43a047,#66bb6a)"
                : confidence > 50 ? "linear-gradient(90deg,#fb8c00,#ffa726)"
                : "linear-gradient(90deg,#e53935,#ef5350)",
              borderRadius: "6px", transition: "width 1s ease",
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightCard;
