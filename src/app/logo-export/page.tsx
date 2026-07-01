import Image from "next/image";

export default function LogoExport() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[1920px] h-[1020px] flex flex-col items-center justify-center">
        <Image src="/logo.svg" alt="Sinapsis" width={220} height={220} />
        <h1 className="text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-[family-name:var(--font-quicksand)] mt-6">
          Sinapsis
        </h1>
        <p className="text-2xl text-primary-light tracking-[0.3em] mt-4">
          PSICOLOGÍA CLÍNICA
        </p>
      </div>
    </div>
  );
}
