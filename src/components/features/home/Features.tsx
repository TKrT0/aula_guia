const features = [
  {
    title: "Busca",
    desc: "Accede a una base de datos histórica extraída de documentos oficiales.",
    icon: "library_books",
    color: "bg-blue-100 text-blue-700"
  },
  {
    title: "Verifícate",
    desc: "Sube tu Kardex de forma segura para confirmar que eres estudiante activo.",
    icon: "verified",
    color: "bg-cyan-100 text-cyan-700"
  },
  {
    title: "Decide",
    desc: "Lee reseñas honestas de otros compañeros con total anonimato.",
    icon: "rate_review",
    color: "bg-amber-100 text-amber-700"
  }
];

export default function Features() {
  return (
    <section className="w-full py-16 px-4 sm:px-10 bg-white dark:bg-background-dark">
      <div className="max-w-[960px] mx-auto flex flex-col gap-12">
        <div className="text-center space-y-3">
          <h2 className="text-primary dark:text-white text-3xl font-bold">Cómo funciona</h2>
          <p className="text-slate-600 dark:text-slate-400">Tres pasos simples para tomar el control de tu trayectoria.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="group p-6 rounded-2xl border border-slate-100 bg-slate-50 transition-all hover:shadow-xl dark:bg-slate-800/50 dark:border-slate-700">
              <div className={`size-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{f.icon}</span>
              </div>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}