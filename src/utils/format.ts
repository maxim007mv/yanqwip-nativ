import dayjs from 'dayjs';
import type { GeneratedRoute, RouteStep } from '../types/api';

export const formatTimeRange = (step: RouteStep): string => {
  if (!step.start_time && !step.end_time) {
    return step.duration_minutes ? `~${step.duration_minutes} мин` : '';
  }

  const start = step.start_time ? dayjs(step.start_time).format('HH:mm') : '';
  const end = step.end_time ? dayjs(step.end_time).format('HH:mm') : '';

  if (start && end) {
    return `${start} — ${end}`;
  }
  return start || end;
};

export const formatDuration = (minutes?: number | null): string => {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} ч ${rest} мин` : `${hours} ч`;
};

export const buildRouteShareMessage = (route: GeneratedRoute): string => {
  const lines: string[] = [];
  lines.push(`Маршрут: ${route.title}`);
  if (route.summary.intro) {
    lines.push(route.summary.intro);
  }
  lines.push('\nПлан:');
  route.steps.forEach((step, index) => {
    const indexLabel = `${index + 1}.`;
    const timeRange = formatTimeRange(step);
    const duration = formatDuration(step.duration_minutes);
    const meta = [timeRange, duration].filter(Boolean).join(' · ');
    const header = meta ? `${indexLabel} ${step.title} (${meta})` : `${indexLabel} ${step.title}`;
    lines.push(header);
    lines.push(step.description);
    if (step.address) {
      lines.push(`📍 ${step.address}`);
    }
    if (step.website) {
      lines.push(`🌐 ${step.website}`);
    }
    lines.push('');
  });
  if (route.yandex_url) {
    lines.push(`Маршрут в Яндекс.Картах: ${route.yandex_url}`);
  }
  return lines.join('\n');
};
