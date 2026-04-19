"use client";

import React, { useState, useEffect } from "react";

type Locale = "ja" | "ko" | "en";

const DATA_STORAGE_KEY = "invest-dashboard-user";
const LOCALE_STORAGE_KEY = "invest-dashboard-locale";

const localeOptions: { code: Locale; label: string }[] = [
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
];

const localeMap: Record<Locale, string> = {
  ja: "ja-JP",
  ko: "ko-KR",
  en: "en-US",
};

const translations = {
  ja: {
    title: "資産形成ダッシュボード",
    updatedAt: "更新",
    usdJpy: "USD/JPY",
    spIndex: "S&P 500指数",
    athDrop: "ATHからの下落率",
    goalTitle: "1億円チャレンジ進捗",
    totalLabel: "累計",
    targetLabel: "目標",
    nisaTitle: "新NISA枠 利用状況 (年間)",
    remaining: "残枠",
    yearlyLimit: "年間上限 ¥3,600,000",
    userSettings: "ユーザー設定",
    autoSave: "設定は自動でローカル保存されます。",
    goalAmount: "目標金額",
    totalInvested: "累計投資額",
    nisaUsed: "NISA 使用額",
    rakutenInvestments: "楽天投資商品",
    rakutenTitle: "楽天関連商品",
    highDividendTitle: "高配当株式",
    japanFundTitle: "日本ファンド",
    currentPrice: "現在価格",
    changePercent: "変動率",
    investedAmount: "投資額",
    expectedYield: "予想利回り",
    footer: "※ 本アプリは投資助言を行うものではありません。自己責任での運用をお願いします。",
    status: {
      normal: {
        label: "正常",
        message: "正常範囲です",
        detail: "何もしなくても問題ありません。",
      },
      caution: {
        label: "調整",
        message: "押し目買いの検討",
        detail: "少しずつ追加購入を検討してください。",
      },
      buyZone: {
        label: "絶好機",
        message: "積極的買付けゾーン",
        detail: "キャッシュポジションを確認してください。",
      },
    },
    language: "言語",
  },
  ko: {
    title: "자산 형성 대시보드",
    updatedAt: "업데이트",
    usdJpy: "USD/JPY",
    spIndex: "S&P 500 지수",
    athDrop: "ATH 대비 하락률",
    goalTitle: "1억엔 챌린지 진행",
    totalLabel: "누계",
    targetLabel: "목표",
    nisaTitle: "신NISA 한도 이용 현황 (연간)",
    remaining: "잔여 한도",
    yearlyLimit: "연간 한도 ¥3,600,000",
    userSettings: "사용자 설정",
    autoSave: "설정은 자동으로 로컬 저장됩니다.",
    goalAmount: "목표 금액",
    totalInvested: "누적 투자액",
    nisaUsed: "NISA 사용액",
    rakutenInvestments: "Rakuten 투자 상품",
    rakutenTitle: "Rakuten 관련 상품",
    highDividendTitle: "고배당 주식",
    japanFundTitle: "일본 펀드",
    currentPrice: "현재 가격",
    changePercent: "변동률",
    investedAmount: "투자 금액",
    expectedYield: "예상 수익률",
    footer: "※ 본 앱은 투자 조언을 제공하지 않습니다. 본인 책임으로 운용하세요.",
    status: {
      normal: {
        label: "정상",
        message: "정상 범위입니다",
        detail: "아무것도 하지 않아도 괜찮습니다.",
      },
      caution: {
        label: "조정",
        message: "매수 타이밍을 주시하세요",
        detail: "추가 매수를 천천히 고려해보세요.",
      },
      buyZone: {
        label: "매수 적기",
        message: "적극 매수 구간입니다",
        detail: "현금 비중을 확인하세요.",
      },
    },
    language: "언어",
  },
  en: {
    title: "Wealth Dashboard",
    updatedAt: "Updated",
    usdJpy: "USD/JPY",
    spIndex: "S&P 500 Index",
    athDrop: "Drawdown from ATH",
    goalTitle: "100M JPY Goal Progress",
    totalLabel: "Total",
    targetLabel: "Target",
    nisaTitle: "New NISA Usage (Annual)",
    remaining: "Remaining",
    yearlyLimit: "Annual limit ¥3,600,000",
    userSettings: "User Settings",
    autoSave: "Settings are saved locally.",
    goalAmount: "Target Amount",
    totalInvested: "Total Invested",
    nisaUsed: "NISA Used",
    rakutenInvestments: "Rakuten Investments",
    rakutenTitle: "Rakuten Products",
    highDividendTitle: "High Dividend Stocks",
    japanFundTitle: "Japan Funds",
    currentPrice: "Current Price",
    changePercent: "Change %",
    investedAmount: "Invested Amount",
    expectedYield: "Expected Yield",
    footer: "※ This app does not provide investment advice. Invest at your own risk.",
    status: {
      normal: {
        label: "Normal",
        message: "Within normal range",
        detail: "No action is needed right now.",
      },
      caution: {
        label: "Correction",
        message: "Consider buying on dips",
        detail: "Review the market before adding more.",
      },
      buyZone: {
        label: "Buy Zone",
        message: "Aggressive buying zone",
        detail: "Check your cash balance before moving.",
      },
    },
    language: "Language",
  },
} as const;

