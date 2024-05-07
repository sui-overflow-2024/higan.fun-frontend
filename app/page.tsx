import Image from "next/image";
import {TokenCard} from "@/components/token_card";

export default function Home() {
  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-between p-24">
<TokenCard/>

    </main>
  );
}
