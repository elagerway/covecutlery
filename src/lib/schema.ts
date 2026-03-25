/** XSS-safe JSON-LD serialization — prevents script injection via </script> in data */
export function safeJsonLd(obj: Record<string, unknown>): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function breadcrumbSchema(items: [BreadcrumbItem, ...BreadcrumbItem[]]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export interface FAQ {
  question: string
  answer: string
}

export function faqPageSchema(faqs: readonly FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}
