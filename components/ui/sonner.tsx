"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#2a2a2a] group-[.toaster]:text-gray-200 group-[.toaster]:border-[#3a3a3a] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-green-600 group-[.toast]:hover:bg-green-700 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[#333333] group-[.toast]:hover:bg-[#444444] group-[.toast]:text-gray-200",
          success:
            "group-[.toast]:bg-green-600/20 group-[.toast]:border-green-600/30 group-[.toast]:text-green-400",
          error:
            "group-[.toast]:bg-red-500/20 group-[.toast]:border-red-500/30 group-[.toast]:text-red-500",
          info: "group-[.toast]:bg-blue-500/20 group-[.toast]:border-blue-500/30 group-[.toast]:text-blue-500",
          warning:
            "group-[.toast]:bg-yellow-400/20 group-[.toast]:border-yellow-400/30 group-[.toast]:text-yellow-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
