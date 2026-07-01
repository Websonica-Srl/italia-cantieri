import {
  Award, BarChart2, BarChart3, BedDouble, Briefcase, Building, Building2, Castle,
  CircleDot, Construction, Dot, Factory, FileCheck2, FileText, Gavel, GitBranch,
  Hammer, HardHat, HelpCircle, Home, Landmark, Layers, MapPin, MapPinned,
  Maximize2, Merge, PanelTop, Repeat, Split, Store, Tractor, TreePine, Trees,
  Warehouse, Wheat, Wrench, type LucideIcon,
} from 'lucide-react';

/** Mappa i nomi-icona stringa dei *_META di @websonica/cantieri-core sui componenti lucide reali.
 *  Nota: 'House' non esiste in questa versione di lucide-react (0.309) -> cade sul fallback CircleDot. */
const ICONS: Record<string, LucideIcon> = {
  Award, BarChart2, BarChart3, BedDouble, Briefcase, Building, Building2, Castle,
  CircleDot, Construction, Dot, Factory, FileCheck2, FileText, Gavel, GitBranch,
  Hammer, HardHat, HelpCircle, Home, Landmark, Layers, MapPin, MapPinned,
  Maximize2, Merge, PanelTop, Repeat, Split, Store, Tractor, TreePine, Trees,
  Warehouse, Wheat, Wrench,
};

/** Risolve un nome-icona (dai *_META di cantieri-core) sul componente lucide-react; fallback CircleDot. */
export function resolveLucideIcon(name: string): LucideIcon {
  return ICONS[name] ?? CircleDot;
}
