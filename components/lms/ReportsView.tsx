"use client";

import { useEffect, useState } from "react";
import { api, useToast } from "@/components/lms/toast";
import { LoadingState } from "@/components/lms/ui";

export default function ReportsView() {
  const { push } = useToast();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api("/api/reports").then(setData).catch((err) => push(err.message, "error"));
  }, []);

  if (!data) return <LoadingState />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="lms-card p-6 overflow-x-auto">
          <h2 className="font-semibold mb-3">Classes</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th>Name</th>
                <th>Teacher</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              {data.classes.map((item: any) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="py-2">{item.name}</td>
                  <td>{item.teacher}</td>
                  <td>{item.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="lms-card p-6 overflow-x-auto">
          <h2 className="font-semibold mb-3">Quiz averages</h2>
          {data.quizzes.map((item: any) => (
            <p key={item.id} className="text-sm py-1">
              {item.title}: {item.average} ({item.attempts} attempts)
            </p>
          ))}
        </section>
        <section className="lms-card p-6 overflow-x-auto">
          <h2 className="font-semibold mb-3">Assignment completion</h2>
          {data.assignments.map((item: any) => (
            <p key={item.id} className="text-sm py-1">
              {item.title}: {item.graded}/{item.submissions} graded
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}
