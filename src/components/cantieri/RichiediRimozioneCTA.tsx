import { siteConfig } from '@/lib/site-config';
import { ShieldAlert, Mail } from 'lucide-react';

interface Props {
  cantiereId?: string;
  protocollo?: string;
  comune?: string;
}

export default function RichiediRimozioneCTA({ cantiereId, protocollo, comune }: Props) {
  const subject = encodeURIComponent(`Richiesta opt-out / rimozione GDPR - Cantiere ${protocollo || cantiereId}`);
  const body = encodeURIComponent(
    `Salve,

richiedo la rimozione dei miei dati personali dalla scheda cantiere:
- ID: ${cantiereId || ''}
- Protocollo: ${protocollo || ''}
- Comune: ${comune || ''}
- URL: ${typeof window !== 'undefined' ? window.location.href : ''}

Indicare di seguito il diritto esercitato (Art. 15-22 GDPR) e allegare documento d'identità:

Grazie.`,
  );

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-1">Sono titolare di questo cantiere</h3>
          <p className="text-sm text-amber-900/80 leading-relaxed mb-3">
            Questi dati provengono da fonti pubbliche (albo pretorio / open data PA). Se sei il titolare e vuoi richiedere
            la rimozione o la rettifica di informazioni personali, contattaci nel rispetto degli Art. 15-22 GDPR.
          </p>
          <a
            href={`mailto:${siteConfig.dpoEmail}?subject=${subject}&body=${body}`}
            className="inline-flex items-center gap-2 rounded-full bg-amber-900 text-amber-50 px-4 py-2 text-sm font-medium hover:bg-amber-900/90 transition-colors"
          >
            <Mail className="h-4 w-4" /> Contatta il DPO per opt-out
          </a>
        </div>
      </div>
    </div>
  );
}
