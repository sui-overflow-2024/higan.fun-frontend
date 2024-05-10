'use client'
import {Experiment} from "@/components/Experiment";

export default function ExperimentPage() {

    return (
        <main className="bg-background flex min-h-screen flex-col items-center justify-between p-24">
            <Experiment/>
        </main>
    );
}