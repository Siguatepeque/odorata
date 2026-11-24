import type { Metadata } from "next";
import { dict } from "@/lib/i18n";
import type { Lang } from "@/lib/products";
import HowToBuy from "@/components/HowToBuy";

export async function generateMetadata({ params }: PageProps<"/[lang]/como-comprar">): Promise<Metadata> {
  return { title: dict((await params).lang as Lang).how.title };
}

export default async function Page({ params }: PageProps<"/[lang]/como-comprar">) {
  return <HowToBuy lang={(await params).lang as Lang} />;
}
