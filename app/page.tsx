"use client";

import React, { useState, useEffect } from "react";

// 컴포넌트 이름을 'Page'로 변경하거나, 아래처럼 직접 export default를 붙여줍니다.
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

  const getStatus = () => {
    if (dropRate > -30) {
      return {
        icon: "🟢",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        message: "正常範囲です",
        detail: "特に何もしなくて問題ありません",
      };
    } else if (dropRate >= -40 && dropRate <= -30) {
      return {
        icon: "🟡",
        color: "text-amber-500",
        bg: "bg-amber-50",
        border: "border-amber-200",
        message: "1回目の買い付け実行済み",
        detail: "追加の対応は不要です",
      };
    } else {
      return {
        icon: "🔴",
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-200",
        message: "2回目の買い付け実行済み",
        detail: "すべての計画が完了しました",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            長期投資ダッシュボード
          </h1>
          <p className="text-sm text-slate-500">
            最終更新時刻： {data.lastUpdate.toLocaleTimeString("ja-JP")}
          </p>
        </div>

        {/* 스테ータ스 카드 */}
        <div className={`${status.bg} ${status.border} border-2 rounded-3xl p-8 text-center shadow-lg transition-all duration-500`}>
          <div className="text-7xl mb-4">{status.icon}</div>
          <h2 className={`text-2xl md:text-3xl font-bold ${status.color} mb-2`}>
            {status.message}
          </h2>
          <p className="text-lg text-slate-600">{status.detail}</p>
        </div>

        {/* S&P 500 지수 카드 */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">S&P 500 指数</div>
          <div className="text-4xl md:text-5xl font-bold text-slate-800">
            {data.currentSP500.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        {/* 변동률 카드 */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">ATHからの変動率</div>
          <div className={`text-5xl md:text-6xl font-bold ${dropRate >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            {dropRate >= 0 ? "+" : ""}{dropRate.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-400 mt-2">ATH：{data.athSP500.toLocaleString("en-US")}</div>
        </div>

        {/* 구매 가이드 진행 바 */}
        {dropRate > -40 && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <div className="text-sm text-slate-500 mb-2">次の買い付けまで（{nextThreshold}%）</div>
            <div className="text-3xl md:text-4xl font-bold text-slate-700">
              あと {Math.abs(remainingDrop).toFixed(2)}% 下落
            </div>
            <div className="text-sm text-slate-500 mt-2">
              約 {Math.abs(remainingPoints).toFixed(0)} ポイント
            </div>
            <div className="mt-4 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, (Math.abs(dropRate) / Math.abs(nextThreshold)) * 100))}%` }}
              />
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800">💡 自動でモニタリング中です。行動が必要な場合はお知らせします。</p>
        </div>
      </div>
    </div>
  );
}
