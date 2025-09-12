"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import type { Post, TargetMix } from "@/lib/types"
import { contentTypes } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MixAnalysisChartProps {
  posts: Post[]
  targetMix?: TargetMix
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export function MixAnalysisChart({ posts, targetMix }: MixAnalysisChartProps) {
  const actualMix = React.useMemo(() => {
    const mixCount = posts.reduce((acc, post) => {
      acc[post.contentType] = (acc[post.contentType] || 0) + 1
      return acc
    }, {} as Record<keyof TargetMix, number>)

    const totalPosts = posts.length
    if (totalPosts === 0) {
      return contentTypes.map(ct => ({ name: ct.label, value: 0, target: targetMix ? targetMix[ct.value] : 20 }));
    }

    return contentTypes.map(ct => ({
      name: ct.label,
      value: parseFloat(((mixCount[ct.value] || 0) / totalPosts * 100).toFixed(1)),
      target: targetMix ? targetMix[ct.value] : 20,
    }));
  }, [posts, targetMix])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">تحليل المزيج (آخر 30 يومًا)</CardTitle>
        <CardDescription>مقارنة بين المزيج الفعلي والمستهدف للمحتوى المنشور.</CardDescription>
      </CardHeader>
      <CardContent>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={actualMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {actualMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {actualMix.map((item) => {
                const difference = item.value - item.target;
                const isOffTarget = Math.abs(difference) > 5; // 5% tolerance
                return (
                  <div key={item.name} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={isOffTarget && item.value > item.target ? "text-destructive font-bold" : ""}>
                        {item.value}%
                      </span>
                      <span className="text-muted-foreground text-xs">(المستهدف: {item.target}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا توجد بيانات كافية لعرض التحليل.</p>
            <p className="text-sm text-muted-foreground">ابدأ بنشر بعض المحتوى أولاً.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