export default function InvestmentDashboard() {
  const [data, setData] = useState({
    currentSP500: 7120.50, // 2026년 가상 현재가
    athSP500: 7200.00,    // 전고점
    jpyUsd: 158.45,       // 현재 환율
    totalInvestedJPY: 15000000, // 누적 투자액 (예시: 1500만엔)
    targetAmountJPY: 100000000, // 목표: 1억엔
    annualNisaUsed: 1200000,    // 올해 NISA 사용액
    lastUpdate: new Date(),
    // 새로운 투자 상품들
    rakutenProducts: {
      invested: 2000000, // 투자 금액
      currentValue: 2100000, // 현재 가치
      changePercent: 5.0, // 변동률
    },
    highDividendStocks: {
      invested: 1500000,
      currentValue: 1480000,
      changePercent: -1.3,
      expectedYield: 4.2, // 예상 배당률
    },
    japanFunds: {
      invested: 3000000,
      currentValue: 3150000,
      changePercent: 5.0,
      expectedYield: 3.8,
    },
  });
  const [locale, setLocale] = useState<Locale>("ja");

  // 계산 로직
  const dropRate = ((data.currentSP500 - data.athSP500) / data.athSP500) * 100;
  const progressToGoal = (data.totalInvestedJPY / data.targetAmountJPY) * 100;
  const nisaLimit = 3600000; // 신NISA 연간 한도
  const nisaProgress = (data.annualNisaUsed / nisaLimit) * 100;

  const t = translations[locale as Locale];

  const getStatus = () => {
    if (dropRate > -5) {
      return { ...t.status.normal, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    } else if (dropRate > -15) {
      return { ...t.status.caution, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    }
    return { ...t.status.buyZone, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  const status = getStatus();

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (savedLocale && Object.keys(translations).includes(savedLocale)) {
      setLocale(savedLocale as Locale);
    }

    const saved = window.localStorage.getItem(DATA_STORAGE_KEY);
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
    const { totalInvestedJPY, targetAmountJPY, annualNisaUsed, jpyUsd, rakutenProducts, highDividendStocks, japanFunds } = data;
    window.localStorage.setItem(
      DATA_STORAGE_KEY,
      JSON.stringify({ totalInvestedJPY, targetAmountJPY, annualNisaUsed, jpyUsd, rakutenProducts, highDividendStocks, japanFunds })
    );
  }, [data.totalInvestedJPY, data.targetAmountJPY, data.annualNisaUsed, data.jpyUsd, data.rakutenProducts, data.highDividendStocks, data.japanFunds]);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  // 실시간 시뮬레이션 (실제 구현시 API 연동 권장)
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const spChange = (Math.random() - 0.5) * 15;
        const rakutenChange = (Math.random() - 0.5) * 8;
        const highDividendChange = (Math.random() - 0.5) * 6;
        const japanFundChange = (Math.random() - 0.5) * 7;

        return {
          ...prev,
          currentSP500: parseFloat((prev.currentSP500 + spChange).toFixed(2)),
          rakutenProducts: {
            ...prev.rakutenProducts,
            currentValue: parseFloat((prev.rakutenProducts.currentValue + rakutenChange * 1000).toFixed(0)),
            changePercent: parseFloat((((prev.rakutenProducts.currentValue + rakutenChange * 1000) / prev.rakutenProducts.invested - 1) * 100).toFixed(1)),
          },
          highDividendStocks: {
            ...prev.highDividendStocks,
            currentValue: parseFloat((prev.highDividendStocks.currentValue + highDividendChange * 800).toFixed(0)),
            changePercent: parseFloat((((prev.highDividendStocks.currentValue + highDividendChange * 800) / prev.highDividendStocks.invested - 1) * 100).toFixed(1)),
          },
          japanFunds: {
            ...prev.japanFunds,
            currentValue: parseFloat((prev.japanFunds.currentValue + japanFundChange * 1200).toFixed(0)),
            changePercent: parseFloat((((prev.japanFunds.currentValue + japanFundChange * 1200) / prev.japanFunds.invested - 1) * 100).toFixed(1)),
          },
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
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
            <p className="text-sm text-slate-500 font-mono">{t.usdJpy}: ¥{data.jpyUsd}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs text-slate-400">
              {t.updatedAt}: {data.lastUpdate.toLocaleTimeString(localeMap[locale])}
            </div>
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <span>{t.language}</span>
              <select
                value={locale}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLocale(e.target.value as Locale)}
                className="bg-transparent text-sm outline-none"
              >
                {localeOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.spIndex}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{data.currentSP500.toLocaleString(localeMap[locale])}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.athDrop}</p>
            <p className={`text-3xl font-bold mt-2 ${dropRate >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {dropRate.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* 목표 달성률 (1억엔 프로젝트) */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">{t.goalTitle}</h3>
            <span className="text-sm font-bold text-blue-600">{progressToGoal.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
              style={{ width: `${progressToGoal}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
            <span>{t.totalLabel}: ¥{(data.totalInvestedJPY / 10000).toFixed(0)}万</span>
            <span>{t.targetLabel}: ¥100,000万</span>
          </div>
        </section>

        {/* NISA 한도 트래커 */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">{t.nisaTitle}</h3>
            <span className="text-sm text-slate-500">{t.remaining}: ¥{(nisaLimit - data.annualNisaUsed).toLocaleString(localeMap[locale])}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500"
              style={{ width: `${nisaProgress}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-slate-400 text-right">{t.yearlyLimit}</p>
        </section>

        {/* Rakuten 투자 상품 포트폴리오 */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">{t.rakutenTitle}</h3>
          <div className="space-y-4">
            {/* Rakuten 상품들 */}
            <div className="grid gap-4 md:grid-cols-1">
              {/* 楽天・高配当株式・日本ファンド */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-700">{t.highDividendTitle}</p>
                    <p className="text-xs text-slate-500">9I312252</p>
                  </div>
                  <span className={`text-sm font-bold ${data.highDividendStocks.changePercent >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {data.highDividendStocks.changePercent >= 0 ? "+" : ""}{data.highDividendStocks.changePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900">¥{data.highDividendStocks.currentValue.toLocaleString(localeMap[locale])}</p>
                  <p className="text-xs text-slate-500">{t.investedAmount}: ¥{data.highDividendStocks.invested.toLocaleString(localeMap[locale])}</p>
                  <p className="text-xs text-slate-500">{t.expectedYield}: {data.highDividendStocks.expectedYield}%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800">{t.userSettings}</h3>
            <p className="text-sm text-slate-500">{t.autoSave}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-600">
              <span>{t.goalAmount}</span>
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
              <span>{t.totalInvested}</span>
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
              <span>{t.nisaUsed}</span>
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

        <footer className="text-center text-[10px] text-slate-400">{t.footer}</footer>
      </div>
    </div>
  );
}