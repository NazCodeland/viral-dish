'use client';
// components/CustomizeDish.tsx

interface Props {
  onClick?: () => void;
}

export default function CustomizeDish({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="block w-full h-12 bg-transparent border-none text-[13px] font-medium tracking-[0.1px] text-white/60 cursor-pointer text-center hover:text-white transition-colors duration-200"
    >
      Customize
    </button>
  );
}
