import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is MSPL AutoPartsFinderPro?",
    answer: "It's a Shopify app that adds a Make, Model, and Year search to your store, making it easier for customers to find what they're looking for."
  },
  {
    question: "Is it only for auto parts?",
    answer: "No, it can be used for any industry that needs a filtered search. While it's perfect for auto parts, it also works great for hardware, electronics, and any other industry where customers need to search by specific attributes."
  },
  {
    question: "How much does it cost?",
    answer: "It's $9.99/month, with a 3-day free trial. There are no hidden fees or setup costs."
  },
  {
    question: "How do I get started?",
    answer: "Just click the 'Get a 3-Day Free Trial' button and follow the instructions on the Shopify App Store. Installation takes just a few minutes."
  },
  {
    question: "Does it work with my Shopify theme?",
    answer: "Yes! MSPL AutoPartsFinderPro works with all the latest Shopify themes and integrates seamlessly with your existing store design."
  },
  {
    question: "Can I customize the search attributes?",
    answer: "Absolutely! You can customize the search attributes to fit your specific industry needs, whether that's Make/Model/Year for auto parts or other relevant filters for your products."
  },
  {
    question: "How long does setup take?",
    answer: "Most stores are live in less than 30 minutes."
  },
  {
    question: "Can I import thousands of products?",
    answer: "Yes, the bulk CSV import is built for large catalogs."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-slate-50 via-white to-primary/10">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-primary/70 via-primary to-primary/70" />
          <p className="mt-6 text-lg text-muted-foreground">
            Have questions? We have answers.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-5">
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                type="single"
                collapsible
                className="w-full"
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border rounded-xl bg-white shadow-sm px-6 transition-all hover:shadow-md hover:border-primary/30 data-[state=open]:border-primary/40"
                >
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;