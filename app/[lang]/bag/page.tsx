import type { Metadata } from "next";
import type { Lang } from "@/lib/catalog";
import { dict } from "@/lib/dict";
import BagView from "@/components/BagView";

export async function generateMetadata({ params }: PageProps<"/[lang]/bag">): Promise<Metadata> {
  return { title: dict((await params).lang as Lang).bag.title };
}

export default async function Bag({ params }: PageProps<"/[lang]/bag">) {
  return <BagView lang={(await params).lang as Lang} />;
}
