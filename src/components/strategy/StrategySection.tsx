"use client";

import type { ReactNode } from "react";
import { Section } from "@/components/ui/Primitives";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/animations/Reveal";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

interface StrategySectionProps {
  sectionKey: "section" | "coreValues" | "operatingModel" | "roadmap";
  children: ReactNode;
  dark?: boolean;
  altDark?: boolean;
  id?: string;
  className?: string;
  innerClassName?: string;
}

export default function StrategySection({
  sectionKey,
  children,
  dark,
  altDark,
  id,
  className,
  innerClassName,
}: StrategySectionProps) {
  const { lang } = useLang();
  const key = `strategy.${sectionKey}`;

  return (
    <Section id={id} dark={dark} altDark={altDark} className={className} innerClassName={innerClassName}>
      <Reveal className="text-center mb-10 md:mb-14">
        <SectionHeader
          tag={t(`${key}.tag`, lang)}
          heading={t(`${key}.title`, lang)}
          description={t(`${key}.description`, lang)}
          dark={dark || altDark}
        />
      </Reveal>
      {children}
    </Section>
  );
}
