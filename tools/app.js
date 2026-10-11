(() => {
  "use strict";

  window.__scoringLocked = false;
  window.__scoringHash = "";

  const stars = {
    天医: { category: "吉", levels: { 1: ["13", "31"], 2: ["68", "86"], 3: ["49", "94"], 4: ["27", "72"] } },
    延年: { category: "吉", levels: { 1: ["19", "91"], 2: ["78", "87"], 3: ["34", "43"], 4: ["26", "62"] } },
    生气: { category: "吉", levels: { 1: ["14", "41"], 2: ["67", "76"], 3: ["39", "93"], 4: ["28", "82"] } },
    伏位: { category: "吉", levels: { 1: ["11", "22"], 2: ["88", "99"], 3: ["66", "77"], 4: ["33", "44"] }, special: { "55": 0 } },
    绝命: { category: "凶", levels: { 1: ["12", "21"], 2: ["69", "96"], 3: ["48", "84"], 4: ["37", "73"] } },
    五鬼: { category: "凶", levels: { 1: ["18", "81"], 2: ["79", "97"], 3: ["36", "63"], 4: ["24", "42"] } },
    祸害: { category: "凶", levels: { 1: ["17", "71"], 2: ["89", "98"], 3: ["46", "64"], 4: ["23", "32"] } },
    六煞: { category: "凶", levels: { 1: ["16", "61"], 2: ["47", "74"], 3: ["38", "83"], 4: ["29", "92"] } }
  };

  const pairMap = {};
  Object.entries(stars).forEach(([star, info]) => {
    Object.entries(info.levels).forEach(([level, pairs]) => pairs.forEach(pair => { pairMap[pair] = { pair, star, category: info.category, level: Number(level) }; }));
    if (info.special) Object.entries(info.special).forEach(([pair]) => { pairMap[pair] = { pair, star, category: info.category, level: 0, special: true }; });
  });

  const positiveCombos = new Set(["天医+生气", "生气+天医", "天医+延年", "延年+天医", "生气+延年", "延年+生气", "生气+伏位", "伏位+生气", "伏位+天医"]);
  const cautionCombos = new Set(["绝命+绝命", "五鬼+五鬼", "祸害+祸害", "六煞+六煞", "天医+六煞", "天医+五鬼", "天医+绝命", "延年+绝命", "延年+祸害", "六煞+绝命", "六煞+祸害", "五鬼+祸害", "绝命+祸害"]);
  const comboGuides = {
    "天医+生气": "天医主资源、照顾与实际收获，生气主人缘、机会与外部助力；两者相遇像先有资源再有人脉，适合经营客户、合作关系和需要口碑扩散的事情。",
    "天医+延年": "天医带来资源和结果，延年强调责任、执行与专业；这组组合适合把机会落地成长期成果，但不能只看眼前收益，还要建立流程、信用与持续交付能力。",
    "生气+延年": "生气代表贵人与机会，延年代表执行、管理与担当；人脉容易转化为实际项目，适合咨询、管理、销售和专业服务，但合作中要把分工、目标和责任提前讲清。",
    "生气+伏位": "生气带来认识新人的机会，伏位负责承接、沉淀与重复积累；这组组合不一定一夜见效，却适合长期经营客户、社群、内容和稳定复购的关系。",
    "伏位+天医": "伏位提供稳定基础与持续累积，天医带来资源、照顾和现实回报；先守住节奏再接住机会，比较适合稳健经营、储蓄规划和需要信任感的合作。",
    "绝命+绝命": "绝命连续出现时，冲劲、决断和波动会被同时放大；遇到机会容易快速下注，遇到阻力又可能突然翻盘，重大投资、转行和感情承诺都应设置止损与冷静期。",
    "五鬼+五鬼": "五鬼重变化、灵感、猜测和夜间思虑，连续出现时容易想得快、改得快、睡得少；适合创意突破，却不适合凭情绪做重大决定，合同与信息必须反复核实。",
    "祸害+祸害": "祸害叠加时，表达、口舌、误会和情绪化反应会变得明显；说话容易快过思考，合作应留下文字记录，感情中也要避免讽刺、翻旧账和在气头上下结论。",
    "六煞+六煞": "六煞连续出现会放大情绪、人际牵动、犹豫和关系依赖；容易把别人的态度当成自己的判断依据，处理感情、合伙和客户关系时，要有边界、节奏与独立决定。",
    "天医+六煞": "天医强调物质、享受与照顾，六煞强调情绪、人情和关系牵动；两者相遇容易为了关系花钱、为了面子承诺，适合有预算地付出，不适合冲动消费或替人担责。",
    "天医+五鬼": "天医带来可见机会和现实收益，五鬼带来突变、猜疑与计划反复；这组结构有机会也有不确定性，适合小步试错，投资、借贷和高杠杆选择应保持余地。",
    "天医+绝命": "天医有获得、照顾和财富机会，绝命有快速、极端和大进大出的倾向；两者相邻时容易因一次机会放大承诺，投资、创业和感情投入都要分阶段确认。",
    "延年+绝命": "延年让人重效率、责任和掌控，绝命又把冲劲与风险推高；做事可能很有魄力，却也容易硬碰硬、过度承担，事业上要学会授权，身体和情绪要留恢复时间。",
    "延年+祸害": "延年强调专业、规则和效率，祸害容易带来直接表达、争辩与口舌；能力并不是问题，问题在沟通方式，适合用数据、流程和书面确认代替情绪化说服。",
    "六煞+绝命": "六煞让情绪与关系影响判断，绝命让行动变快、决定变重；两者叠加时容易先受刺激再做激烈回应，遇到感情、合伙或金钱冲突应先暂停，再处理事实。",
    "六煞+祸害": "六煞牵动关系与情绪，祸害放大表达与误会；这组组合容易因为一句话影响整段关系，感情和合作都要避免猜疑式沟通，重要事项最好当面确认并留有记录。",
    "五鬼+祸害": "五鬼带来变化、猜测和信息噪音，祸害带来表达压力与口舌；容易听到很多版本却难以定心，适合把消息分级核验，不宜因传闻、情绪或片面意见快速站队。",
    "绝命+祸害": "绝命让行动和判断变得强烈，祸害又容易把冲突带到语言和关系中；有想法并不可怕，关键是先沟通、后推进，避免用过激表达破坏本来可以修正的局面。"
  };
  const chemicalPatterns = ["213", "968", "176", "619"];
  const elementDigits = { 水: ["1", "6", "7"], 木: ["3", "4"], 火: ["9"], 土: ["2", "8"], 金: ["6", "7"] };

  const $ = selector => document.querySelector(selector);
  const escapeText = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[char]));
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const average = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

  function pairScore(hit) {
    if (!hit) return 2.5;
    if (hit.star === "伏位") return hit.special ? 3.2 : ({ 1: 4.2, 2: 3.8, 3: 3.4, 4: 3 }[hit.level] || 3.2);
    if (hit.category === "吉") return ({ 1: 5, 2: 4.5, 3: 4, 4: 3.5 }[hit.level] || 3.5);
    return ({ 1: .5, 2: 1, 3: 1.5, 4: 2 }[hit.level] || 1.5);
  }

  function scanPairs(digits) {
    return Array.from({ length: Math.max(0, digits.length - 1) }, (_, index) => {
      const pair = digits.slice(index, index + 2);
      const hit = pairMap[pair] ? { ...pairMap[pair], start: index + 1 } : null;
      return { pair, start: index + 1, hit, score: pairScore(hit) };
    });
  }

  function comboTone(a, b) {
    if (!a || !b) return "neutral";
    const combo = `${a}+${b}`;
    const reverse = `${b}+${a}`;
    if (positiveCombos.has(combo) || positiveCombos.has(reverse)) return "positive";
    if (cautionCombos.has(combo) || cautionCombos.has(reverse)) return "caution";
    return "neutral";
  }

  function comboDetail(a, b) {
    const label = `${a}+${b}`;
    const reverse = `${b}+${a}`;
    const tone = comboTone(a, b);
    return {
      label,
      tone,
      impact: tone === "positive" ? 3 : tone === "caution" ? -3 : 0,
      explanation: comboGuides[label] || comboGuides[reverse] || "这组组合更像过渡与缓冲，前一个磁场的力量没有被明显放大，后一个磁场也没有形成强烈冲突；最终效果仍要结合出现位置、前后顺序和整体吉凶比例一起判断。"
    };
  }

  function buildCombos(windows) {
    const combos = [];
    for (let i = 0; i < windows.length - 1; i += 1) {
      const a = windows[i].hit;
      const b = windows[i + 1].hit;
      if (!a || !b) continue;
      const detail = comboDetail(a.star, b.star);
      combos.push({ ...detail, start: windows[i].start });
    }
    return combos;
  }

  function hasConsecutiveBad(windows, count = 3) {
    let streak = 0;
    return windows.some(window => {
      streak = window.hit?.category === "凶" ? streak + 1 : 0;
      return streak >= count;
    });
  }

  function isStrongBadAdjacent(windows) {
    return windows.some((window, index) => window.hit?.category === "凶" && window.hit.level === 1 && windows[index + 1]?.hit?.category === "凶" && windows[index + 1]?.hit.level === 1);
  }

  function nearbyModifier(windows, digitString, targetCategory, modifier) {
    const indices = [...digitString].flatMap((digit, index) => digit === modifier ? [index] : []);
    return windows.filter(window => window.hit?.category === targetCategory && indices.some(index => Math.abs((window.start - 1) - index) <= 1)).length;
  }

  function baseRiskScore(windows, digits, tailStart) {
    const hits = windows.filter(item => item.hit).map(item => item.hit);
    let score = 15;
    const allGood = hits.length > 0 && hits.every(hit => hit.category === "吉");
    const allBad = hits.length > 0 && hits.every(hit => hit.category === "凶");
    if (allGood) score -= 3;
    if (allBad) score -= 8;
    if (hasConsecutiveBad(windows)) score -= 5;
    if (isStrongBadAdjacent(windows)) score -= 4;
    const tailBad = windows.filter(item => item.hit?.category === "凶" && item.start >= tailStart).length;
    score -= Math.min(4, tailBad * 2);
    if (chemicalPatterns.some(pattern => digits.includes(pattern))) score += 2;
    score -= Math.min(2, nearbyModifier(windows, digits, "凶", "0"));
    score += Math.min(2, nearbyModifier(windows, digits, "吉", "5"));
    return { score: clamp(score, 0, 15), allGood, allBad, tailBad };
  }

  function comboScore(combos, max, fallback) {
    const delta = combos.reduce((sum, combo) => sum + combo.impact, 0);
    return { score: clamp(fallback + delta, 0, max), delta };
  }

  function positionPhoneScore(windows) {
    let score = 10;
    const tail = windows.filter(item => item.hit && item.start >= 8 && item.start <= 10);
    score += Math.min(4, tail.filter(item => item.hit.star === "天医").length * 2);
    score += Math.min(4, tail.filter(item => item.hit.star === "延年").length * 2);
    score += Math.min(2, tail.filter(item => item.hit.star === "生气").length);
    score += Math.min(2, tail.filter(item => item.hit.star === "伏位").length);
    score -= Math.min(9, tail.filter(item => item.hit.category === "凶").length * 3);
    score += Math.min(2, windows.filter(item => item.hit?.star === "生气" && item.start >= 4 && item.start <= 8).length);
    score += Math.min(1, windows.filter(item => item.hit?.star === "生气" && item.start <= 3).length);
    score -= Math.min(2, windows.filter(item => item.hit?.category === "凶" && item.start <= 3).length);
    return clamp(score, 0, 20);
  }

  function positionPlateScore(windows, length) {
    const tailStart = Math.max(1, length - 3);
    const tail = windows.filter(item => item.hit && item.start >= tailStart);
    let score = 10;
    score += Math.min(6, tail.filter(item => item.hit.star === "天医").length * 3);
    score += Math.min(6, tail.filter(item => item.hit.star === "延年").length * 3);
    score += Math.min(4, tail.filter(item => item.hit.star === "生气").length * 2);
    score += Math.min(2, tail.filter(item => item.hit.star === "伏位").length);
    score -= Math.min(9, tail.filter(item => item.hit.category === "凶").length * 3);
    return clamp(score, 0, 20);
  }

  function personalScore(digits, windows, options) {
    let score = 2.5;
    if (options.gender === "女" && /(19|91|78|87)$/.test(digits)) score -= 2;
    if (options.gender === "女" && digits.endsWith("181818")) score -= 3;
    return clamp(score, 0, 5);
  }

  function analyzeFiveElements(digits) {
    const order = ["金", "木", "水", "火", "土"];
    const meanings = {
      金: "规则、决断、执行与资源整合",
      木: "成长、创造、规划与人脉伸展",
      水: "流动、沟通、变通与财气",
      火: "表达、名望、行动与影响力",
      土: "承接、稳定、信用与长期积累"
    };
    const source = [...digits].filter(char => /\d/.test(char));
    const counts = Object.fromEntries(order.map(element => [element, source.filter(char => elementDigits[element].includes(char)).length]));
    const maxCount = Math.max(1, ...Object.values(counts));
    const minCount = Math.min(...Object.values(counts));
    const items = order.map(element => ({
      element,
      count: counts[element],
      strength: Math.round((counts[element] / maxCount) * 100),
      state: counts[element] === maxCount ? "偏旺" : counts[element] === minCount ? "偏弱" : "平衡",
      meaning: meanings[element]
    }));
    const dominant = order.filter(element => counts[element] === maxCount && maxCount > 0);
    const weak = order.filter(element => counts[element] === minCount);
    return {
      items,
      dominant,
      weak,
      fitText: dominant.length ? `适合需要补${dominant.slice(0, 2).join("、")}的人参考` : "五行暂无明显偏向"
    };
  }

  function buildPhoneElementProfile(options, elements) {
    const birthday = options?.birthday;
    if (!birthday?.date || !birthday?.time || typeof window.__getBaziElementUse !== "function") return null;
    const use = window.__getBaziElementUse(birthday.date, birthday.time, birthday.gender === "女" ? "女" : "男", birthday.calendar || "solar");
    if (!use?.preferred?.length) return null;
    const matches = use.preferred.map(element => {
      const item = elements.items.find(entry => entry.element === element);
      return { element, count: item?.count || 0 };
    }).filter(item => item.count > 0);
    const boost = clamp(Number(matches.reduce((sum, item) => sum + Math.min(2, item.count) * .8, 0).toFixed(1)), 0, 4);
    return { ...use, matches, boost };
  }

  function riskCap(windows, tailStart) {
    const tailBad = windows.filter(item => item.hit?.category === "凶" && item.start >= tailStart).length;
    const recognized = windows.filter(item => item.hit);
    if (recognized.length && recognized.every(item => item.hit.category === "凶")) return 39;
    if (hasConsecutiveBad(windows) || isStrongBadAdjacent(windows)) return 49;
    if (tailBad >= 2) return 59;
    return 100;
  }

  function analyzePhone(digits, options) {
    const windows = scanPairs(digits);
    const combos = buildCombos(windows);
    const risk = baseRiskScore(windows, digits, 8);
    const combination = comboScore(combos, 20, 10);
    const elements = analyzeFiveElements(digits);
    const elementProfile = buildPhoneElementProfile(options, elements);
    const components = {
      pair: clamp(average(windows.map(item => item.score)) / 5 * 40, 0, 40),
      position: positionPhoneScore(windows),
      combination: combination.score,
      risk: risk.score,
      personal: personalScore(digits, windows, options),
      element: elementProfile?.boost || 0
    };
    let score = Math.round(components.pair + components.position + components.combination + components.risk + components.personal);
    score = Math.round(clamp(score + components.element, 0, 100));
    score = Math.min(score, riskCap(windows, 8));
    return { kind: "phone", digits, windows, combos, comboImpact: combination.delta, elements, elementProfile, components, score, risk, positives: buildPositives(windows, combos, "phone"), risks: buildRisks(windows, combos, digits, "phone", risk) };
  }

  function convertPlate(body) {
    const clean = body.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const digits = [...clean].map(char => /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 64) : char).join("");
    return { clean, digits };
  }

  function analyzePlate(body, prefix) {
    const converted = convertPlate(body);
    const windows = scanPairs(converted.digits);
    const tailStart = Math.max(1, converted.digits.length - 3);
    const combos = buildCombos(windows);
    const risk = baseRiskScore(windows, converted.digits, tailStart);
    const combination = comboScore(combos, 15, 7.5);
    const components = {
      pair: clamp(average(windows.map(item => item.score)) / 5 * 50, 0, 50),
      position: positionPlateScore(windows, converted.digits.length),
      combination: combination.score,
      risk: risk.score
    };
    let score = Math.round(components.pair + components.position + components.combination + components.risk);
    score = Math.min(score, riskCap(windows, tailStart));
    return { kind: "plate", prefix, body: converted.clean, digits: converted.digits, windows, combos, comboImpact: combination.delta, elements: analyzeFiveElements(converted.digits), components, score, risk, positives: buildPositives(windows, combos, "plate"), risks: buildRisks(windows, combos, converted.digits, "plate", risk) };
  }

  function buildPositives(windows, combos, kind) {
    const positives = [];
    const recognized = windows.filter(item => item.hit);
    if (recognized.some(item => item.hit.star === "天医")) positives.push(kind === "phone" ? "号码中有天医财富 / 婚姻象意" : "换算后命中天医财富象意");
    if (recognized.some(item => item.hit.star === "生气")) positives.push("出现生气贵人 / 人脉象意");
    if (recognized.some(item => item.hit.star === "延年")) positives.push("出现延年事业 / 专业象意");
    if (recognized.some(item => item.hit.star === "伏位")) positives.push("有伏位持续 / 稳定象意");
    const positiveCombo = combos.find(combo => combo.tone === "positive");
    if (positiveCombo) positives.push(`形成${positiveCombo.label}组合`);
    return positives.slice(0, 4);
  }

  function buildRisks(windows, combos, digits, kind, risk) {
    const risks = [];
    if (risk.allBad) risks.push("有效磁场几乎全为凶星，风险封顶");
    if (risk.tailBad) risks.push(kind === "phone" ? "结果区出现凶星，尾部需重点留意" : "车牌尾部出现凶星，尾部权重较高");
    if (hasConsecutiveBad(windows)) risks.push("出现连续三组以上凶星窗口");
    if (isStrongBadAdjacent(windows)) risks.push("出现两个一级凶星相邻结构");
    if (digits.includes("0")) risks.push("0 带有隐藏 / 空 / 变化的特殊解释");
    if (digits.includes("5")) risks.push("5 带有显现 / 加强的特殊解释");
    const caution = combos.find(combo => combo.tone === "caution");
    if (caution) risks.push(`需要留意${caution.label}组合`);
    return risks.slice(0, 4);
  }

  function levelFor(score) {
    if (score >= 90) return { label: "首选", summary: "结构完整，整体偏吉，可优先考虑。" };
    if (score >= 80) return { label: "强烈推荐", summary: "吉星与位置配合较好，整体参考表现稳健。" };
    if (score >= 70) return { label: "推荐", summary: "整体可用，仍有少量结构需要结合目标判断。" };
    if (score >= 60) return { label: "中等可用", summary: "吉凶混合，建议结合个人需求再做选择。" };
    if (score >= 50) return { label: "谨慎考虑", summary: "存在明显风险提示，建议多比较几个号码。" };
    return { label: "不推荐", summary: "凶星或风险结构较集中，不建议作为优先选择。" };
  }

  function limitNarrative(text) {
    const chars = Array.from(text);
    return chars.length <= 200 ? text : `${chars.slice(0, 199).join("")}…`;
  }

  function buildNarrative(result) {
    const level = levelFor(result.score);
    const recognized = result.windows.filter(item => item.hit);
    const counts = recognized.reduce((map, item) => {
      map[item.hit.star] = (map[item.hit.star] || 0) + 1;
      return map;
    }, {});
    const goodStars = ["天医", "生气", "延年", "伏位"].filter(star => counts[star]);
    const badStars = ["绝命", "五鬼", "祸害", "六煞"].filter(star => counts[star]);
    const positive = result.combos.filter(combo => combo.tone === "positive");
    const caution = result.combos.filter(combo => combo.tone === "caution");
    const positiveLabels = [...new Set(positive.map(combo => combo.label.split("+").sort().join(" × ")))];
    const cautionLabels = [...new Set(caution.map(combo => combo.label.split("+").sort().join(" × ")))];
    const positiveImpact = positive.reduce((sum, combo) => sum + combo.impact, 0);
    const cautionImpact = Math.abs(caution.reduce((sum, combo) => sum + combo.impact, 0));
    const opening = `您这个组合得${result.score}分，整体为${level.label}，${result.score >= 80 ? "气势较顺" : result.score >= 70 ? "中上可用" : result.score >= 60 ? "吉凶并见" : "风险偏重"}。`;
    const goodText = positive.length
      ? `好在${positiveLabels.slice(0, 2).join("、")}，组合加${positiveImpact}分。`
      : goodStars.length
        ? `好在有${goodStars.slice(0, 2).join("、")}象意，${goodStars.includes("天医") ? "资源与照顾" : goodStars.includes("生气") ? "人缘与机会" : "执行与稳定"}较有支撑。`
        : "目前未见明显加分组合，整体以中性观察为主。";
    const badText = caution.length
      ? `差在${cautionLabels.slice(0, 2).join("、")}，组合扣${cautionImpact}分。`
      : badStars.length
        ? `需留意${badStars.slice(0, 2).join("、")}带来的${badStars.includes("祸害") ? "口舌沟通" : badStars.includes("六煞") ? "情绪与关系" : "波动与压力"}。`
        : "暂未发现突出的冲突结构。";
    const leadStar = goodStars[0];
    const industry = leadStar === "天医" ? "较适合金融、贸易、经营与资源整合类工作"
      : leadStar === "延年" ? "较适合管理、技术、专业服务与需要负责到底的工作"
        : leadStar === "生气" ? "较适合销售、市场、咨询、传播与人脉型行业"
          : leadStar === "伏位" ? "较适合研究、行政、技术维护与长期经营"
            : "行业适配度一般，宜选择规则清晰、节奏稳定的工作";
    const relationship = goodStars.includes("天医") || goodStars.includes("生气")
      ? "感情上有人情与照顾的加分，重在把好意说出来。"
      : goodStars.includes("延年")
        ? "感情上责任感较强，但要避免只讲道理、不讲感受。"
        : badStars.length
          ? "感情上容易受情绪或口舌影响，重要话题宜当面说清。"
          : "感情表现偏中性，稳定沟通比一时感觉更重要。";
    const elementText = result.elementProfile?.matches?.length
      ? `生日喜用${result.elementProfile.preferred.join("、")}，号码含${result.elementProfile.matches.map(item => item.element).join("、")}，五行利好加${result.elementProfile.boost}分。`
      : result.elements?.dominant?.length ? `五行偏向${result.elements.dominant.slice(0, 2).join("、")}，${result.elements.fitText}。` : "五行暂无明显偏向。";
    return limitNarrative(`${opening}${goodText}${badText}${elementText}${industry}；${relationship}`);
  }

  function elementIcon(element) {
    const icons = {
      金: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 8 12 13 4 8 12 3Zm-8 9 8 5 8-5M4 16l8 5 8-5"/></svg>',
      木: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V5M12 9 6 4M12 12l6-5M12 16l-5-4M12 16l5-4"/></svg>',
      水: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3S6 10 6 14a6 6 0 0 0 12 0c0-4-6-11-6-11Z"/><path d="M9 15c.4 1.3 1.4 2 3 2"/></svg>',
      火: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c4 0 7-2.5 7-6.2 0-3.2-2-5.4-4.7-8.3.1 2.7-1.1 4.1-2.4 4.9.1-3.2-1.5-5.8-3.1-7.4C8.8 9.7 5 12.2 5 15.2 5 18.7 8 21 12 21Z"/></svg>',
      土: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M12 4v16M6 13h12M7 19h10"/></svg>'
    };
    return icons[element] || "";
  }

  function renderElementAttribute(result) {
    const target = $(`#${result.kind}-element-attribute`);
    if (!target) return;
    const dominant = result.elements?.dominant?.slice(0, 2) || [];
    target.hidden = dominant.length === 0;
    target.innerHTML = dominant.length
      ? `<span class="element-attribute-label">号码五行</span>${dominant.map(element => `<span class="element-attribute-item" data-element="${element}">${elementIcon(element)}<b>${element}</b></span>`).join("")}`
      : "";
  }

  function renderElementStats(result) {
    const kind = result.kind;
    const panel = $(`#${kind}-elements`);
    panel.innerHTML = result.elements.items.map(item => `<div class="element-row" data-element="${item.element}"><div class="element-row-top"><strong><span class="element-icon">${elementIcon(item.element)}</span>${item.element}</strong><span>${item.count} 次 · ${item.state}</span></div><div class="element-track"><i style="width:${item.strength}%"></i></div><p>${item.meaning}</p></div>`).join("");
    $(`#${kind}-element-summary`).textContent = `${result.elements.fitText}；偏弱${result.elements.weak.slice(0, 2).join("、")}`;
  }

  function renderComboDetails(result) {
    const kind = result.kind;
    const target = $(`#${kind}-combos`);
    if (!result.combos.length) {
      target.innerHTML = `<p class="combo-empty">暂无连续命中组合，按单组磁场与位置计算。</p>`;
    } else {
      const grouped = result.combos.reduce((map, combo) => {
        const displayLabel = combo.label.split("+").sort().join(" × ");
        const key = `${displayLabel}|${combo.tone}`;
        const current = map.get(key) || { ...combo, displayLabel, count: 0, totalImpact: 0 };
        current.count += 1;
        current.totalImpact += combo.impact;
        map.set(key, current);
        return map;
      }, new Map());
      const allRows = [...grouped.values()];
      const meaningfulRows = allRows.filter(combo => combo.tone !== "neutral");
      const rows = (meaningfulRows.length ? meaningfulRows : allRows).sort((a, b) => Math.abs(b.totalImpact) - Math.abs(a.totalImpact));
      target.innerHTML = rows.map(combo => {
        const impact = combo.totalImpact > 0 ? `+${combo.totalImpact}分` : combo.totalImpact < 0 ? `扣${Math.abs(combo.totalImpact)}分` : "0分";
        return `<div class="combo-row ${combo.tone}"><div class="combo-row-top"><strong>${combo.displayLabel}</strong><span>${combo.count > 1 ? `出现${combo.count}次 · ` : ""}${impact}</span></div><p>${combo.explanation}</p></div>`;
      }).join("");
    }
    const total = result.comboImpact > 0 ? `组合净加 ${result.comboImpact} 分` : result.comboImpact < 0 ? `组合净扣 ${Math.abs(result.comboImpact)} 分` : "组合净影响 0 分";
    $(`#${kind}-combo-total`).textContent = total;
    const narrative = buildNarrative(result);
    $(`#${kind}-narrative`).textContent = narrative;
    renderElementStats(result);
  }

  const processingStages = [
    { title: "评分中…", note: "正在读取号码结构与位置关系", progress: 16, duration: 1100 },
    { title: "五行统计中…", note: "正在整理金、木、水、火、土五维分布", progress: 35, duration: 1400 },
    { title: "组合评分中…", note: "正在核对磁场相邻组合与加减分", progress: 60, duration: 1850 },
    { title: "位置权重校准中…", note: "正在判断前段过程与后段结果的权重", progress: 80, duration: 1450 },
    { title: "代表性总结生成中…", note: "正在整理行业、感情与注意事项", progress: 96, duration: 1450 }
  ];

  const wait = duration => new Promise(resolve => window.setTimeout(resolve, duration));

  function setProcessingState(kind, stageIndex, progress) {
    const stage = processingStages[stageIndex] || { title: "评分完成", note: "结果已整理完毕" };
    $(`#${kind}-processing-title`).textContent = kind === "phone" ? stage.title.replaceAll("评分", "测算") : stage.title;
    $(`#${kind}-processing-note`).textContent = stage.note;
    $(`#${kind}-progress`).style.width = `${progress}%`;
    $(`#${kind}-progress-bar`).setAttribute("aria-valuenow", String(progress));
    $(`#${kind}-process-steps`).querySelectorAll("span").forEach((step, index) => {
      step.classList.toggle("active", index === stageIndex);
      step.classList.toggle("done", index < stageIndex);
    });
  }

  async function runScoring(kind, button, calculate) {
    const empty = $(`#${kind}-empty`);
    const content = $(`#${kind}-content`);
    const processing = $(`#${kind}-processing`);
    window.__scoringLocked = true;
    window.__scoringHash = `${kind}-processing`;
    document.body.classList.add("scoring-locked");
    window.location.hash = `${kind}-processing`;
    button.disabled = true;
    empty.hidden = true;
    content.hidden = true;
    processing.hidden = false;
    setProcessingState(kind, 0, 0);
    try {
      for (let index = 0; index < processingStages.length; index += 1) {
        const stage = processingStages[index];
        setProcessingState(kind, index, stage.progress);
        await wait(stage.duration);
      }
      const result = calculate();
      setProcessingState(kind, processingStages.length, 100);
      await wait(350);
      processing.hidden = true;
      renderResult(result, result.prefix);
      window.__scoringHash = `${kind}-result`;
      window.__scoringLocked = false;
      document.body.classList.remove("scoring-locked");
      window.location.hash = `${kind}-result`;
    } finally {
      window.__scoringLocked = false;
      window.__scoringHash = "";
      document.body.classList.remove("scoring-locked");
      button.disabled = false;
    }
  }

  function renderList(element, items, emptyText) {
    element.innerHTML = (items.length ? items : [emptyText]).map(item => `<li class="${items.length ? "" : "empty"}">${item}</li>`).join("");
  }

  function renderResult(result, prefix, options = {}) {
    const kind = result.kind;
    const level = levelFor(result.score);
    const content = $(`#${kind}-content`);
    $(`#${kind}-empty`).hidden = true;
    content.hidden = false;
    $(`#${kind}-score`).textContent = result.score;
    $(`#${kind}-level`).textContent = level.label;
    $(`#${kind}-summary`).textContent = level.summary;
    renderElementAttribute(result);
    const orbit = $(`#${kind}-orbit`);
    orbit.style.background = `conic-gradient(var(--cinnabar) ${result.score * 3.6}deg, rgba(165,67,49,.1) ${result.score * 3.6}deg)`;
    const display = $(`#${kind}-display`);
    const visual = kind === "phone" ? result.digits : `${prefix || ""}${result.body}`;
    display.innerHTML = [...visual].map((char, index) => `<span class="${kind === "phone" && index >= 7 ? "tail" : kind === "plate" && index >= Math.max(0, visual.length - 4) ? "tail" : ""}">${escapeText(char)}</span>`).join("");
    const max = kind === "phone" ? { pair: 40, position: 20, combination: 20, risk: 15, personal: 5, element: 4 } : { pair: 50, position: 20, combination: 15, risk: 15 };
    const metricNames = kind === "phone" ? { pair: "磁场质量", position: "位置得位", combination: "前后组合", risk: "平衡与风险", personal: "条件匹配", element: "五行利好" } : { pair: "磁场质量", position: "尾部得位", combination: "前后组合", risk: "结构与风险" };
    $(`#${kind}-metrics`).innerHTML = Object.entries(result.components).filter(([key]) => key !== "element" || result.elementProfile?.matches?.length).map(([key, value]) => `<div class="metric"><span class="metric-name">${metricNames[key]}</span><span class="metric-bar"><i style="width:${(value / max[key]) * 100}%"></i></span><span class="metric-value">${value.toFixed(1)}</span></div>`).join("");
    if (kind === "phone") {
      const benefit = $("#phone-element-benefit");
      const hasBenefit = Boolean(result.elementProfile?.matches?.length);
      benefit.hidden = !hasBenefit;
      if (hasBenefit) benefit.textContent = `五行利好 · 加${result.elementProfile.boost}分`;
    }
    renderList($(`#${kind}-positive`), result.positives, "暂未发现明显加分结构");
    renderList($(`#${kind}-risks`), result.risks, "暂未发现明显风险");
    $(`#${kind}-pairs`).innerHTML = result.windows.map(item => {
      const hit = item.hit;
      const state = !hit ? "steady" : hit.category === "吉" ? "good" : "bad";
      return `<span class="pair-token ${state}" title="${hit ? `${hit.star} · ${hit.level ? `第${hit.level}级` : "特殊"}` : "未命中，按中性处理"}"><strong>${item.pair}</strong><span>${hit ? hit.star : "中性"}</span></span>`;
    }).join("");
    renderComboDetails(result);
  }

  function createPhoneSlots() {
    const container = $("#phone-slots");
    for (let index = 0; index < 11; index += 1) {
      const input = document.createElement("input");
      input.className = "phone-slot";
      input.type = "tel";
      input.inputMode = "numeric";
      input.maxLength = 1;
      input.autocomplete = index === 0 ? "tel" : "off";
      input.setAttribute("aria-label", `手机号第${index + 1}位`);
      input.dataset.index = String(index);
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(-1);
        updatePhoneCount();
        if (input.value && index < 10) {
          requestAnimationFrame(() => container.children[index + 1].focus());
        }
      });
      input.addEventListener("keydown", event => {
        if (event.key === "Backspace" && !input.value && index > 0) container.children[index - 1].focus();
        if (event.key === "ArrowLeft" && index > 0) container.children[index - 1].focus();
        if (event.key === "ArrowRight" && index < 10) container.children[index + 1].focus();
      });
      input.addEventListener("paste", event => {
        event.preventDefault();
        const pasted = (event.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 11 - index);
        [...pasted].forEach((digit, offset) => { container.children[index + offset].value = digit; });
        const nextIndex = Math.min(10, index + pasted.length);
        container.children[nextIndex].focus();
        updatePhoneCount();
      });
      container.appendChild(input);
    }
  }

  function updatePhoneCount() {
    const digits = [...document.querySelectorAll(".phone-slot")].filter(input => input.value).length;
    $("#phone-count").textContent = `已输入 ${digits} / 11`;
    if (digits) $("#phone-error").textContent = "";
  }

  function clearPhoneSlots() {
    document.querySelectorAll(".phone-slot").forEach(input => { input.value = ""; });
    updatePhoneCount();
    $("#phone-error").textContent = "";
    document.querySelector(".phone-slot")?.focus();
  }

  function resetPhoneInput() {
    document.querySelectorAll(".phone-slot").forEach(input => { input.value = ""; });
    $("#phone-count").textContent = "已输入 0 / 11";
    $("#phone-error").textContent = "";
    document.querySelectorAll("[data-phone-calendar]").forEach(button => button.classList.toggle("selected", button.dataset.phoneCalendar === "solar"));
    document.querySelectorAll("[data-phone-gender]").forEach(button => button.classList.toggle("selected", button.dataset.phoneGender === "未知"));
    $("#phone-birthday").value = "";
    $("#phone-birth-time").value = "12:00";
    $("#phone-empty").hidden = false;
    $("#phone-processing").hidden = true;
    $("#phone-content").hidden = true;
  }

  function resetPlateInput() {
    $("#plate-prefix").value = "";
    $("#plate-body").value = "";
    $("#plate-error").textContent = "";
    $("#plate-normalized").textContent = "—";
    $("#plate-conversion-hint").textContent = "等待输入";
    $("#plate-empty").hidden = false;
    $("#plate-processing").hidden = true;
    $("#plate-content").hidden = true;
  }

  function resetScoringInputs() {
    resetPhoneInput();
    resetPlateInput();
  }

  function readPhoneSlots() {
    return [...document.querySelectorAll(".phone-slot")].map(input => input.value).join("");
  }

  function readPhoneBirthday() {
    const date = $("#phone-birthday").value;
    const time = $("#phone-birth-time").value;
    const calendar = document.querySelector("[data-phone-calendar].selected")?.dataset.phoneCalendar || "solar";
    const gender = document.querySelector("[data-phone-gender].selected")?.dataset.phoneGender || "未知";
    const hasAny = Boolean(date) || calendar === "lunar" || gender !== "未知" || time !== "12:00";
    if (!hasAny) return { value: null };
    if (!date) return { error: "请输入完整出生日期，或暂不填写生日输入。" };
    if (!time) return { error: "请选择出生时间，方便计算八字五行。" };
    return { value: { date, time, calendar, gender } };
  }

  function bindPhone() {
    createPhoneSlots();
    $("#clear-phone-slots")?.addEventListener("click", clearPhoneSlots);
    document.querySelectorAll("[data-phone-calendar], [data-phone-gender]").forEach(button => button.addEventListener("click", () => {
      const attribute = button.dataset.phoneCalendar !== undefined ? "data-phone-calendar" : "data-phone-gender";
      document.querySelectorAll(`[${attribute}]`).forEach(item => item.classList.toggle("selected", item === button));
    }));
    $("#phone-form").addEventListener("submit", async event => {
      event.preventDefault();
      $("#phone-empty").hidden = true;
      const digits = readPhoneSlots();
      if (!/^\d{11}$/.test(digits)) {
        $("#phone-error").textContent = "请输入完整的 11 位数字手机号。";
        document.querySelectorAll(".phone-slot")[digits.length]?.focus();
        return;
      }
      const birthday = readPhoneBirthday();
      if (birthday.error) {
        $("#phone-error").textContent = birthday.error;
        $("#phone-empty").hidden = false;
        return;
      }
      const button = $("#phone-form button[type=submit]");
      await runScoring("phone", button, () => analyzePhone(digits, { gender: birthday.value?.gender || "未知", birthday: birthday.value }));
      $("#phone-result").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function bindPlate() {
    const prefix = $("#plate-prefix");
    const body = $("#plate-body");
    const updateConversion = () => {
      const converted = convertPlate(body.value);
      $("#plate-normalized").textContent = converted.digits || "—";
      $("#plate-conversion-hint").textContent = converted.clean ? `${converted.clean.length} 个有效字符 · 字母已按 A=1 至 Z=26 换算` : "等待输入";
    };
    prefix.addEventListener("input", () => { prefix.value = prefix.value.slice(0, 4); });
    body.addEventListener("input", () => { body.value = body.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10); $("#plate-error").textContent = ""; updateConversion(); });
    $("#plate-form").addEventListener("submit", async event => {
      event.preventDefault();
      $("#plate-empty").hidden = true;
      if (!body.value.trim()) { $("#plate-error").textContent = "请输入车牌主体后再评分。"; body.focus(); return; }
      const converted = convertPlate(body.value);
      if (converted.digits.length < 2) { $("#plate-error").textContent = "车牌主体至少需要 2 个有效字符。"; body.focus(); return; }
      const button = $("#plate-form button[type=submit]");
      const platePrefix = prefix.value.trim().toUpperCase();
      await runScoring("plate", button, () => analyzePlate(body.value, platePrefix));
      $("#plate-result").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function bindNav() {
    let previousPage = null;
    const setPage = () => {
      const route = location.hash.slice(1).split('?')[0];
      if (window.__scoringLocked && route !== window.__scoringHash) {
        history.replaceState(null, '', '#' + window.__scoringHash); return;
      }
      const pages = {'phone-section':'phone','plate-section':'plate','chooser-section':'chooser','phone-result':'phone-result','plate-result':'plate-result','phone-processing':'phone-processing','plate-processing':'plate-processing'};
      if (!pages[route]) { location.replace(route.startsWith('plate') ? '#plate-section' : '#phone-section'); return; }
      const page = pages[route];
      document.body.className = 'page-' + page;
      const kind = page.startsWith('phone') ? 'phone' : page.startsWith('plate') ? 'plate' : null;
      if (kind && page === kind + '-result' && $(`#${kind}-content`).hidden) { location.replace('#'+kind+'-section'); return; }
      if (kind && page === kind && previousPage === kind + '-result') { if (kind === 'phone') resetPhoneInput(); else resetPlateInput(); }
      const names = {phone:'手机号测算',plate:'车牌号测算',chooser:'取名助手'};
      document.title = '延西易创 · ' + names[kind || page];
      if (previousPage !== page) requestAnimationFrame(() => window.scrollTo(0,0));
      previousPage = page;
    };
    document.querySelector('.skip-link')?.addEventListener('click',event=>{event.preventDefault();document.querySelector('main').scrollIntoView();});
    window.addEventListener('hashchange',setPage);window.addEventListener('popstate',setPage);setPage();
  }

  bindPhone();
  bindPlate();
  bindNav();
})();
