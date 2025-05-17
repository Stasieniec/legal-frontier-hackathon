'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function Results() {
  const mockResults = {
    score: 78,
    risks: [
      { level: 'high', description: 'Lack of transparency documentation' },
      { level: 'medium', description: 'Incomplete data governance procedures' },
      { level: 'low', description: 'Minor logging inconsistencies' },
    ],
    recommendations: [
      'Implement comprehensive model documentation',
      'Establish clear data handling protocols',
      'Enhance monitoring systems',
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Compliance Analysis Results</h1>
          <p className="text-muted-foreground">
            Here's your detailed AI Act compliance report
          </p>
        </div>

        <Card className="p-6 bg-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Compliance Score</h2>
            <div className="text-4xl font-bold text-primary">
              {mockResults.score}%
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Risk Assessment</h3>
              <div className="space-y-3">
                {mockResults.risks.map((risk, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {risk.level === 'high' && <XCircle className="text-destructive h-5 w-5" />}
                    {risk.level === 'medium' && <AlertCircle className="text-yellow-500 h-5 w-5" />}
                    {risk.level === 'low' && <CheckCircle2 className="text-green-500 h-5 w-5" />}
                    <span className="text-muted-foreground">{risk.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {mockResults.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <Link href="/check">
            <Button variant="outline">
              Run Another Check
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}