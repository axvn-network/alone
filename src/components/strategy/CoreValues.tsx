"use client";

import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";
import { CORE_VALUES } from "@/constants/strategy";

export default function CoreValues() {
  return (
    <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
      {CORE_VALUES.map(({ id, title, description, icon: Icon }) => (
        <StaggerItem
          key={id}
          className="group bg-gvi-navy border border-gvi-gold/10 hover:border-gvi-gold/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-gvi-gold/5 transition-all duration-300 rounded-2xl p-6 md:p-7"
        >
          <div className="w-10 h-10 bg-gvi-gold/10 border border-gvi-gold/15 flex items-center justify-center rounded-sm mb-5 group-hover:bg-gvi-gold/20 transition-colors">
            <Icon className="w-5 h-5 text-gvi-gold" aria-hidden="true" />
          </div>
          <h3
            className="font-semibold text-gvi-ivory mb-2.5 leading-snug"
            style={{ fontSize: "var(--text-h3)" }}
          >
            {title}
          </h3>
          <p className="text-gvi-silver/70 leading-[1.75]" style={{ fontSize: "var(--text-body)" }}>
            {description}
          </p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
