import React from "react";

interface ComposeProps {
    roomId?: string;
    onNavigate: (page: string, params?: any) => void;
    onBack?: () => void;
}

export default function Compose({ roomId, onNavigate, onBack }: ComposeProps) {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-sm text-[#4A3428]">Compose 페이지 (임시)</div>
        </div>
    );
}