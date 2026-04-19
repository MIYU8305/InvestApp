"use client";

import React, { useState, useEffect } from "react";

export default function InvestmentDashboard() {
  const [data, setData] = useState({
    currentSP500: 7120.50, // 2026년 가상 현재가
    athSP500: 7200.00,    // 전고점
    jpyUsd: 158.45,       // 현재 환율
    totalInvestedJPY: 15000000, // 누적 투자액 (예시: 1500만엔)
    targetAmountJPY: 100000000, // 목표: 1억엔
    annualNisaUsed: 1200000,    // 올해 NISA 사용액
    lastUpdate: new Date(),
  });

  // 계산 로직
  const dropRate = ((data.currentSP500 - data.athSP500) / data.athSP500) * 100;
  const progressToGoal = (data.totalInvestedJPY / data.targetAmountJPY) * 100;
  const nisaLimit = 3600000; // 신NISA 연간 한도
  const nisaProgress = (data.annualNisaUsed / nisaLimit) * 100;

  const getStatus = () => {
    if (dropRate > -5) {
      return {
        label: "正常",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        message: "正常範囲です",
        detail: "特に何もしなくて問題ありません",
      };
    } else if (dropRate > -15) {
      return {
        label: "調整",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        message: "押し目買いの検討",
        detail: "少しずつ追加購入を検討してください。",
      };
    } else {
      return {
        label: "絶好機",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        message: "積極的買付けゾーン",
        detail: "キャッシュポジションを確認してください。",
      };
    }
  };

  const status = getStatus();
  const STORAGE_KEY = "invest-dashboard-user";

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData((prev) => ({
          ...prev,
          ...parsed,
        }));
      } catch (error) {
        console.error("localStorage parse error", error);
      }
    }
  }, []);

  useEffect(() => {
    const { totalInvestedJPY, targetAmountJPY, annualNisaUsed, jpyUsd } = data;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ totalInvestedJPY, targetAmountJPY, annualNisaUsed, jpyUsd })
    );
  }, [data.totalInvestedJPY, data.targetAmountJPY, data.annualNisaUsed, data.jpyUsd]);

  // 실시간 시뮬레이션 (실제 구현시 API 연동 권장)
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const change = (Math.random() - 0.5) * 15;
        return {
          ...prev,
          currentSP500: parseFloat((prev.currentSP500 + change).toFixed(2)),
          lastUpdate: new Date(),
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* 헤더 */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">資産形成ダッシュボード</h1>
            <p className="text-sm text-slate-500 font-mono">USD/JPY: ¥{data.jpyUsd}</p>
          </div>
          <p className="text-xs text-slate-400">更新: {data.lastUpdate.toLocaleTimeString("ja-JP")}</p>
        </header>

        {/* 메인 상태 알림 */}
        <section className={`rounded-3xl border ${status.border} ${status.bg} p-6 shadow-sm transition-all`}>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1 rounded-full text-sm font-bold bg-white border ${status.border} ${status.color}`}>
              {status.label}
            </div>
            <h2 className={`text-xl font-bold ${status.color}`}>{status.message}</h2>
          </div>
          <p className="mt-2 text-slate-600 text-sm">{status.detail}</p>
        </section>

        {/* 지수 및 변동률 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">S&P 500 Index</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{data.currentSP500.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATHからの下락率</p>
            <p className={`text-3xl font-bold mt-2 ${dropRate >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {dropRate.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* 목표 달성률 (1억엔 프로젝트) */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">1億円チャレンジ進捗</h3>
            <span className="text-sm font-bold text-blue-600">{progressToGoal.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
              style={{ width: `${progressToGoal}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
            <span>累計: ¥{(data.totalInvestedJPY / 10000).toFixed(0)}万</span>
            <span>目標: ¥10,000万</span>
          </div>
        </section>

        {/* NISA 한도 트래커 */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">新NISA枠 利用状況 (年間)</h3>
            <span className="text-sm text-slate-500">残枠: ¥{(nisaLimit - data.annualNisaUsed).toLocaleString()}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500"
              style={{ width: `${nisaProgress}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-slate-400 text-right">年間上限 ¥3,600,000</p>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800">ユーザー設定</h3>
            <p className="text-sm text-slate-500">設定は自動でローカル保存されます。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-600">
              <span>目標金額</span>
              <input
                type="number"
                value={data.targetAmountJPY}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    targetAmountJPY: Number(e.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>累計投資額</span>
              <input
                type="number"
                value={data.totalInvestedJPY}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    totalInvestedJPY: Number(e.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>NISA 使用額</span>
              <input
                type="number"
                value={data.annualNisaUsed}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    annualNisaUsed: Number(e.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
              />
            </label>
          </div>
        </section>

        <footer className="text-center text-[10px] text-slate-400">
          ※ 本アプリは投資助言を行うものではありません。自己責任での運用をお願いします。
        </footer>
      </div>
    </div>
  );
}