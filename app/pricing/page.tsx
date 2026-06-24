'use client';

import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { Badge } from '@/components/RoleBadge';
import { useI18n } from '@/lib/i18n/context';
import { IconCheck, IconSpark, IconTrophy, IconBall } from '@/components/Icons';

export default function PricingPage() {
  const { t } = useI18n();

  const tiers = [
    {
      key: 'free',
      icon: IconBall,
      accent: 'text-white/70',
      ring: 'ring-white/10',
      price: t('pricing.free.price'),
      unit: '',
      features: [t('pricing.free.f1'), t('pricing.free.f2'), t('pricing.free.f3')],
      popular: false,
      cta: 'btn-secondary',
    },
    {
      key: 'featured',
      icon: IconSpark,
      accent: 'text-neon-cyan',
      ring: 'ring-neon-cyan/40',
      price: t('pricing.featured.price'),
      unit: t('pricing.featured.unit'),
      features: [t('pricing.featured.f1'), t('pricing.featured.f2'), t('pricing.featured.f3')],
      popular: true,
      cta: 'btn-primary',
    },
    {
      key: 'promo',
      icon: IconTrophy,
      accent: 'text-neon-purple',
      ring: 'ring-neon-purple/40',
      price: t('pricing.promo.price'),
      unit: t('pricing.promo.unit'),
      features: [t('pricing.promo.f1'), t('pricing.promo.f2'), t('pricing.promo.f3')],
      popular: false,
      cta: 'btn-secondary',
    },
  ];

  return (
    <div className="container-x pt-28 pb-24 sm:pt-32">
      <Reveal>
        <SectionHeading eyebrow={t('pricing.eyebrow')} title={t('pricing.title')} subtitle={t('pricing.subtitle')} />
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal key={tier.key} delay={i * 100}>
            <div
              className={`glass relative flex h-full flex-col p-8 ring-1 ${tier.ring} ${
                tier.popular ? 'lg:-translate-y-4 shadow-neon-cyan' : ''
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge label={t('pricing.popular')} variant="featured" />
                </span>
              )}
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${tier.accent} ring-1 ${tier.ring}`}>
                <tier.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">{t(`pricing.${tier.key}.name`)}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-4xl font-extrabold ${tier.accent}`}>{tier.price}</span>
                {tier.unit && <span className="text-sm text-white/50">{tier.unit}</span>}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon-lime/10 text-neon-lime">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`btn ${tier.cta} mt-8 w-full justify-center`}>
                {t('pricing.choose')}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-12 text-center text-sm text-white/40">{t('misc.demo')}</p>
      </Reveal>
    </div>
  );
}
