import React from "react";

interface LoadingProps {
    label?: string;
    size?: "sm" | "md" | "lg";
}

export default function Loading({ label = "Đang tải dữ liệu...", size = "md" }: LoadingProps) {
    const sizeClasses = {
        sm: "size-8",
        md: "size-12",
        lg: "size-16",
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-3.5 py-6 select-none">
            <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
                {/* Outer pulsing halo */}
                <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                {/* Static track ring */}
                <span className="absolute inset-0 rounded-full border-4 border-slate-200/80" />
                {/* Spinning gradient/emerald arc */}
                <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 border-r-teal-500 animate-spin" />
                {/* Center brand dot */}
                <span className="size-2.5 rounded-full bg-emerald-600 animate-pulse" />
            </div>

            {label && (
                <div className="flex flex-col items-center gap-1">
                    <p className="text-sm font-semibold text-slate-700 tracking-tight">
                        {label}
                    </p>
                    <div className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce" />
                    </div>
                </div>
            )}
        </div>
    );
}
