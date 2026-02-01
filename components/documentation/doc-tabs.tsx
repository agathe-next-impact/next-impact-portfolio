import { getAllArticles } from "@/lib/markdown";

import { SearchDocumentation } from "@/components/documentation/search-documentation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocTabs() {
    const articles = getAllArticles().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    // Définir les catégories pour la recherche
    const categories = [
      {
        id: "Marketing digital",
        title: "Marketing digital",
        description: "Principes et concepts de base du marketing digital",
        url: "/documentation/marketing-digital",
      },
      {
        id: "Design & UI/UX",
        title: "Design & UI/UX",
        description: "Principes et concepts du design et de l'UI/UX",
        url: "/documentation/design-ui-ux",
      },
      {
        id: "Projet de site web",
        title: "Projet de site web",
        description: "Préparer et mener un projet de site web",
        url: "/documentation/projet-site-web",
      },  
      {
        id: "WordPress",
        title: "WordPress",
        description: "Choisir WordPress pour votre site web",
        url: "/documentation/wordpress",
      },
      {
        id: "Headless CMS",
        title: "Headless CMS",
        description: "Choisir Headless CMS pour votre site web",
        url: "/documentation/headless-cms",
      },      
      {
        id: "SEO",
        title: "SEO",
        description: "Optimisation pour les moteurs de recherche",
        url: "/documentation/seo",
      },
      {
        id: "Blog",
        title: "Blog",
        description: "Les derniers actualités du blog",
        url: "/documentation/blog",
      },
    ];
  
    // Filtrer les articles par catégorie
    const marketingArticles = articles.filter(
      (article) => article.category === "marketing-digital"
    );
    const designArticles = articles.filter(
      (article) => article.category === "design-ui-ux"
    );
    const projetArticles = articles.filter(
      (article) => article.category === "projet-site-web"
    );
    const wordpressArticles = articles.filter(
      (article) => article.category === "wordpress"
    );
    const headlessCmsArticles = articles.filter(
      (article) => article.category === "headless-cms"
    );
    const seoArticles = articles.filter(
      (article) => article.category === "seo");
    const blogArticles = articles.filter(
      (article) => article.category === "blog"
    );
  

        return (
            <>
            <section className="w-full pt-2">
              <div className="container px-4 md:px-6">
                <div className="flex justify-center space-y-4">
                  <SearchDocumentation
                    articles={articles}
                    categories={categories}
                  />
                </div>
              </div>
            </section>
            <section className="w-full py-8">
              <div className="container lg:px-4 md:px-6 px-0">
                <Tabs defaultValue="projet-site-web" className="w-full">
                  <TabsList
                    className="w-full h-full justify-start rounded-none border-b bg-transparent p-0 overflow-x-auto lg:flex-nowrap flex-wrap flex gap-4 scrollbar-thin scrollbar-thumb-lightblue/40 scrollbar-track-transparent "
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    <TabsTrigger
                      value="projet-site-web"
                      className="rounded-none text-base font-regular text-regularblue border-b-2 border-transparent px-4 py-2 data-[state=active]:border-lightblue whitespace-nowrap"
                    >
                      Projet web
                    </TabsTrigger>
                    <TabsTrigger
                      value="marketing-digital"
                      className="rounded-none text-base font-regular text-regularblue border-b-2 border-transparent px-4 py-2 data-[state=active]:border-lightblue whitespace-nowrap"
                    >
                      Marketing
                    </TabsTrigger>
                    <TabsTrigger
                      value="design-ui-ux"
                      className="rounded-none text-base font-regular text-regularblue border-b-2 border-transparent px-4 py-2 data-[state=active]:border-lightblue whitespace-nowrap"
                    >
                      Design & UI/UX
                    </TabsTrigger>
                    <TabsTrigger
                      value="seo"
                      className="rounded-none text-base font-regular text-regularblue border-b-2 border-transparent px-4 py-2 data-[state=active]:border-lightblue whitespace-nowrap"
                    >
                      SEO
                    </TabsTrigger>
                    <TabsTrigger
                      value="wordpress"
                      className="rounded-none text-base font-regular text-regularblue border-b-2 border-transparent px-4 py-2 data-[state=active]:border-lightblue whitespace-nowrap"
                    >
                      WordPress
                    </TabsTrigger>
                    <TabsTrigger
                      value="headless-cms"
                      className="rounded-none text-base font-regular text-regularblue border-b-2 border-transparent px-4 py-2 data-[state=active]:border-lightblue whitespace-nowrap"
                    >
                      Headless CMS
                    </TabsTrigger>
                    <TabsTrigger
                      value="blog"
                      className="rounded-none text-base font-regular text-regularblue border-b-2 border-transparent px-4 py-2 data-[state=active]:border-lightblue whitespace-nowrap"
                    >
                      Blog
                    </TabsTrigger>
                      </TabsList>
                  <TabsContent value="all" className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {articles.map((article) => (
                        <div
                          key={article.slug}
                          className="group relative rounded-xl bg-white p-6 border border-lightblue/10 hover:border-lightblue/20 transition-colors">
                          <div className="space-y-2 text-left ">
                            <h3 className="text-xl font-medium text-regularblue">{article.title}</h3>
                            <p className="text-mediumblue">
                              {article.description}
                            </p>
                          </div>
                          <Link
                            href={`/documentation/${article.category}/${article.slug}`}
                            className="absolute inset-0 rounded-lg"
                            aria-label={article.title}>
                            <span className="sr-only">{article.title}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="marketing-digital" className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {marketingArticles.map((article) => (
                        <div
                          key={article.slug}
                          className="group relative rounded-xl bg-mediumblue/80 backdrop-blur-md p-6 border border-lightblue/10 hover:border-lightblue/20 transition-colors">
                          <div className="space-y-2 text-left">
                            <h3 className="text-xl font-medium text-white/80">{article.title}</h3>
                            <p className="text-white/80 text-sm">
                              {article.description}
                            </p>
                          </div>
                          <Link
                            href={`/documentation/${article.category}/${article.slug}`}
                            className="absolute inset-0 rounded-lg"
                            aria-label={article.title}>
                            <span className="sr-only">{article.title}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="design-ui-ux" className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {designArticles.map((article) => (
                        <div
                          key={article.slug}
                          className="group relative rounded-xl bg-mediumblue/80 backdrop-blur-md p-6 border border-lightblue/10 hover:border-lightblue/20 transition-colors">
                          <div className="space-y-2 text-left">
                            <h3 className="text-xl font-medium text-white/80">{article.title}</h3>
                            <p className="text-white/80 text-sm">
                              {article.description}
                            </p>
                          </div>
                          <Link
                            href={`/documentation/${article.category}/${article.slug}`}
                            className="absolute inset-0 rounded-lg"
                            aria-label={article.title}>
                            <span className="sr-only">{article.title}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="projet-site-web" className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {projetArticles.map((article) => (
                        <div
                          key={article.slug}
                          className="group relative rounded-xl bg-mediumblue/80 backdrop-blur-md p-6 border border-lightblue/10 hover:border-lightblue/20 transition-colors">
                          <div className="space-y-2 text-left">
                            <h3 className="text-xl font-medium text-white/80">{article.title}</h3>
                            <p className="text-white/80 text-sm">
                              {article.description}
                            </p>
                          </div>
                          <Link
                            href={`/documentation/${article.category}/${article.slug}`}
                            className="absolute inset-0 rounded-lg"
                            aria-label={article.title}>
                            <span className="sr-only">{article.title}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="wordpress" className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {wordpressArticles.map((article) => (
                        <div
                          key={article.slug}
                          className="group relative rounded-xl bg-mediumblue/80 backdrop-blur-md p-6 border border-lightblue/10 hover:border-lightblue/20 transition-colors">
                          <div className="space-y-2 text-left">
                            <h3 className="text-xl font-medium text-white/80">{article.title}</h3>
                            <p className="text-white/80 text-sm">
                              {article.description}
                            </p>
                          </div>
                          <Link
                            href={`/documentation/${article.category}/${article.slug}`}
                            className="absolute inset-0 rounded-lg"
                            aria-label={article.title}>
                            <span className="sr-only">{article.title}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="headless-cms" className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {headlessCmsArticles.map((article) => (
                        <div
                          key={article.slug}
                          className="group relative rounded-xl bg-mediumblue/80 backdrop-blur-md p-6 border border-lightblue/10 hover:border-lightblue/20 transition-colors">
                          <div className="space-y-2 text-left">
                            <h3 className="text-xl font-medium text-white/80">{article.title}</h3>
                            <p className="text-white/80 text-sm">
                              {article.description}
                            </p>
                          </div>
                          <Link
                            href={`/documentation/${article.category}/${article.slug}`}
                            className="absolute inset-0 rounded-lg"
                            aria-label={article.title}>
                            <span className="sr-only">{article.title}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="seo" className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {seoArticles.map((article) => (
                        <div
                          key={article.slug}
                          className="group relative rounded-xl bg-mediumblue/80 backdrop-blur-md p-6 border border-lightblue/10 hover:border-lightblue/20 transition-colors">
                          <div className="space-y-2 text-left">
                            <h3 className="text-xl font-medium text-white/80">{article.title}</h3>
                            <p className="text-white/80 text-sm">
                              {article.description}
                            </p>
                          </div>
                          <Link
                            href={`/documentation/${article.category}/${article.slug}`}
                            className="absolute inset-0 rounded-lg"
                            aria-label={article.title}>
                            <span className="sr-only">{article.title}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="blog" className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {blogArticles.map((article) => (
                        <div
                          key={article.slug}
                          className="group relative rounded-xl bg-mediumblue/80 backdrop-blur-md p-6 border border-lightblue/10 hover:border-lightblue/20 transition-colors">
                          <div className="space-y-2 text-left">
                            <h3 className="text-xl font-medium text-white/80">{article.title}</h3>
                            <p className="text-white/80 text-sm">
                              {article.description}
                            </p>
                          </div>
                          <Link
                            href={`/documentation/${article.category}/${article.slug}`}
                            className="absolute inset-0 rounded-lg"
                            aria-label={article.title}>
                            <span className="sr-only">{article.title}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                </Tabs>
              </div>
            </section>
            
          </>
        );

}