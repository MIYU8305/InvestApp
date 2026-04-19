"use client";

import React, { useState, useEffect } from "react";

export default function InvestmentDashboard() {
  const [data, setData] = useState({
    currentSP500: 4850.25,
    athSP500: 4850.25,
    lastUpdate: new Date(),
  });

  const dropRate = ((data.currentSP500 - data.athSP500) / data.athSP500) * 100;
  const nextThreshold = dropRate > -30 ? -30 : -40;
  const remainingDrop = nextThreshold - dropRate;
  const remainingPoints = (data.athSP500 * remainingDrop) / 100;
  const progressPercent = Math.min(100, Math.max(0, (Math.abs(dropRate) / Math.abs(nextThreshold)) * 100));

  const getStatus = () => {
    if (dropRate > -30) {
      return {
        icon: "正常",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        message: "正常範囲です",
        detail: "何もしなくても問題ありません。",
      };
    } else if (dropRate >= -40 && dropRate <= -30) {
      return {
        icon: "注意",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        message: "第1次買付けゾーンです",
        detail: "現在の価格は目標に近いです。",
      };
    } else {
      return {
        icon: "購入完了",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        message: "第2次買付けゾーンです",
        detail: "追加購入計画を確認してください。",
      };
    }
  };

  const status = getStatus();

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const change = (Math.random() - 0.5) * 100;
        const newValue = Math.max(
          2900,
          Math.min(4850.25, prev.currentSP500 + change)
        );
        return {
          ...prev,
          currentSP500: parseFloat(newValue.toFixed(2)),
          lastUpdate: new Date(),
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="text-center">
          <p className="text-sm text-slate-500">最終更新: {data.lastUpdate.toLocaleTimeString("ja-JP")}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            長期投資ダッシュボード
          </h1>
        </header>

        <section className={`rounded-[2rem] border ${status.border} ${status.bg} p-8 shadow-[0_30px_80px_-40px_rgba(16,185,129,0.45)]`}>
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 via-emerald-200 to-emerald-400 shadow-[0_20px_40px_-20px_rgba(16,185,129,0.35)]">
            <span className="text-lg font-semibold text-slate-900">{status.icon}</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold ${status.color} mb-2`}>{status.message}</h2>
          <p className="text-base text-slate-600">{status.detail}</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">S&P 500指数</p>
            <p className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900">
              {data.currentSP500.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">ATHからの変動率</p>
            <p className={`mt-4 text-4xl sm:text-5xl font-bold ${dropRate >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {dropRate >= 0 ? "+" : ""}{dropRate.toFixed(2)}%
            </p>
            <p className="mt-3 text-xs text-slate-500">ATH: {data.athSP500.toLocaleString("en-US")}</p>
          </article>
        </div>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">次の買付けまで（-30%）</p>
              <p className="mt-4 text-3xl font-bold text-slate-900">{Math.abs(remainingDrop).toFixed(2)}%下落</p>
            </div>
            <p className="text-sm text-slate-500">約{Math.abs(remainingPoints).toFixed(0)}ポイント</p>
          </div>

          <div className="mt-6 rounded-full bg-slate-100 h-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </section>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-center text-sm text-slate-700">
          💡 自動でモニタリング中です。行動が必要な場合はお知らせします。
        </div>
      </div>
    </div>
  );
}
