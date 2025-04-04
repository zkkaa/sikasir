import React from 'react';

interface ConfirmCheckPopupProps {
    icon?: React.ReactNode;
    title: string;
    deskrip: string;
    onCancel: () => void;
    onConfirm: () => void;
    cancelText?: string;
    confirText?: string;
    color1?: string;
}

export default function ConfirmCheckPopup({
    icon,
    title,
    deskrip,
    onCancel,
    onConfirm,
    cancelText,
    confirText,
    color1,
}: ConfirmCheckPopupProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-72 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-8 relative overflow-hidden rounded-xl">
                <div className={`w-24 h-24 bg-${color1}-500 rounded-full absolute -right-5 -top-7 flex items-center justify-center pt-3 pr-3`}>
                    {icon}
                </div>
                <h1 className={`font-bold text-2xl text-${color1}-500 mt-3`}>{title}</h1>
                <p className="text-zinc-600 leading-6 mt-3">{deskrip}</p>
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        className="px-3 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="px-3 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm"
                        onClick={onConfirm}
                    >
                        {confirText}
                    </button>
                </div>
            </div>
        </div>
    );
}
