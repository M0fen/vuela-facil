import { Icon } from "./icons";
import { Logo } from "./ui";
import { NEGOCIO } from "@/lib/data";
import { waLink } from "@/lib/utils";

const COLS = [
  {
    t: "Compañía",
    l: ["Nosotros", "Nuestro equipo", "Blog de viajes", "Trabaja con nosotros", "Política de tratamiento"],
  },
  { t: "Destinos", l: ["San Andrés", "Cartagena", "Eje Cafetero", "Cancún", "Europa", "Cruceros"] },
  {
    t: "Ayuda",
    l: ["Preguntas frecuentes", "Términos y condiciones", "PQRS", "Asistencia 24/7", "Reembolsos"],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white pt-20 pb-10 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 0%, rgba(244,169,60,0.3), transparent 40%), radial-gradient(circle at 90% 100%, rgba(232,99,26,0.25), transparent 45%)",
        }}
      />
      <div className="relative max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          <div className="md:col-span-4">
            <Logo light size={48} />
            <p className="text-white/65 text-[14px] mt-5 max-w-xs leading-relaxed">
              Agencia de viajes en Pereira, Risaralda. Diseñamos experiencias por Colombia y el mundo
              con asesoría humana y reserva por WhatsApp.
            </p>
            <div className="mt-6 space-y-2 text-[13px] text-white/75">
              <div className="flex items-center gap-2">
                <Icon.Pin className="w-4 h-4 text-coral" /> Cra. 14 #20-35, Pereira · Risaralda
              </div>
              <a
                href={waLink("Hola Vuela Fácil 👋")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Icon.Whatsapp className="w-4 h-4 text-[#25D366]" /> {NEGOCIO.telefonoDisplay}
              </a>
              <div className="flex items-center gap-2">
                <Icon.Clock className="w-4 h-4 text-amber" /> Lun – Sáb · 8 a.m. – 8 p.m.
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <a
                href={waLink("Hola, vengo del footer 👋")}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-white/8 hover:bg-[#25D366] flex items-center justify-center transition-colors"
              >
                <Icon.Whatsapp className="w-4 h-4" />
              </a>
              <a
                href={NEGOCIO.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/8 hover:bg-coral flex items-center justify-center transition-colors"
              >
                <Icon.Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/8 hover:bg-coral flex items-center justify-center transition-colors"
              >
                <Icon.Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.t} className="md:col-span-2">
              <div className="text-[11px] tracking-[0.25em] uppercase text-amber font-semibold mb-4">
                {c.t}
              </div>
              <ul className="space-y-2.5">
                {c.l.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-white/70 hover:text-white text-[13px] transition-colors">
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="md:col-span-2">
            <div className="text-[11px] tracking-[0.25em] uppercase text-amber font-semibold mb-4">
              Pago seguro
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {["VISA", "MC", "AmEx", "PSE", "NEQUI", "ADDI"].map((p) => (
                <div
                  key={p}
                  className="aspect-[3/2] rounded-md bg-white/8 border border-white/10 flex items-center justify-center text-[10px] font-bold tracking-wider text-white/70"
                >
                  {p}
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] tracking-[0.2em] uppercase text-white/60">Registro</div>
              <div className="font-mono text-[14px] text-white mt-0.5">{NEGOCIO.rnt}</div>
              <div className="text-[10px] text-white/50 mt-1">
                Registro Nacional de Turismo · MinCIT
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[12px] text-white/55">
          <div>
            © {new Date().getFullYear()} Vuela Fácil Travel S.A.S. · Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
