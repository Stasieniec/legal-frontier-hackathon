'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <div className="rounded-full bg-primary/10 p-4">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            EU AI Act Compliance
            <span className="text-primary"> Made Simple</span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Automatically analyze your AI project's compliance with the EU AI Act. Get detailed reports and recommendations in minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            <div className="bg-card p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Quick Analysis</h3>
              <p className="text-sm text-muted-foreground">Get comprehensive compliance reports in minutes, not days</p>
            </div>
            <div className="bg-card p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Detailed Insights</h3>
              <p className="text-sm text-muted-foreground">Receive actionable recommendations for compliance improvement</p>
            </div>
            <div className="bg-card p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">Keep track of your compliance status as regulations evolve</p>
            </div>
          </div>

          <Link href="/check" className="mt-8">
            <Button size="lg" className="group">
              Start Compliance Check
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}