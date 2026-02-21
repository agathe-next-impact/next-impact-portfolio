import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { title } from 'process';

interface Heroprops {
    badgeText: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    buttonVariant?: 'primary' | 'secondary';
}

export default function HeroLanding({
    badgeText,
    title,
    subtitle,
    buttonText,
    buttonLink,
    buttonVariant = 'primary',
}: Heroprops) {
    return (
        <section className="container mx-auto px-4 md:py-16 pt-16 text-center">
            <Badge
                variant="outline"
                className="mb-4 border-regularblue/20 text-regularblue"
            >
                {badgeText}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
                {title}
            </h1>
            <p className="text-xl text-regularblue/80 max-w-2xl mx-auto mb-8">
                {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={buttonLink}>
                    <Button
                        size="lg"
                        className="gap-1 rounded-full text-white bg-regularblue/90 hover:bg-regularblue/80"
                        variant={buttonVariant}
                    >
                        {buttonText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                <a
                    href="https://calendar.app.google/CiBQuqFLNu3vJwSc7"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        size="lg"
                        variant="outline"
                        className="gap-1 rounded-full text-regularblue bg-extralightblue/40 hover:bg-extralightblue/30"
                    >
                        Prendre rendez-vous
                    </Button>
                </a>
            </div>
        </section>
    );
}