import WebsiteAuditTool from "@/components/audit/website-audit-tool-wrapper"

export default function Home() {
  return (
    <main className="flex-1">
        <section className="w-full pt-4 md:pt-8 lg:pt-12 xl:pt-12">
        <div className="container px-4 md:px-6">
          <div className="flex justify-center space-y-4 py-8">
            <h1>
              Audit de site web
            </h1>
          </div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto">
        <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
          Analyze your website's marketing effectiveness across multiple dimensions including performance, SEO, content,
          and conversion optimization.
        </p>
        <WebsiteAuditTool />
      </div>
    </main>
  )
}

