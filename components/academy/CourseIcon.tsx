import {
  AudioLines,
  Baby,
  BookMarked,
  BookOpen,
  BookText,
  Compass,
  Globe,
  GraduationCap,
  Heart,
  Landmark,
  Languages,
  Scale,
  ScrollText,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CourseIconName } from "@/data/courses";

const ICONS: Record<CourseIconName, LucideIcon> = {
  "book-open": BookOpen,
  "book-marked": BookMarked,
  languages: Languages,
  scroll: ScrollText,
  audio: AudioLines,
  graduation: GraduationCap,
  users: Users,
  heart: Heart,
  compass: Compass,
  sparkles: Sparkles,
  scale: Scale,
  landmark: Landmark,
  "book-text": BookText,
  baby: Baby,
  globe: Globe,
  star: Star,
};

export function CourseIcon({ name, className = "w-5 h-5" }: { name: CourseIconName; className?: string }) {
  const Icon = ICONS[name] ?? BookOpen;
  return <Icon className={className} />;
}
