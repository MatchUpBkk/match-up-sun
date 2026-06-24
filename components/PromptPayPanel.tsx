'use client';

import { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { buildPromptPayPayload } from '@/lib/promptpay';
import { useI18n } from '@/lib/i18n/context';
import { formatTHB } from '@/lib/utils';
import { IconUpload, IconCheck, IconQR } from './Icons';

export function PromptPayPanel({ amount }: { amount: number }) {
  const { t } = useI18n();
  const [proof, setProof] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const promptPayId = process.env.NEXT_PUBLIC_PROMPTPAY_ID || '0812345678';
  const promptPayName = process.env.NEXT_PUBLIC_PROMPTPAY_NAME || 'MATCH UP BKK';

  const payload = useMemo(() => buildPromptPayPayload(promptPayId, amount > 0 ? amount : undefined), [promptPayId, amount]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProof(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neon-lime/10 text-neon-lime ring-1 ring-neon-lime/30">
          <IconCheck className="h-7 w-7" />
        </span>
        <p className="mt-5 font-semibold text-white">{t('verify.status.pending')}</p>
        <p className="mt-1 max-w-xs text-sm text-white/55">{t('pay.proofNote')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="rounded-2xl bg-white p-4">
          <QRCodeSVG value={payload} size={196} level="M" />
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
          <IconQR className="h-4 w-4 text-neon-cyan" />
          {t('pay.scan')}
        </div>
        <p className="mt-1 text-xs text-white/40">{promptPayName} · {promptPayId}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm text-white/50">{t('pay.amount')}</span>
          <span className="text-xl font-bold text-neon-cyan">{formatTHB(amount)}</span>
        </div>
      </div>

      <div className="mt-6">
        <label className="label">{t('pay.uploadProof')}</label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-8 text-center transition hover:border-neon-cyan/40">
          {proof ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={proof} alt="proof" className="max-h-40 rounded-lg" />
          ) : (
            <>
              <IconUpload className="h-7 w-7 text-white/40" />
              <span className="text-sm text-white/50">{t('pay.uploadProof')}</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} />
        </label>
        <p className="mt-2 text-xs text-white/40">{t('pay.proofNote')}</p>
      </div>

      <button
        className="btn btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!proof}
        onClick={() => setSubmitted(true)}
      >
        {t('pay.pay')}
      </button>
    </div>
  );
}
