"use client";

import { Building2, Check } from "lucide-react";
import { SUBSIDIARIES } from "@/constants/strategy";

export default function OperatingModel() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="max-w-2xl mx-auto bg-gvi-navy border border-gvi-gold/30 rounded-xl p-6 text-center mb-5">
        <Building2 className="w-6 h-6 text-gvi-gold mx-auto mb-3" aria-hidden="true" />
        <p className="font-semibold text-gvi-ivory">GVI Tech Holding</p>
        <p className="text-gvi-silver/65 text-sm mt-2">Điều phối định hướng chiến lược, quản trị, tuân thủ, nghiên cứu và phát triển năng lực hệ sinh thái theo từng điều kiện phù hợp.</p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2" aria-label="Cấu trúc hệ sinh thái">
        {SUBSIDIARIES.map(({ id, name, description, services, icon: Icon }) => (
          <li key={id} className="bg-gvi-deep border border-gvi-gold/15 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Icon className="w-5 h-5 text-gvi-gold shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-gvi-ivory">{name}</p>
                <p className="text-gvi-silver/70 text-sm leading-relaxed mt-3">{description}</p>
              </div>
            </div>
            <ul className="mt-5 pt-4 border-t border-gvi-gold/10 space-y-2">
              {services.map((service) => (
                <li key={service} className="flex gap-2 text-gvi-silver/70 text-xs">
                  <Check className="w-3.5 h-3.5 text-gvi-gold/75 shrink-0" aria-hidden="true" />
                  {service}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
