(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const stemElements = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
  const branchElements = ["水", "土", "木", "木", "土", "火", "火", "土", "金", "金", "土", "水"];
  const elementNames = ["木", "火", "土", "金", "水"];
  const recordKey = "yichuang-bazi-records-v1";
  const state = { sex: "男", calendar: "solar", current: null, compatSex: { a: "男", b: "男" }, recordManage: false };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const safeParse = value => { try { return JSON.parse(value); } catch { return []; } };
  const getRecords = () => safeParse(localStorage.getItem(recordKey) || "[]");
  const putRecords = records => localStorage.setItem(recordKey, JSON.stringify(records.slice(0, 30)));

  function dateParts(dateValue) {
    const [year, month, day] = String(dateValue).split("-").map(Number);
    if (!year || !month || !day) throw new Error("请选择完整的出生日期。");
    return { year, month, day };
  }

  function timeParts(timeValue) {
    const [hour, minute] = String(timeValue || "00:00").split(":").map(Number);
    if (!Number.isFinite(hour) || hour < 0 || hour > 23) throw new Error("请选择有效的出生时间。");
    return { hour, minute: Number.isFinite(minute) ? minute : 0 };
  }

  function julianDay(year, month, day) {
    const utcDay = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
    return utcDay + 2440588;
  }

  function pillar(stemIndex, branchIndex) {
    return { stem: stems[(stemIndex + 10) % 10], branch: branches[(branchIndex + 12) % 12], text: `${stems[(stemIndex + 10) % 10]}${branches[(branchIndex + 12) % 12]}`, element: stemElements[(stemIndex + 10) % 10] };
  }

  function buildPillars(dateValue, timeValue, sex, calendar) {
    const date = dateParts(dateValue);
    const time = timeParts(timeValue);
    const beforeLiChun = date.month < 2 || (date.month === 2 && date.day < 4);
    const year = date.year - (beforeLiChun ? 1 : 0);
    const yearStemIndex = (year - 4) % 10;
    const yearBranchIndex = (year - 4) % 12;
    const monthBranchIndex = (date.month + 10) % 12;
    const monthStartByYearStem = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
    const monthStemIndex = monthStartByYearStem[(yearStemIndex + 10) % 10] + monthBranchIndex;
    const dayIndex = (julianDay(date.year, date.month, date.day) + 49) % 60;
    const dayStemIndex = dayIndex % 10;
    const dayBranchIndex = dayIndex % 12;
    const hourBranchIndex = Math.floor((time.hour + 1) / 2) % 12;
    const hourStartByDayStem = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
    const hourStemIndex = hourStartByDayStem[dayStemIndex] + hourBranchIndex;
    const pillars = [
      { label: "年柱", ...pillar(yearStemIndex, yearBranchIndex) },
      { label: "月柱", ...pillar(monthStemIndex, monthBranchIndex) },
      { label: "日柱", ...pillar(dayStemIndex, dayBranchIndex) },
      { label: "时柱", ...pillar(hourStemIndex, hourBranchIndex) }
    ];
    const counts = Object.fromEntries(elementNames.map(name => [name, 0]));
    pillars.forEach(item => { counts[item.element] += 1; counts[branchElements[branches.indexOf(item.branch)]] += 1; });
    const dominant = [...elementNames].sort((a, b) => counts[b] - counts[a])[0];
    const missing = elementNames.filter(name => counts[name] === 0);
    const dayMaster = pillars[2];
    const sameYinYang = ((yearStemIndex % 2) === (sex === "男" ? 0 : 1));
    const luckDirection = sameYinYang ? 1 : -1;
    const luck = Array.from({ length: 6 }, (_, index) => {
      const branchIndex = monthBranchIndex + luckDirection * (index + 1);
      const stemIndex = monthStemIndex + luckDirection * (index + 1);
      return { age: `${6 + index * 10}岁`, ...pillar(stemIndex, branchIndex) };
    });
    return { dateValue, timeValue, sex, calendar, year, pillars, counts, dominant, missing, dayMaster, luck, dayIndex };
  }

  // Shared by the phone-number calculator so its optional birthday aid uses
  // the same five-element structure as the bazi page.
  window.__getBaziElementUse = (dateValue, timeValue, sex = "男", calendar = "solar") => {
    try {
      const data = buildPillars(dateValue, timeValue, sex, calendar);
      const weakest = [...elementNames].sort((a, b) => data.counts[a] - data.counts[b]);
      const preferred = (data.missing.length ? data.missing : weakest).slice(0, 2);
      return { preferred, counts: data.counts, dayMaster: data.dayMaster.element, dominant: data.dominant, missing: data.missing };
    } catch (_) {
      return null;
    }
  };

})();
