import { ContentType } from './types';

export const contentTypes: {
  value: ContentType;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    value: 'educational',
    label: 'تعليمي',
    icon: '🎓',
    color: 'text-blue-500',
  },
  {
    value: 'entertainment',
    label: 'ترفيهي',
    icon: '🎉',
    color: 'text-pink-500',
  },
  {
    value: 'inspirational',
    label: 'ملهم',
    icon: '✨',
    color: 'text-yellow-500',
  },
  {
    value: 'interactive',
    label: 'تفاعلي',
    icon: '💬',
    color: 'text-green-500',
  },
  {
    value: 'promotional',
    label: 'ترويجي',
    icon: '💰',
    color: 'text-purple-500',
  },
];
