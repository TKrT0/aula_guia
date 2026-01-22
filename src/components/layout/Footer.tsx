export default function Footer() {
  return (
    <footer className="w-full py-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-[960px] mx-auto px-4 flex flex-col items-center text-center gap-8">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-500 dark:text-slate-400 font-medium text-sm">
          <a href="#" className="hover:text-primary transition-colors">Nuestra Filosofía</a>
          <a href="#" className="hover:text-primary transition-colors">Privacidad de Datos</a>
          <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
            Código Abierto <span className="material-symbols-outlined text-lg">code</span>
          </a>
        </div>
        <p className="text-slate-400 text-xs">© 2026 Aula Guía. Hecho por estudiantes para estudiantes BUAP.</p>
      </div>
    </footer>
  );
}