"use client";

import { FormEvent, useState } from "react";

type CampaignInput = {
  campaign: string;
  product: string;
  target: string;
  tone: string;
  offer: string;
};

type ResultCard = {
  id: "blog" | "caption" | "leaflet";
  label: string;
  title: string;
  body: string;
};

const INITIAL_INPUT: CampaignInput = {
  campaign: "봄 시즌 프로모션",
  product: "AI 마케팅 자동화 툴",
  target: "온라인 쇼핑몰 운영자",
  tone: "친근하고 전문적인 톤",
  offer: "7일 무료 체험",
};

const sanitize = (value: string, fallback: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const toHashTag = (value: string) =>
  value
    .replace(/\s+/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();

const buildResultCards = (input: CampaignInput): ResultCard[] => {
  const campaign = sanitize(input.campaign, INITIAL_INPUT.campaign);
  const product = sanitize(input.product, INITIAL_INPUT.product);
  const target = sanitize(input.target, INITIAL_INPUT.target);
  const tone = sanitize(input.tone, INITIAL_INPUT.tone);
  const offer = sanitize(input.offer, INITIAL_INPUT.offer);

  return [
    {
      id: "blog",
      label: "블로그",
      title: `${campaign} 소개 포스트`,
      body: [
        `${product}를 도입하면 반복 작업이 줄고 고객 반응 속도가 빨라집니다.`,
        `${target}에게 바로 적용 가능한 체크리스트와 실제 활용 흐름을 담아 신뢰를 높이세요.`,
        `${tone}을 유지하며 글 말미에 "${offer}" CTA를 배치해 전환을 유도합니다.`,
      ].join("\n\n"),
    },
    {
      id: "caption",
      label: "캡션",
      title: `${campaign} SNS 캡션`,
      body: [
        `${target}를 위한 ${product} 활용법, 지금 바로 시작하세요.`,
        `복잡한 마케팅 작업을 한 번에 정리하고 ${offer}까지 바로 체험할 수 있습니다.`,
        `#${toHashTag(campaign)} #${toHashTag(product)} #${toHashTag(target)}`,
      ].join("\n"),
    },
    {
      id: "leaflet",
      label: "전단지",
      title: `${campaign} 오프라인 전단지 카피`,
      body: [
        `[헤드라인] ${target} 매출을 바꾸는 ${product}`,
        `[핵심 혜택] 오늘 등록하면 ${offer} + 맞춤 세팅 가이드 제공`,
        `[행동 유도] 지금 상담 신청하고 가장 먼저 자동화를 시작하세요.`,
      ].join("\n"),
    },
  ];
};

export default function Home() {
  const [formInput, setFormInput] = useState(INITIAL_INPUT);
  const [cards, setCards] = useState(() => buildResultCards(INITIAL_INPUT));
  const [batchId, setBatchId] = useState(0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCards(buildResultCards(formInput));
    setBatchId((prev) => prev + 1);
  };

  return (
    <div className="page-shell">
      <main className="marketing-grid">
        <section className="input-panel">
          <p className="eyebrow">Marketing Prompt Studio</p>
          <h1>입력 폼 기반 카피 초안 생성</h1>
          <p className="panel-description">
            캠페인 정보를 입력하면 App Router 페이지에서 블로그, 캡션, 전단지
            카드 3개를 즉시 렌더링합니다.
          </p>

          <form className="campaign-form" onSubmit={handleSubmit}>
            <label htmlFor="campaign">캠페인명</label>
            <input
              id="campaign"
              value={formInput.campaign}
              onChange={(event) =>
                setFormInput((prev) => ({ ...prev, campaign: event.target.value }))
              }
              placeholder="예: 봄 시즌 프로모션"
            />

            <label htmlFor="product">상품/서비스</label>
            <input
              id="product"
              value={formInput.product}
              onChange={(event) =>
                setFormInput((prev) => ({ ...prev, product: event.target.value }))
              }
              placeholder="예: AI 마케팅 자동화 툴"
            />

            <label htmlFor="target">타겟 고객</label>
            <input
              id="target"
              value={formInput.target}
              onChange={(event) =>
                setFormInput((prev) => ({ ...prev, target: event.target.value }))
              }
              placeholder="예: 온라인 쇼핑몰 운영자"
            />

            <label htmlFor="tone">톤앤매너</label>
            <input
              id="tone"
              value={formInput.tone}
              onChange={(event) =>
                setFormInput((prev) => ({ ...prev, tone: event.target.value }))
              }
              placeholder="예: 친근하고 전문적인 톤"
            />

            <label htmlFor="offer">혜택/CTA</label>
            <input
              id="offer"
              value={formInput.offer}
              onChange={(event) =>
                setFormInput((prev) => ({ ...prev, offer: event.target.value }))
              }
              placeholder="예: 7일 무료 체험"
            />

            <button type="submit">결과 카드 생성</button>
          </form>
        </section>

        <section className="result-panel">
          <div className="result-header">
            <h2>결과 카드</h2>
            <p>블로그 / 캡션 / 전단지</p>
          </div>

          <div className="card-grid">
            {cards.map((card) => (
              <article
                key={`${batchId}-${card.id}`}
                className={`result-card ${card.id}`}
              >
                <span className="card-label">{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
