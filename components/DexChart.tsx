import React from "react";

interface DexChartProps {
  height?: string | number;
  width?: string | number;
  tokenAddress?: string;
  interval?: string;
  theme?: "dark" | "light";
  chartType?: "CANDLE" | "LINE";
  timezone?: string;
}

const DexChart: React.FC<DexChartProps> = ({
  height = 600,
  width = "100%",
  tokenAddress = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  interval = "1D",
  theme = "dark",
  chartType = "CANDLE",
  timezone = "Asia/Singapore",
}) => {
  // URL encode the timezone and other parameters
  const encodedTimezone = encodeURIComponent(timezone);

  // Construct the source URL with all parameters
  const srcUrl = `https://birdeye.so/tv-widget/${tokenAddress}?chain=solana&viewMode=pair&chartInterval=${interval}&chartType=${chartType}&chartTimezone=${encodedTimezone}&chartTimezone=Asia%2FSingapore&chartLeftToolbar=show&theme=${theme}&cssCustomProperties=--tv-color-pane-background%3A%232a2a2a`;

  return (
    <iframe
      width={width}
      height={height}
      src={srcUrl}
      frameBorder="0"
      allowFullScreen
    />
  );
};

export default DexChart;
